import { FormaDePagoModel } from '../models/formaDePago.model.js';

class FormaDePagoService {
    async listarFormasDePago() {
        return await FormaDePagoModel.find().sort({ descripcionFormaDePago: 1 });
    }

    async crearFormaDePago(datos) {
        const nueva = new FormaDePagoModel(datos);
        return await nueva.save();
    }

    async inicializarFormasDePagoDefault() {
        const formasDefault = ['Efectivo', 'Tarjeta Débito', 'Tarjeta Crédito', 'Nequi', 'Daviplata', 'Transferencia'];
        const resultados = [];
        for (const descripcion of formasDefault) {
            const existente = await FormaDePagoModel.findOne({ descripcionFormaDePago: descripcion });
            if (!existente) {
                const creada = await FormaDePagoModel.create({ descripcionFormaDePago: descripcion });
                resultados.push(creada);
            }
        }
        return resultados;
    }
}

export const formaDePagoService = new FormaDePagoService();
export default formaDePagoService;
