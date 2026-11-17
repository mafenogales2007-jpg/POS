import { comprasService } from '../services/compras.services.js';
import { handleMongooseError } from '../helpers/handle-mongoose-error.helper.js';

export const createCompra = async (req, res) => {
    try {
        const nuevaCompra = await comprasService.crearCompra(req.body, req.usuario);
        return res.status(201).json({
            success: true,
            message: 'Factura de compra registrada y existencias incrementadas exitosamente',
            data: nuevaCompra
        });
    } catch (error) {
        const errorParsed = handleMongooseError(error);
        return res.status(errorParsed.status).json(errorParsed.response);
    }
};

export const getCompras = async (req, res) => {
    try {
        const compras = await comprasService.listarCompras();
        return res.status(200).json({
            success: true,
            message: 'Historial de compras obtenido exitosamente',
            data: compras
        });
    } catch (error) {
        const errorParsed = handleMongooseError(error);
        return res.status(errorParsed.status).json(errorParsed.response);
    }
};

export const getCompraById = async (req, res) => {
    try {
        const { id } = req.params;
        const compra = await comprasService.obtenerCompraPorId(id);
        if (!compra) {
            return res.status(404).json({
                success: false,
                message: `La compra con ID '${id}' no existe`
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Detalle de compra obtenido exitosamente',
            data: compra
        });
    } catch (error) {
        const errorParsed = handleMongooseError(error);
        return res.status(errorParsed.status).json(errorParsed.response);
    }
};

export default {
    createCompra,
    getCompras,
    getCompraById
};
