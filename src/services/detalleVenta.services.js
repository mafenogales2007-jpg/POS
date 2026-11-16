import { DetalleVentaModel } from '../models/detalleVenta.model.js';

class DetalleVentaService {
    async obtenerDetalles() {
        return await DetalleVentaModel.find()
            .populate('producto')
            .populate('venta');
    }

    async obtenerDetallesPorVenta(ventaId) {
        return await DetalleVentaModel.find({ venta: ventaId })
            .populate('producto');
    }
}

export const detalleVentaService = new DetalleVentaService();
export default detalleVentaService;
