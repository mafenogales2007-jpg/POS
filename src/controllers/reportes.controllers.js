
import { obtenerResumenReportes } from '../services/reportes.services.js';

export const obtenerReportes = async (req, res) => {
    try {
        const resumen = await obtenerResumenReportes();

        res.status(200).json({
            mensaje: 'Reportes obtenidos correctamente',
            reportes: resumen
        });
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener los reportes',
            error: error.message
        });
    }
};
