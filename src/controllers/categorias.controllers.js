import { categoriasService } from '../services/categorias.services.js';
import { handleMongooseError } from '../helpers/handle-mongoose-error.helper.js';

export const createCategoria = async (req, res) => {
    try {
        const nueva = await categoriasService.crearCategoria(req.body);
        return res.status(201).json({
            success: true,
            message: 'Categoría creada exitosamente',
            data: nueva
        });
    } catch (error) {
        const errorParsed = handleMongooseError(error);
        return res.status(errorParsed.status).json(errorParsed.response);
    }
};

export const getCategorias = async (req, res) => {
    try {
        const categorias = await categoriasService.obtenerCategorias();
        return res.status(200).json({
            success: true,
            message: 'Lista de categorías obtenida exitosamente',
            data: categorias
        });
    } catch (error) {
        const errorParsed = handleMongooseError(error);
        return res.status(errorParsed.status).json(errorParsed.response);
    }
};

export const getCategoriaById = async (req, res) => {
    try {
        const { id } = req.params;
        const categoria = await categoriasService.obtenerCategoriaPorId(id);
        if (!categoria) {
            return res.status(404).json({
                success: false,
                message: `Categoría con ID '${id}' no encontrada`
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Categoría obtenida exitosamente',
            data: categoria
        });
    } catch (error) {
        const errorParsed = handleMongooseError(error);
        return res.status(errorParsed.status).json(errorParsed.response);
    }
};

export default {
    createCategoria,
    getCategorias,
    getCategoriaById
};
