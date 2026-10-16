import { detalleVentaService } from '../services/detalleVenta.services.js';

const createDetalleVenta = async (req, res) => {
    try {
        const resultado = await detalleVentaService.crearDetalle(req.body);
        return res.status(201).json(resultado);
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const getDetallesVenta = async (req, res) => {
    try {
        const resultado = await detalleVentaService.obtenerDetalles();
        return res.status(200).json(resultado);
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export { createDetalleVenta, getDetallesVenta };