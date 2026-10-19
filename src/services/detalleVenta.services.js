import { DetalleVentaModel } from '../models/detalleVenta.model.js';
import { ProductoModel } from '../models/productos.model.js';

class DetalleVentaService {

    // Método para obtener los detalles de venta trayendo la información del producto
    async obtenerDetalles() {
        try {
            // El populate busca por la referencia que tengas configurada en tu modelo de DetalleVenta
            const detalles = await DetalleVentaModel.find()
                .populate('producto'); // Asegúrate de que en 'detalleVenta.model.js' el campo se llame 'producto' y tenga ref: 'Producto'
            
            return {
                success: true,
                data: detalles
            };
        } catch (error) {
            throw new Error(`Error al obtener los detalles de venta: ${error.message}`);
        }
    }
    
    async crearDetalle(datos) {
        try {
            // 1. Buscar el producto para verificar su stock disponible
            const producto = await ProductoModel.findById(datos.producto);
            if (!producto) {
                return { success: false, message: 'Producto no encontrado' };
            }

            // 2. Validar si hay suficiente stock para la venta
            if (producto.stock < datos.cantidad) {
                return { 
                    success: false, 
                    message: `Stock insuficiente. Stock disponible: ${producto.stock}` 
                };
            }

            // 3. Guardar el detalle de venta
            const nuevoDetalle = new DetalleVentaModel(datos);
            const detalleGuardado = await nuevoDetalle.save();

            // 4. Descontar la cantidad vendida del stock del producto
            producto.stock -= datos.cantidad;
            await producto.save();

            return { 
                success: true, 
                message: 'Detalle de venta creado y stock actualizado exitosamente', 
                data: detalleGuardado 
            };
        } catch (error) {
            throw new Error(`Error al crear el detalle de venta: ${error.message}`);
        }
    }
}

export const detalleVentaService = new DetalleVentaService();