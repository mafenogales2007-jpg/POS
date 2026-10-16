import { categoriasService } from '../services/categorias.services.js';

const createCategoria = async (req, res) => {
    try {
        const resultado = await categoriasService.crearCategoria(req.body);
        return res.status(201).json(resultado);
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const getCategorias = async (req, res) => {
    try {
        const resultado = await categoriasService.obtenerCategorias();
        return res.status(200).json(resultado);
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const patchCategoria = async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await categoriasService.actualizarCategoria(id, req.body);
        if (!resultado.success) {
            return res.status(404).json({ success: false, message: resultado.message });
        }
        return res.status(200).json(resultado);
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const deleteCategoria = async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await categoriasService.eliminarCategoria(id);
        if (!resultado.success) {
            return res.status(404).json({ success: false, message: resultado.message });
        }
        return res.status(200).json(resultado);
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export { createCategoria, getCategorias, patchCategoria, deleteCategoria };