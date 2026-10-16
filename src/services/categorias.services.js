import { CategoriaModel } from '../models/categorias.model.js';

class CategoriasService {
    async crearCategoria(datos) {
        try {
            const nuevaCategoria = new CategoriaModel(datos);
            const categoriaGuardada = await nuevaCategoria.save();
            return { success: true, message: 'Categoría creada exitosamente', data: categoriaGuardada };
        } catch (error) {
            throw new Error(`Error al crear la categoría: ${error.message}`);
        }
    }

    async obtenerCategorias() {
        try {
            const categorias = await CategoriaModel.find();
            return { success: true, data: categorias };
        } catch (error) {
            throw new Error(`Error al obtener las categorías: ${error.message}`);
        }
    }

    async actualizarCategoria(id, datosNuevos) {
        try {
            const categoriaActualizada = await CategoriaModel.findByIdAndUpdate(
                id, 
                datosNuevos, 
                { new: true, runValidators: true }
            );
            if (!categoriaActualizada) {
                return { success: false, message: 'Categoría no encontrada para actualizar' };
            }
            return { success: true, message: 'Categoría actualizada exitosamente', data: categoriaActualizada };
        } catch (error) {
            throw new Error(`Error al actualizar la categoría: ${error.message}`);
        }
    }

    async eliminarCategoria(id) {
        try {
            const categoriaEliminada = await CategoriaModel.findByIdAndDelete(id);
            if (!categoriaEliminada) {
                return { success: false, message: 'Categoría no encontrada para eliminar' };
            }
            return { success: true, message: 'Categoría eliminada exitosamente', data: categoriaEliminada };
        } catch (error) {
            throw new Error(`Error al eliminar la categoría: ${error.message}`);
        }
    }
}

export const categoriasService = new CategoriasService();