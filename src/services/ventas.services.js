import { VentaModel } from '../models/ventas.model.js';
import { ProductoModel } from '../models/productos.model.js';
import { ClienteModel } from '../models/clientes.model.js'; // Importación necesaria del modelo de clientes

class VentasService {
    // 1. Registrar una nueva venta y descontar stock
    async crearVenta(dataVenta) {
        try {
            let subtotalGeneral = 0;
            const productosConSubtotal = [];

            // Validar el cliente solo si viene incluido en la petición
            if (dataVenta.cliente) {
                const clienteBD = await ClienteModel.findById(dataVenta.cliente);
                if (!clienteBD) {
                    throw new Error(`El cliente con ID ${dataVenta.cliente} no existe en la base de datos.`);
                }
            }

            // Validar y actualizar el stock de cada producto
            for (const item of dataVenta.productos) {
                const productoBD = await ProductoModel.findById(item.productoId);
                
                if (!productoBD) {
                    throw new Error(`El producto con ID ${item.productoId} no existe`);
                }

                if (productoBD.stock < item.cantidad) {
                    throw new Error(`Stock insuficiente para el producto: ${productoBD.nombre || item.nombreProducto}. Stock disponible: ${productoBD.stock}`);
                }

                // Descontar la cantidad vendida del stock actual
                productoBD.stock -= item.cantidad;
                await productoBD.save();

                // Calcular subtotal del ítem
                const subtotalItem = item.cantidad * item.precioUnitario;
                subtotalGeneral += subtotalItem;

                productosConSubtotal.push({
                    ...item,
                    subtotal: subtotalItem
                });
            }

            const impuestosCalculados = dataVenta.impuestos || 0;
            const totalFinal = subtotalGeneral + impuestosCalculados;

            // Construir y guardar la venta final
            const nuevaVenta = new VentaModel({
                ...dataVenta,
                productos: productosConSubtotal,
                subtotal: subtotalGeneral,
                impuestos: impuestosCalculados,
                total: totalFinal
            });

            const ventaGuardada = await nuevaVenta.save();
            return { success: true, data: ventaGuardada };
        } catch (error) {
            throw new Error(`Error al registrar la venta: ${error.message}`);
        }
    }

    async eliminarVenta(id) {
        try {
            // 1. Buscar la venta para conocer los productos y cantidades vendidos
            const venta = await VentaModel.findById(id);
            if (!venta) {
                return { success: false, message: 'Venta no encontrada para anular' };
            }

            // 2. Devolver la cantidad de cada producto al stock actual
            for (const item of venta.productos) {
                const productoBD = await ProductoModel.findById(item.productoId);
                if (productoBD) {
                    productoBD.stock += item.cantidad; // Sumamos de nuevo al inventario
                    await productoBD.save();
                }
            }

            // 3. Eliminar físicamente la venta de la base de datos
            const ventaEliminada = await VentaModel.findByIdAndDelete(id);

            return { 
                success: true, 
                message: 'Venta anulada exitosamente y stock devuelto al inventario', 
                data: ventaEliminada 
            };
        } catch (error) {
            throw new Error(`Error al anular la venta: ${error.message}`);
        }
    }

    // 2. Obtener todas las ventas (con populate para cliente y productos)
    async obtenerVentas() {
        try {
            const ventas = await VentaModel.find()
                .populate('cliente')
                .populate('productos.productoId')
                .sort({ createdAt: -1 });
            return { success: true, data: ventas };
        } catch (error) {
            throw new Error(`Error al obtener las ventas: ${error.message}`);
        }
    }

    // 3. Obtener una venta por su ID
    async obtenerVentaPorId(id) {
        try {
            const venta = await VentaModel.findById(id)
                .populate('cliente')
                .populate('productos.productoId');
            if (!venta) {
                return { success: false, message: 'Venta no encontrada' };
            }
            return { success: true, data: venta };
        } catch (error) {
            throw new Error(`Error al buscar la venta: ${error.message}`);
        }
    }
}

export const ventasService = new VentasService();