import { detalleVentaService } from '../services/detalleVenta.services.js';
import { handleMongooseError } from '../helpers/handle-mongoose-error.helper.js';

export const getDetallesVenta = async (req, res) => {
    try {
        const { ventaId } = req.query;
        let detalles;
        if (ventaId) {
            detalles = await detalleVentaService.obtenerDetallesPorVenta(ventaId);
        } else {
            detalles = await detalleVentaService.obtenerDetalles();
        }

        return res.status(200).json({
            success: true,
            message: 'Detalles de venta obtenidos exitosamente',
            data: detalles
        });
    } catch (error) {
        const errorParsed = handleMongooseError(error);
        return res.status(errorParsed.status).json(errorParsed.response);
    }
};

export default {
    getDetallesVenta
};
