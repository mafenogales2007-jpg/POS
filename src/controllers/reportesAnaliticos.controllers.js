import { reportesAnaliticosService } from '../services/reportesAnaliticos.services.js';
import { handleMongooseError } from '../helpers/handle-mongoose-error.helper.js';

export const getRotacionProductos = async (req, res) => {
    try {
        const { limite = 10 } = req.query;
        const reporte = await reportesAnaliticosService.obtenerRotacionProductos(limite);
        return res.status(200).json({
            success: true,
            message: 'Reporte de rotación de productos obtenido exitosamente',
            data: reporte
        });
    } catch (error) {
        const errorParsed = handleMongooseError(error);
        return res.status(errorParsed.status).json(errorParsed.response);
    }
};

export default {
    getRotacionProductos
};
