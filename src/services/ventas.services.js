import mongoose from 'mongoose';
import { VentasModel } from '../models/ventas.model.js';
import { DetalleVentaModel } from '../models/detalleVenta.model.js';
import { ProductoModel } from '../models/productos.model.js';
import { FormaDePagoModel } from '../models/formaDePago.model.js';
import { TerceroModel } from '../models/tercero.model.js';
import { ClienteModel } from '../models/clientes.model.js';

class VentasService {
    /**
     * RF-07, RF-08, RNF-04, RNF-05:
     * Registrar venta transaccional y descontar existencias atómicamente.
     * Compatible con el payload de React 19 (CheckoutPOS.jsx).
     */
    async crearVenta(dataVenta, usuarioAutenticado) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const {
                cliente,
                formaDePago,
                subTotalVentas,
                descuento = 0,
                ivaVentas = 0,
                totalVentas,
                items = [],
                productos = []
            } = dataVenta;

            // 1. Determinar lista de productos (acepta 'items' de React o 'productos' legacy)
            const listaItems = items.length > 0 ? items : productos;
            if (!listaItems || listaItems.length === 0) {
                const err = new Error('La venta debe incluir al menos un producto');
                err.statusCode = 400;
                throw err;
            }

            // 2. Determinar el cajero responsable de la venta
            const cajeroId = usuarioAutenticado?._id || usuarioAutenticado?.id || dataVenta.cajero;
            if (!cajeroId) {
                const err = new Error('No se pudo identificar al cajero responsable de la venta');
                err.statusCode = 401;
                throw err;
            }

            // 3. Validar existencia del Cliente / Tercero
            if (!cliente) {
                const err = new Error('El cliente es obligatorio para registrar la venta');
                err.statusCode = 400;
                throw err;
            }

            let clienteValido = await TerceroModel.findById(cliente).session(session);
            if (!clienteValido) {
                // Compatibilidad de respaldo si se usa ClienteModel legacy
                clienteValido = await ClienteModel.findById(cliente).session(session);
            }
            if (!clienteValido) {
                const err = new Error(`El cliente con ID '${cliente}' no existe en la base de datos`);
                err.statusCode = 404;
                throw err;
            }

            // 4. Validar existencia de la Forma de Pago
            if (!formaDePago) {
                const err = new Error('La forma de pago es obligatoria');
                err.statusCode = 400;
                throw err;
            }

            let formaPagoValida = null;
            if (mongoose.Types.ObjectId.isValid(formaDePago)) {
                formaPagoValida = await FormaDePagoModel.findById(formaDePago).session(session);
            } else if (typeof formaDePago === 'string') {
                formaPagoValida = await FormaDePagoModel.findOne({
                    descripcionFormaDePago: new RegExp(`^${formaDePago}$`, 'i')
                }).session(session);
            }

            if (!formaPagoValida) {
                const err = new Error(`La forma de pago especificada no existe en el catálogo`);
                err.statusCode = 404;
                throw err;
            }

            // 5. RF-08: Validación de regla de negocio para Descuentos (> 10% requiere ADMIN)
            const subtotalCalculadoBase = Number(subTotalVentas) || 0;
            const descuentoAplicado = Number(descuento) || 0;

            if (subtotalCalculadoBase > 0 && descuentoAplicado > (subtotalCalculadoBase * 0.10)) {
                const rolCajero = (usuarioAutenticado?.rol || '').toUpperCase();
                if (rolCajero !== 'ADMIN') {
                    const err = new Error(`Descuento no autorizado: Los descuentos superiores al 10% ($${(subtotalCalculadoBase * 0.10).toFixed(2)}) requieren aprobación de un usuario Administrador`);
                    err.statusCode = 403;
                    throw err;
                }
            }

            // 6. Validar existencias, calcular subtotales y descontar stock atómicamente
            let subtotalAcumulado = 0;
            const detallesVentaParaGuardar = [];

