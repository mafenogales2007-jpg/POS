import { productosService } from '../services/productos.services.js';

const createProducto = async (req, res) => {
    try {
        const resultado = await productosService.crearProducto(req.body);
        return res.status(201).json(resultado);
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const deleteProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await productosService.eliminarProducto(id);
        
        if (!resultado.success) {
            return res.status(404).json({ success: false, message: resultado.message });
        }
        
        return res.status(200).json({
            success: true,
            message: resultado.message,
            data: resultado.data
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const patchProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await productosService.actualizarProducto(id, req.body);
        
        if (!resultado.success) {
            return res.status(404).json({ success: false, message: resultado.message });
        }
        
        return res.status(200).json(resultado);
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const getProductos = async (req, res) => {
    try {
        const resultado = await productosService.obtenerProductos();
        return res.status(200).json(resultado);
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const getProductoById = async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await productosService.obtenerProductoPorId(id);
        
        if (!resultado.success) {
            return res.status(404).json({ success: false, message: resultado.message });
        }
        
        return res.status(200).json(resultado);
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export { createProducto, getProductos, getProductoById, patchProducto, deleteProducto };