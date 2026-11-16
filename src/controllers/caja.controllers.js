import { cajaService } from '../services/caja.services.js';
import { handleMongooseError } from '../helpers/handle-mongoose-error.helper.js';

export const getCierreDiario = async (req, res) => {
    try {
        const { fecha } = req.query; // Espera formato YYYY-MM-DD
        const cierre = await cajaService.obtenerCierreDiario(fecha);
        return res.status(200).json({
            success: true,
            message: 'Cierre diario de caja consolidado exitosamente',
            data: cierre
        });
    } catch (error) {
        const errorParsed = handleMongooseError(error);
        return res.status(errorParsed.status).json(errorParsed.response);
    }
};

export default {
    getCierreDiario
};
