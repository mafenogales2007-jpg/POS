import { clientesService } from '../services/clientes.services.js';

const createCliente = async (req, res) => {
    try {
        const resultado = await clientesService.crearCliente(req.body);
        return res.status(201).json(resultado);
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const getClientes = async (req, res) => {
    try {
        const resultado = await clientesService.obtenerClientes();
        return res.status(200).json(resultado);
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const getClienteById = async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await clientesService.obtenerClientePorId(id);
        if (!resultado.success) {
            return res.status(404).json({ success: false, message: resultado.message });
        }
        return res.status(200).json(resultado);
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const patchCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await clientesService.actualizarCliente(id, req.body);
        if (!resultado.success) {
            return res.status(404).json({ success: false, message: resultado.message });
        }
        return res.status(200).json(resultado);
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const deleteCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await clientesService.eliminarCliente(id);
        if (!resultado.success) {
            return res.status(404).json({ success: false, message: resultado.message });
        }
        return res.status(200).json(resultado);
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export { createCliente, getClientes, getClienteById, patchCliente, deleteCliente };