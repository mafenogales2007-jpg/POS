import { categoriaService } from '../services/categorias.services.js';

export const listarCategorias = async (req, res) => {
    try {
        const categorias = await categoriaService.obtenerCategorias();
        res.status(200).json({ success: true, data: categorias });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const crearCategoria = async (req, res) => {
    try {
        const categoria = await categoriaService.crearCategoria(req.body);
        res.status(201).json({ success: true, message: 'Categoría creada con éxito', data: categoria });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const eliminarCategoria = async (req, res) => {
    try {
        await categoriaService.eliminarCategoria(req.params.id);
        res.status(200).json({ success: true, message: 'Categoría eliminada correctamente' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};