            for (const item of listaItems) {
                const productoId = item.producto || item.productoId;
                const cantidadVendida = Number(item.cantidadVenta || item.cantidad || 0);

                if (!productoId) {
                    const err = new Error('Cada ítem de la venta debe tener un ID de producto válido');
                    err.statusCode = 400;
                    throw err;
                }

                if (cantidadVendida <= 0) {
                    const err = new Error('La cantidad vendida de cada producto debe ser mayor a 0');
                    err.statusCode = 400;
                    throw err;
                }

                // Buscar producto dentro de la sesión transaccional
                const productoBD = await ProductoModel.findById(productoId).session(session);
                if (!productoBD) {
                    const err = new Error(`El producto con ID '${productoId}' no existe`);
                    err.statusCode = 404;
                    throw err;
                }

                // RNF-05: Prohibición de existencias negativas
                const stockDisponible = Number(productoBD.stock ?? productoBD.totalStock ?? 0);
                if (stockDisponible < cantidadVendida) {
                    const nombreProd = productoBD.nombre || productoBD.nombreProductos || 'Producto';
                    const err = new Error(`Stock insuficiente para '${nombreProd}'. Stock disponible: ${stockDisponible}, Cantidad requerida: ${cantidadVendida}`);
                    err.statusCode = 400;
                    throw err;
                }

                // Descuento atómico de existencias dentro de la transacción
                productoBD.stock = stockDisponible - cantidadVendida;
                await productoBD.save({ session });

                // Tomar precios y calcular valores
                const precioUnitario = Number(productoBD.precio ?? productoBD.precioVenta ?? item.valorUnitarioVenta ?? item.precioUnitario ?? 0);
                const subTotalItem = precioUnitario * cantidadVendida;
                const ivaTasa = Number(productoBD.ivaProductos ?? item.ivaVenta ?? 0);
                const ivaMonto = subTotalItem * (ivaTasa / 100);
                const totalItem = subTotalItem + ivaMonto;

                subtotalAcumulado += subTotalItem;

                detallesVentaParaGuardar.push({
                    producto: productoId,
                    cantidadVenta: cantidadVendida,
                    valorUnitarioVenta: precioUnitario,
                    subTotalVenta: subTotalItem,
                    ivaVenta: ivaTasa,
                    totalVenta: totalItem
                });
            }

            // 7. Determinar totales finales
            const subTotalFinal = subtotalCalculadoBase > 0 ? subtotalCalculadoBase : subtotalAcumulado;
            const ivaTotalFinal = Number(ivaVentas) >= 0 ? Number(ivaVentas) : 0;
            const totalFinal = Number(totalVentas) > 0 ? Number(totalVentas) : (subTotalFinal - descuentoAplicado + ivaTotalFinal);

            // 8. Crear y guardar cabecera de la venta (VentasModel)
            const nuevaVenta = new VentasModel({
                cliente: clienteValido._id,
                cajero: cajeroId,
                formaDePago: formaPagoValida._id,
                subTotalVentas: subTotalFinal,
                descuento: descuentoAplicado,
                ivaVentas: ivaTotalFinal,
                totalVentas: Math.max(0, totalFinal),
                estadoVentas: 'Completada'
            });

            const ventaGuardada = await nuevaVenta.save({ session });

            // 9. Crear y guardar los registros en DetalleVentaModel vinculados a la venta
            const detallesConVentaId = detallesVentaParaGuardar.map(det => ({
                ...det,
                venta: ventaGuardada._id
            }));

            const detallesGuardados = await DetalleVentaModel.insertMany(detallesConVentaId, { session });

            // 10. Confirmar la transacción atómica
            await session.commitTransaction();
            session.endSession();

            return {
                ...ventaGuardada.toObject(),
                detalles: detallesGuardados
            };
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    }

    /**
     * RF-09: Anulación supervisada de ventas (Exclusivo ADMIN).
     * Reingresa automáticamente los productos al inventario y cambia el estado a 'Anulada'.
     */
    async anularVenta(idVenta) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const venta = await VentasModel.findById(idVenta).session(session);
            if (!venta) {
                const err = new Error(`La venta con ID '${idVenta}' no existe`);
                err.statusCode = 404;
                throw err;
            }

            if (venta.estadoVentas === 'Anulada') {
                const err = new Error('Esta venta ya se encuentra anulada previamente');
                err.statusCode = 400;
                throw err;
            }

            // Buscar todos los detalles de venta asociados a esta transacción
            const detalles = await DetalleVentaModel.find({ venta: idVenta }).session(session);

            // Reintegrar automáticamente las cantidades vendidas al stock
            for (const detalle of detalles) {
                const productoBD = await ProductoModel.findById(detalle.producto).session(session);
                if (productoBD) {
                    productoBD.stock = (Number(productoBD.stock) || 0) + Number(detalle.cantidadVenta);
                    await productoBD.save({ session });
                }
            }

            // Cambiar estado lógicamente a 'Anulada'
            venta.estadoVentas = 'Anulada';
            const ventaActualizada = await venta.save({ session });

            await session.commitTransaction();
            session.endSession();

            return {
                venta: ventaActualizada,
                detallesReintegrados: detalles.length
            };
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    }

    /**
     * Consultar historial de ventas con populate de Tercero, Usuario y FormaDePago
     */
    async obtenerVentas() {
        return await VentasModel.find()
            .populate('cliente')
            .populate('cajero', 'nombreUsuario apellidoUsuario emailUsuario documentoUsuario rol')
            .populate('formaDePago')
            .sort({ createdAt: -1 });
    }

    /**
     * Consultar una venta por su ID junto con sus detalles asociados
     */
    async obtenerVentaPorId(idVenta) {
        const venta = await VentasModel.findById(idVenta)
            .populate('cliente')
            .populate('cajero', 'nombreUsuario apellidoUsuario emailUsuario documentoUsuario rol')
            .populate('formaDePago');

        if (!venta) {
            return null;
        }

        const detalles = await DetalleVentaModel.find({ venta: idVenta })
            .populate('producto');

        return {
            ...venta.toObject(),
            detalles
        };
    }
}

export const ventasService = new VentasService();
export default ventasService;
