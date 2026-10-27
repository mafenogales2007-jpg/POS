import { obtenerStockBajoService } from '../services/productos.services.js';
import { obtenerProductosService, crearProductoService, actualizarStockService, eliminarProductoService } from '../services/productos.services.js';

export const listarProductos = async (req, res, next) => {
    try {
        const productos = await obtenerProductosService();
        res.status(200).json({ success: true, data: productos });
    } catch (error) {
        next(error);
    }
};

export const crearProducto = async (req, res, next) => {
    try {
        const producto = await crearProductoService(req.body);
        res.status(201).json({ success: true, message: 'Producto registrado exitosamente', data: producto });
    } catch (error) {
        next(error);
    }
};

export const modificarStock = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { stock } = req.body;
        const producto = await actualizarStockService(id, stock);
        res.status(200).json({ success: true, message: 'Stock actualizado correctamente', data: producto });
    } catch (error) {
        next(error);
    }
};

export const eliminarProducto = async (req, res, next) => {
    try {
        const { id } = req.params;
        await eliminarProductoService(id);
        res.status(200).json({ 
            success: true, 
            message: 'Producto eliminado correctamente del inventario' 
        });
    } catch (error) {
        next(error);
    }
};

export const listarStockBajo = async (req, res, next) => {
    try {
        const limite = req.query.limite ? Number(req.query.limite) : 5;
        const productosBajos = await obtenerStockBajoService(limite);
        res.status(200).json({ 
            success: true, 
            count: productosBajos.length,
            data: productosBajos 
        });
    } catch (error) {
        next(error);
    }
};