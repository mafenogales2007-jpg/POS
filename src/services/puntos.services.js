import { TerceroModel } from '../models/tercero.model.js';

class PuntosService {
    /**
     * RF-11 / HU-11:
     * Acumular 1 punto por cada $1.000 COP netos facturados en compras de terceros con rol CLIENTE.
     */
    async acumularPuntosPorVenta(clienteId, montoNetoVenta) {
        const cliente = await TerceroModel.findById(clienteId);
        if (!cliente) return null;

        // Solo acumulan puntos los clientes (no proveedores)
        if (!cliente.tipoTercero || !cliente.tipoTercero.includes('CLIENTE')) {
            return null;
        }

        const puntosNuevos = Math.floor(Number(montoNetoVenta) / 1000);
        if (puntosNuevos > 0) {
            cliente.puntosFidelizacion = (Number(cliente.puntosFidelizacion) || 0) + puntosNuevos;
            await cliente.save();
        }

        return {
            clienteId: cliente._id,
            nombre: `${cliente.nombreOrazonSocial} ${cliente.apellido || ''}`.trim(),
            puntosGanados: puntosNuevos,
            totalPuntos: cliente.puntosFidelizacion
        };
    }

    /**
     * Consultar puntos acumulados de un cliente por su documento o ID
     */
    async consultarPuntos(identificador) {
        let cliente = null;
        if (identificador.match(/^[0-9a-fA-F]{24}$/)) {
            cliente = await TerceroModel.findById(identificador);
        }
        if (!cliente) {
            cliente = await TerceroModel.findOne({ documentoTercero: identificador });
        }

        if (!cliente) {
            const err = new Error(`Cliente no encontrado con el identificador '${identificador}'`);
            err.statusCode = 404;
            throw err;
        }

        return {
            clienteId: cliente._id,
            documento: cliente.documentoTercero,
            nombre: `${cliente.nombreOrazonSocial} ${cliente.apellido || ''}`.trim(),
            puntosFidelizacion: cliente.puntosFidelizacion || 0,
            equivalenteEnPesos: (cliente.puntosFidelizacion || 0) * 10 // Ejemplo: 1 punto = $10 COP
        };
    }

    /**
     * Redimir puntos en caja
     */
    async redimirPuntos(clienteId, puntosARedimir) {
        const cliente = await TerceroModel.findById(clienteId);
        if (!cliente) {
            const err = new Error('Cliente no encontrado');
            err.statusCode = 404;
            throw err;
        }

        const puntosActuales = Number(cliente.puntosFidelizacion) || 0;
        const cantidadARedimir = Number(puntosARedimir);

        if (cantidadARedimir <= 0) {
            const err = new Error('La cantidad de puntos a redimir debe ser mayor a 0');
            err.statusCode = 400;
            throw err;
        }

        if (puntosActuales < cantidadARedimir) {
            const err = new Error(`Puntos insuficientes. Disponibles: ${puntosActuales}, Solicitados: ${cantidadARedimir}`);
            err.statusCode = 400;
            throw err;
        }

        cliente.puntosFidelizacion = puntosActuales - cantidadARedimir;
        await cliente.save();

        return {
            clienteId: cliente._id,
            puntosRedimidos: cantidadARedimir,
            puntosRestantes: cliente.puntosFidelizacion
        };
    }
}

export const puntosService = new PuntosService();
export default puntosService;
