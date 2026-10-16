import { DetalleVentaModel } from '../models/detalleVenta.model.js';

class DetalleVentaService {
    async crearDetalle(datos) {
        try {
            const nuevoDetalle = new DetalleVentaModel(datos);
            const detalleGuardado = await nuevoDetalle.save();
            return { success: true, message: 'Detalle de venta creado exitosamente', data: detalleGuardado };
        } catch (error) {
            throw new Error(`Error al crear el detalle de venta: ${error.message}`);
        }
    }

    async obtenerDetalles() {
        try {
            const detalles = await DetalleVentaModel.find()
                .populate('producto')
                .populate('venta');
            return { success: true, data: detalles };
        } catch (error) {
            throw new Error(`Error al obtener los detalles de venta: ${error.message}`);
        }
    }
}

export const detalleVentaService = new DetalleVentaService();