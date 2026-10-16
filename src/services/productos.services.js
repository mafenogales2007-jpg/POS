import { ProductoModel } from '../models/productos.model.js';

class ProductosService {
    async crearProducto(datosProducto) {
        try {
            const nuevoProducto = new ProductoModel(datosProducto);
            const productoGuardado = await nuevoProducto.save();
            return {
                success: true,
                message: 'Producto creado exitosamente',
                data: productoGuardado
            };
        } catch (error) {
            throw new Error(`Error al crear el producto: ${error.message}`);
        }
    }

    async eliminarProducto(id) {
        try {
            const productoEliminado = await ProductoModel.findByIdAndDelete(id);
            if (!productoEliminado) {
                return { success: false, message: 'Producto no encontrado para eliminar' };
            }
            return { success: true, message: 'Producto eliminado exitosamente', data: productoEliminado };
        } catch (error) {
            throw new Error(`Error al eliminar el producto: ${error.message}`);
        }
    }

    async actualizarProducto(id, datosNuevos) {
        try {
            const productoActualizado = await ProductoModel.findByIdAndUpdate(
                id, 
                datosNuevos, 
                { new: true, runValidators: true }
            );
            if (!productoActualizado) {
                return { success: false, message: 'Producto no encontrado para actualizar' };
            }
            return { success: true, message: 'Producto actualizado exitosamente', data: productoActualizado };
        } catch (error) {
            throw new Error(`Error al actualizar el producto: ${error.message}`);
        }
    }

    async obtenerProductos() {
        try {
            const productos = await ProductoModel.find();
            return { success: true, data: productos };
        } catch (error) {
            throw new Error(`Error al obtener los productos: ${error.message}`);
        }
    }

    async obtenerProductoPorId(id) {
        try {
            const producto = await ProductoModel.findById(id);
            if (!producto) {
                return { success: false, message: 'Producto no encontrado' };
            }
            return { success: true, data: producto };
        } catch (error) {
            throw new Error(`Error al buscar el producto: ${error.message}`);
        }
    }
}



export const productosService = new ProductosService();