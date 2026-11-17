
import mongoose from 'mongoose';

import { VentasModel } from '../models/ventas.model.js';
import { DetalleVentaModel } from '../models/detalleVenta.model.js';
import { ProductosModel } from '../models/productos.model.js';
import { StockModel } from '../models/stock.model.js';
import MovimientoInventario from '../models/movimientoInventario.model.js';
import { FormaDePagoModel } from '../models/formaDePago.model.js';
import { TerceroModel } from '../models/tercero.model.js';
import { ClienteModel } from '../models/clientes.model.js';
class VentasService {

    /**
     * RF-07, RF-08, RNF-04, RNF-05:
     * Registrar venta y descontar existencias mediante transacción.
     */
    async crearVenta(dataVenta, usuarioAutenticado) {
        const session = await mongoose.startSession();

        try {
            let resultado;

            await session.withTransaction(async () => {

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

                // 1. Determinar productos de la venta
                const listaItems = items.length > 0 ? items : productos;

                if (!listaItems || listaItems.length === 0) {
                    const err = new Error('La venta debe incluir al menos un producto');
                    err.statusCode = 400;
                    throw err;
                }

                // 2. Identificar cajero
                const cajeroId =
                    usuarioAutenticado?._id ||
                    usuarioAutenticado?.id ||
                    dataVenta.cajero;

                if (!cajeroId) {
                    const err = new Error('No se pudo identificar al cajero responsable');
                    err.statusCode = 401;
                    throw err;
                }

                // 3. Validar cliente
                if (!cliente) {
                    const err = new Error('El cliente es obligatorio');
                    err.statusCode = 400;
                    throw err;
                }

                let clienteValido = await TerceroModel
                    .findById(cliente)
                    .session(session);

                if (!clienteValido) {
                    clienteValido = await ClienteModel
                        .findById(cliente)
                        .session(session);
                }

                if (!clienteValido) {
                    const err = new Error(`El cliente con ID '${cliente}' no existe`);
                    err.statusCode = 404;
                    throw err;
                }

                // 4. Validar forma de pago
                if (!formaDePago) {
                    const err = new Error('La forma de pago es obligatoria');
                    err.statusCode = 400;
                    throw err;
                }

                let formaPagoValida = null;

                if (mongoose.Types.ObjectId.isValid(formaDePago)) {
                    formaPagoValida = await FormaDePagoModel
                        .findById(formaDePago)
                        .session(session);

                } else if (typeof formaDePago === 'string') {
                    formaPagoValida = await FormaDePagoModel.findOne({
                        descripcionFormaDePago: new RegExp(
                            `^${formaDePago}$`,
                            'i'
                        )
                    }).session(session);
                }

                if (!formaPagoValida) {
                    const err = new Error('La forma de pago especificada no existe');
                    err.statusCode = 404;
                    throw err;
                }

                // 5. Validar autorización de descuentos
                const subtotalCalculadoBase = Number(subTotalVentas) || 0;
                const descuentoAplicado = Number(descuento) || 0;

                if (subtotalCalculadoBase < 0 || descuentoAplicado < 0) {
                    const err = new Error('Los valores de subtotal y descuento no pueden ser negativos');
                    err.statusCode = 400;
                    throw err;
                }

                if (
                    subtotalCalculadoBase > 0 &&
                    descuentoAplicado > subtotalCalculadoBase * 0.10
                ) {
                    const rolCajero = (
                        usuarioAutenticado?.rol || ''
                    ).toUpperCase();

                    if (rolCajero !== 'ADMIN') {
                        const err = new Error(
                            'Los descuentos superiores al 10% requieren autorización de ADMIN'
                        );
                        err.statusCode = 403;
                        throw err;
                    }
                }

                // 6. Validar productos y descontar existencias
                let subtotalAcumulado = 0;
                const detallesVentaParaGuardar = [];

                for (const item of listaItems) {

                    const productoId = item.producto || item.productoId;

                    const cantidadVendida = Number(
                        item.cantidadVenta || item.cantidad || 0
                    );

                    if (!productoId || !mongoose.isValidObjectId(productoId)) {
                        const err = new Error('Cada producto debe tener un ID válido');
                        err.statusCode = 400;
                        throw err;
                    }

                    if (!Number.isFinite(cantidadVendida) || cantidadVendida <= 0) {
                        const err = new Error('La cantidad vendida debe ser mayor que cero');
                        err.statusCode = 400;
                        throw err;
                    }

                    const productoBD = await ProductosModel
                        .findById(productoId)
                        .session(session);

                    if (!productoBD) {
                        const err = new Error(`El producto '${productoId}' no existe`);
                        err.statusCode = 404;
                        throw err;
                    }

                    if (!productoBD.estadoProductos) {
                        const err = new Error(
                            `El producto '${productoBD.nombreProductos}' está inactivo`
                        );
                        err.statusCode = 400;
                        throw err;
                    }

                    // Consultar existencias en StockModel
                    const stock = await StockModel.findOne({
                        producto: productoBD._id
                    }).session(session);

                    const stockDisponible = stock
                        ? stock.totalStock
                        : 0;

                    if (stockDisponible < cantidadVendida) {
                        const err = new Error(
                            `Stock insuficiente para '${productoBD.nombreProductos}'. ` +
                            `Disponible: ${stockDisponible}, requerido: ${cantidadVendida}`
                        );
                        err.statusCode = 400;
                        throw err;
                    }

                    // Descontar existencias
                    const stockAnterior = stock.totalStock;

                    stock.totalStock -= cantidadVendida;

                    await stock.save({ session });

                    // Registrar movimiento en el Kardex
                    await MovimientoInventario.create([{
                        productoId: productoBD._id,
                        tipo: 'venta',
                        cantidad: cantidadVendida,
                        stockAnterior,
                        stockNuevo: stock.totalStock,
                        motivo: 'Salida de inventario por venta',
                        usuarioId: cajeroId
                    }], { session });

                    // Calcular valores del detalle
                    const precioUnitario = Number(
                        productoBD.precioVenta ??
                        item.valorUnitarioVenta ??
                        item.precioUnitario ??
                        0
                    );

                    const subTotalItem = precioUnitario * cantidadVendida;

                    const ivaTasa = Number(
                        productoBD.ivaProductos ?? item.ivaVenta ?? 0
                    );

                    const ivaMonto = subTotalItem * (ivaTasa / 100);
                    const totalItem = subTotalItem + ivaMonto;

                    subtotalAcumulado += subTotalItem;

                    detallesVentaParaGuardar.push({
                        producto: productoBD._id,
                        cantidadVenta: cantidadVendida,
                        valorUnitarioVenta: precioUnitario,
                        subTotalVenta: subTotalItem,
                        ivaVenta: ivaTasa,
                        totalVenta: totalItem
                    });
                }

                // 7. Calcular totales
                const subTotalFinal = subtotalCalculadoBase > 0
                    ? subtotalCalculadoBase
                    : subtotalAcumulado;

                const ivaTotalFinal = Number(ivaVentas) >= 0
                    ? Number(ivaVentas)
                    : 0;

                const totalFinal = Number(totalVentas) > 0
                    ? Number(totalVentas)
                    : subTotalFinal - descuentoAplicado + ivaTotalFinal;

                // 8. Crear venta
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

                // 9. Crear detalles de venta
                const detallesConVentaId = detallesVentaParaGuardar.map(detalle => ({
                    ...detalle,
                    venta: ventaGuardada._id
                }));

                const detallesGuardados = await DetalleVentaModel.insertMany(
                    detallesConVentaId,
                    { session }
                );

                resultado = {
                    ...ventaGuardada.toObject(),
                    detalles: detallesGuardados
                };
            });

            return resultado;

        } catch (error) {
            throw error;

        } finally {
            await session.endSession();
        }
    }

