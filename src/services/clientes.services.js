import { ClienteModel } from '../models/clientes.model.js';

class ClientesService {
    async crearCliente(datos) {
        try {
            const nuevoCliente = new ClienteModel(datos);
            const clienteGuardado = await nuevoCliente.save();
            return { success: true, message: 'Cliente creado exitosamente', data: clienteGuardado };
        } catch (error) {
            throw new Error(`Error al crear el cliente: ${error.message}`);
        }
    }

    async obtenerClientes() {
        try {
            const clientes = await ClienteModel.find();
            return { success: true, data: clientes };
        } catch (error) {
            throw new Error(`Error al obtener los clientes: ${error.message}`);
        }
    }
}

export const clientesService = new ClientesService();