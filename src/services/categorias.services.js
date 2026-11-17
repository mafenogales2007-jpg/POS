
import { CategoriaModel } from '../models/categorias.model.js';

class CategoriasService {

    // Crear categoría
    async crearCategoria(datos) {
        const nombre = datos.nombreCategoria || datos.nombre;

        if (!nombre || !nombre.trim()) {
            const err = new Error('El campo nombreCategoria es obligatorio');
            err.statusCode = 400;
            throw err;
        }

        const nueva = new CategoriaModel({
            nombreCategoria: nombre.trim()
        });

        return await nueva.save();
    }

    // Obtener todas las categorías
    async obtenerCategorias() {
        return await CategoriaModel.find().sort({ nombreCategoria: 1 });
    }

    // Obtener categoría por ID
    async obtenerCategoriaPorId(id) {
        return await CategoriaModel.findById(id);
    }

    // Actualizar categoría
    async actualizarCategoria(id, datosNuevos) {
        return await CategoriaModel.findByIdAndUpdate(
            id,
            datosNuevos,
            {
                new: true,
                runValidators: true
            }
        );
    }

    // Eliminar categoría
    async eliminarCategoria(id) {
        return await CategoriaModel.findByIdAndDelete(id);
    }
}

export const categoriasService = new CategoriasService();
export default categoriasService;
