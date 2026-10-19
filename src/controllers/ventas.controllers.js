import { ventasService } from '../services/ventas.services.js';

// 1. Crear / Registrar una nueva venta
const createVenta = async (req, res) => {
    try {
        const resultado = await ventasService.crearVenta(req.body);
        return res.status(201).json({
            success: true,
            message: 'Venta registrada exitosamente',
            data: resultado.data
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// 2. Obtener todas las ventas (Listar historial)
const getVentas = async (req, res) => {
    try {
        const resultado = await ventasService.obtenerVentas();
        return res.status(200).json({
            success: true,
            data: resultado.data
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// 3. Obtener una venta por ID
const getVentaById = async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await ventasService.obtenerVentaPorId(id);
        if (!resultado.success) {
            return res.status(404).json({ success: false, message: resultado.message });
        }
        return res.status(200).json({ success: true, data: resultado.data });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// 4. Actualizar una venta (Pendiente de implementar si lo requieres)
const updateVenta = async (req, res) => {
    res.json({ msg: 'Actualizar venta (Pendiente de implementar)' });
};

// 5. Eliminar o anular una venta
const deleteVenta = async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await ventasService.eliminarVenta(id);
        
        if (!resultado.success) {
            return res.status(404).json({ success: false, message: resultado.message });
        }
        
        return res.status(200).json({
            success: true,
            message: resultado.message,
            data: resultado.data
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export {
    createVenta,
    getVentas,
    getVentaById,
    updateVenta,
    deleteVenta
};