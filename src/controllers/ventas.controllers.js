import { ventasService } from '../services/ventas.services.js';
import { handleMongooseError } from '../helpers/handle-mongoose-error.helper.js';

/**
 * RF-07, RF-08, RNF-04:
 * Endpoint POST /api/ventas (Cajeros y Admins)
 */
export const createVenta = async (req, res) => {
    try {
        const ventaRegistrada = await ventasService.crearVenta(req.body, req.usuario);
        return res.status(201).json({
            success: true,
            message: 'Venta registrada exitosamente',
            data: ventaRegistrada
        });
    } catch (error) {
        const errorParsed = handleMongooseError(error);
        return res.status(errorParsed.status).json(errorParsed.response);
    }
};

/**
 * Endpoint GET /api/ventas
 * Listar historial de ventas
 */
export const getVentas = async (req, res) => {
    try {
        const ventas = await ventasService.obtenerVentas();
        return res.status(200).json({
            success: true,
            message: 'Historial de ventas obtenido exitosamente',
            data: ventas
        });
    } catch (error) {
        const errorParsed = handleMongooseError(error);
        return res.status(errorParsed.status).json(errorParsed.response);
    }
};

/**
 * Endpoint GET /api/ventas/:id
 * Consultar detalle de una venta por ID
 */
export const getVentaById = async (req, res) => {
    try {
        const { id } = req.params;
        const venta = await ventasService.obtenerVentaPorId(id);
        if (!venta) {
            return res.status(404).json({
                success: false,
                message: `La venta con ID '${id}' no fue encontrada`
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Detalle de venta obtenido exitosamente',
            data: venta
        });
    } catch (error) {
        const errorParsed = handleMongooseError(error);
        return res.status(errorParsed.status).json(errorParsed.response);
    }
};

/**
 * RF-09:
 * Endpoint PATCH /api/ventas/:id/anular (Exclusivo ADMIN)
 */
export const anularVentaController = async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await ventasService.anularVenta(
            id,
            req.usuario?.id || req.usuario?._id || null
        );
        return res.status(200).json({
            success: true,
            message: 'Venta anulada exitosamente y stock reintegrado al inventario',
            data: resultado.venta
        });
    } catch (error) {
        const errorParsed = handleMongooseError(error);
        return res.status(errorParsed.status).json(errorParsed.response);
    }
};

export default {
    createVenta,
    getVentas,
    getVentaById,
    anularVentaController
};
