import { formaDePagoService } from '../services/formaDePago.services.js';
import { handleMongooseError } from '../helpers/handle-mongoose-error.helper.js';

export const getFormasDePago = async (req, res) => {
    try {
        let formas = await formaDePagoService.listarFormasDePago();
        
        // Si no hay ninguna forma de pago en la BD, autogenerar las estándar para que el POS funcione de inmediato
        if (formas.length === 0) {
            await formaDePagoService.inicializarFormasDePagoDefault();
            formas = await formaDePagoService.listarFormasDePago();
        }

        return res.status(200).json({
            success: true,
            message: 'Formas de pago obtenidas exitosamente',
            data: formas
        });
    } catch (error) {
        const errorParsed = handleMongooseError(error);
        return res.status(errorParsed.status).json(errorParsed.response);
    }
};

export const createFormaDePago = async (req, res) => {
    try {
        const nueva = await formaDePagoService.crearFormaDePago(req.body);
        return res.status(201).json({
            success: true,
            message: 'Forma de pago registrada exitosamente',
            data: nueva
        });
    } catch (error) {
        const errorParsed = handleMongooseError(error);
        return res.status(errorParsed.status).json(errorParsed.response);
    }
};
