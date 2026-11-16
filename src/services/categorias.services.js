import { CategoriaModel } from '../models/categorias.model.js';

class CategoriasService {
    // HU-04: Crear categoría (solo ADMIN)
    async crearCategoria(datos) {
        const nombre = datos.nombreCategoria || datos.nombre;
        if (!nombre) {
            const err = new Error('El campo nombreCategoria es obligatorio');
            err.statusCode = 400;
            throw err;
        }

        const nueva = new CategoriaModel({ nombreCategoria: nombre.trim() });
        return await nueva.save();
    }

    // Listar categorías
    async obtenerCategorias() {
        return await CategoriaModel.find().sort({ nombreCategoria: 1 });
    }

    // Obtener categoría por ID
    async obtenerCategoriaPorId(id) {
        return await CategoriaModel.findById(id);
    }
}

export const categoriasService = new CategoriasService();
export default categoriasService;
