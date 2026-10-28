import ProductoModel from '../models/productos.model.js';
import MovimientoInventario from '../models/movimientoInventario.model.js';

class InventarioService {
    async obtenerInventario() {
        try {
            const productos = await ProductoModel.find({}, 'nombre precio stock stockMinimo categoria').sort({ nombre: 1 });
            return { success: true, data: productos };
        } catch (error) {
            throw new Error(`Error al obtener el inventario: ${error.message}`);
        }
    }

    async ajustarStockManual(id, cantidadAjuste, tipo = 'entrada', motivo = 'Ajuste manual de inventario', usuarioId = null) {
        try {
            const producto = await ProductoModel.findById(id);
            if (!producto) {
                throw new Error('Producto no encontrado en el inventario');
            }

            const stockAnterior = producto.stock;

            if (tipo === 'entrada') {
                producto.stock += cantidadAjuste;
            } else if (tipo === 'salida') {
                if (producto.stock < cantidadAjuste) {
                    throw new Error(`Stock insuficiente. Stock actual: ${producto.stock}`);
                }
                producto.stock -= cantidadAjuste;
            }

            await producto.save();

            // Registrar el movimiento en el historial (Kardex)
            await MovimientoInventario.create({
                productoId: producto._id,
                tipo,
                cantidad: cantidadAjuste,
                stockAnterior,
                stockNuevo: producto.stock,
                motivo,
                usuarioId
            });

            return { success: true, message: 'Stock actualizado y registrado en el historial', data: producto };
        } catch (error) {
            throw new Error(`Error al ajustar el stock: ${error.message}`);
        }
    }

    async obtenerStockBajo() {
        try {
            const productosBajos = await ProductoModel.find({
                $expr: { $lte: ['$stock', '$stockMinimo'] }
            });
            return { success: true, data: productosBajos };
        } catch (error) {
            throw new Error(`Error al consultar stock bajo: ${error.message}`);
        }
    }

    async obtenerMovimientos(productoId = null) {
        try {
            const filtro = productoId ? { productoId } : {};
            const movimientos = await MovimientoInventario.find(filtro)
                .populate('productoId', 'nombre precio')
                .sort({ createdAt: -1 });
            return { success: true, data: movimientos };
        } catch (error) {
            throw new Error(`Error al obtener el historial de movimientos: ${error.message}`);
        }
    }
}

export const inventarioService = new InventarioService();