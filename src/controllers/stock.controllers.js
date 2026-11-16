import { stockService } from '../services/stock.services.js';
import { handleMongooseError } from '../helpers/handle-mongoose-error.helper.js';

export const getAlertasStockCritico = async (req, res) => {
    try {
        const alertas = await stockService.obtenerAlertasStockCritico();
        return res.status(200).json({
            success: true,
            message: 'Alertas de stock crítico obtenidas exitosamente',
            data: alertas
        });
    } catch (error) {
        const errorParsed = handleMongooseError(error);
        return res.status(errorParsed.status).json(errorParsed.response);
    }
};

export const getStockByProductoId = async (req, res) => {
    try {
        const { id } = req.params;
        const stock = await stockService.obtenerStockPorProducto(id);
        if (!stock) {
            return res.status(404).json({
                success: false,
                message: `No se encontró stock para el producto con ID '${id}'`
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Stock obtenido exitosamente',
            data: stock
        });
    } catch (error) {
        const errorParsed = handleMongooseError(error);
        return res.status(errorParsed.status).json(errorParsed.response);
    }
};

export const inicializarStockController = async (req, res) => {
    try {
        const { productoId, totalStock, stockMinimo } = req.body;
        const stock = await stockService.inicializarStock(productoId, totalStock, stockMinimo);
        return res.status(200).json({
            success: true,
            message: 'Stock inicializado/actualizado exitosamente',
            data: stock
        });
    } catch (error) {
        const errorParsed = handleMongooseError(error);
        return res.status(errorParsed.status).json(errorParsed.response);
    }
};

export default {
    getAlertasStockCritico,
    getStockByProductoId,
    inicializarStockController
};
