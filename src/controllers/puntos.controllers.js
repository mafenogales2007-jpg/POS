import { puntosService } from '../services/puntos.services.js';
import { handleMongooseError } from '../helpers/handle-mongoose-error.helper.js';

export const consultarPuntosController = async (req, res) => {
    try {
        const { identificador } = req.params;
        const resultado = await puntosService.consultarPuntos(identificador);
        return res.status(200).json({
            success: true,
            message: 'Información de puntos obtenida exitosamente',
            data: resultado
        });
    } catch (error) {
        const errorParsed = handleMongooseError(error);
        return res.status(errorParsed.status).json(errorParsed.response);
    }
};

export const redimirPuntosController = async (req, res) => {
    try {
        const { clienteId, puntos } = req.body;
        const resultado = await puntosService.redimirPuntos(clienteId, puntos);
        return res.status(200).json({
            success: true,
            message: 'Puntos redimidos exitosamente',
            data: resultado
        });
    } catch (error) {
        const errorParsed = handleMongooseError(error);
        return res.status(errorParsed.status).json(errorParsed.response);
    }
};

export default {
    consultarPuntosController,
    redimirPuntosController
};
