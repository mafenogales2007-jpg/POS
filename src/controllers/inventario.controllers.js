import { inventarioService } from '../services/inventario.services.js';

class InventarioController {
    
    async listarInventario(req, res, next) {
        try {
            const resultado = await inventarioService.obtenerInventario();
            return res.status(200).json({
                success: true,
                data: resultado.data
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async listarMovimientos(req, res, next) {
        try {
            const { productoId } = req.query; // Opcional: filtrar por ?productoId=...
            const resultado = await inventarioService.obtenerMovimientos(productoId);
            return res.status(200).json({
                success: true,
                count: resultado.data.length,
                data: resultado.data
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async ajustarStock(req, res, next) {
        try {
            const { id } = req.params;
            const { cantidad, tipo } = req.body; // tipo puede ser 'entrada' o 'salida'
            
            const resultado = await inventarioService.ajustarStockManual(id, Number(cantidad), tipo);
            return res.status(200).json({
                success: true,
                message: resultado.message,
                data: resultado.data
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
    
    async listarStockBajo(req, res, next) {
        try {
            const limite = req.query.limite ? Number(req.query.limite) : 5;
            const resultado = await inventarioService.obtenerStockBajo(limite);
            return res.status(200).json({
                success: true,
                count: resultado.data.length,
                data: resultado.data
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

export const inventarioController = new InventarioController();