    /**
     * RF-09:
     * Anular venta y reintegrar existencias al inventario.
     */
    async anularVenta(idVenta, usuarioId = null) {
        const session = await mongoose.startSession();

        try {
            let resultado;

            await session.withTransaction(async () => {

                if (!mongoose.isValidObjectId(idVenta)) {
                    const err = new Error('El ID de la venta no es válido');
                    err.statusCode = 400;
                    throw err;
                }

                const venta = await VentasModel
                    .findById(idVenta)
                    .session(session);

                if (!venta) {
                    const err = new Error(`La venta con ID '${idVenta}' no existe`);
                    err.statusCode = 404;
                    throw err;
                }

                if (venta.estadoVentas === 'Anulada') {
                    const err = new Error('Esta venta ya se encuentra anulada');
                    err.statusCode = 400;
                    throw err;
                }

                if (venta.estadoVentas !== 'Completada') {
                    const err = new Error('Solo se pueden anular ventas completadas');
                    err.statusCode = 400;
                    throw err;
                }

                // Buscar detalles
                const detalles = await DetalleVentaModel
                    .find({ venta: idVenta })
                    .session(session);

                // Devolver existencias
                for (const detalle of detalles) {

                    let stock = await StockModel.findOne({
                        producto: detalle.producto
                    }).session(session);

                    if (!stock) {
                        stock = new StockModel({
                            producto: detalle.producto,
                            totalStock: 0,
                            stockMinimo: 5
                        });
                    }

                    const stockAnterior = stock.totalStock;

                    stock.totalStock += detalle.cantidadVenta;

                    await stock.save({ session });

                    // Registrar reintegro en el Kardex
                    await MovimientoInventario.create([{
                        productoId: detalle.producto,
                        tipo: 'anulacion',
                        cantidad: detalle.cantidadVenta,
                        stockAnterior,
                        stockNuevo: stock.totalStock,
                        motivo: `Reintegro de existencias por anulación de venta ${idVenta}`,
                        usuarioId
                    }], { session });
                }

                // Cambiar estado de la venta
                venta.estadoVentas = 'Anulada';

                const ventaActualizada = await venta.save({ session });

                resultado = {
                    venta: ventaActualizada,
                    detallesReintegrados: detalles.length
                };
            });

            return resultado;

        } catch (error) {
            throw error;

        } finally {
            await session.endSession();
        }
    }

    // Consultar historial de ventas
    async obtenerVentas() {
        return await VentasModel.find()
            .populate('cliente')
            .populate(
                'cajero',
                'nombreUsuario apellidoUsuario emailUsuario documentoUsuario rol'
            )
            .populate('formaDePago')
            .sort({ createdAt: -1 });
    }

    // Consultar venta por ID y sus detalles
    async obtenerVentaPorId(idVenta) {
        const venta = await VentasModel.findById(idVenta)
            .populate('cliente')
            .populate(
                'cajero',
                'nombreUsuario apellidoUsuario emailUsuario documentoUsuario rol'
            )
            .populate('formaDePago');

        if (!venta) {
            return null;
        }

        const detalles = await DetalleVentaModel.find({
            venta: idVenta
        }).populate('producto');

        return {
            ...venta.toObject(),
            detalles
        };
    }
}

export const ventasService = new VentasService();

export default ventasService;
