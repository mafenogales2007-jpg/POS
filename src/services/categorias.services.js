import CategoriaModel from '../models/categorias.model.js';

class CategoriaService {
    async obtenerCategorias() {
        try {
            return await CategoriaModel.find().sort({ nombre: 1 });
        } catch (error) {
            throw new Error(`Error al obtener categorías: ${error.message}`);
        }
    }

    async crearCategoria(data) {
        try {
            const nuevaCategoria = new CategoriaModel(data);
            return await nuevaCategoria.save();
        } catch (error) {
            throw new Error(`Error al crear categoría: ${error.message}`);
        }
    }

    async eliminarCategoria(id) {
        try {
            const categoriaEliminada = await CategoriaModel.findByIdAndDelete(id);
            if (!categoriaEliminada) {
                throw new Error('Categoría no encontrada');
            }
            return categoriaEliminada;
        } catch (error) {
            throw new Error(`Error al eliminar categoría: ${error.message}`);
        }
    }
}

export const categoriaService = new CategoriaService();
