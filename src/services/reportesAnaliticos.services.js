import { DetalleVentaModel } from '../models/detalleVenta.model.js';
import { VentasModel } from '../models/ventas.model.js';
import ProductModel from '../models/product.model.js';

class ReportesAnaliticosService {
    /**
     * RF-13 / HU-12:
     * Métricas de rotación de productos y balance periódico.
     * Endpoint: GET /api/reportes/rotacion
     */
    async obtenerRotacionProductos(limite = 10) {
        // Agrupación en DetalleVentaModel para calcular unidades vendidas por producto e ingresos generados
        const rotacion = await DetalleVentaModel.aggregate([
            {
                $group: {
                    _id: '$producto',
                    totalUnidadesVendidas: { $sum: '$cantidadVenta' },
                    ingresosGenerados: { $sum: '$totalVenta' },
                    vecesFacturado: { $sum: 1 }
                }
            },
            {
                $sort: { totalUnidadesVendidas: -1 }
            },
            {
                $limit: Number(limite) || 10
            },
            {
                $lookup: {
                    from: 'productos',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'productoInfo'
                }
            },
            {
                $unwind: {
                    path: '$productoInfo',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 1,
                    totalUnidadesVendidas: 1,
                    ingresosGenerados: 1,
                    vecesFacturado: 1,
                    nombreProducto: { $ifNull: ['$productoInfo.nombre', '$productoInfo.nombreProductos', 'Producto'] },
                    precioVenta: '$productoInfo.precio',
                    stockActual: '$productoInfo.stock'
                }
            }
        ]);

        // Resumen global de rotación
        const balanceGlobal = await VentasModel.aggregate([
            {
                $match: { estadoVentas: 'Completada' }
            },
            {
                $group: {
                    _id: null,
                    totalIngresosHistoricos: { $sum: '$totalVentas' },
                    totalTransaccionesHistoricas: { $sum: 1 }
                }
            }
        ]);

        return {
            balance: balanceGlobal[0] || { totalIngresosHistoricos: 0, totalTransaccionesHistoricas: 0 },
            productosMayorRotacion: rotacion
        };
    }
}

export const reportesAnaliticosService = new ReportesAnaliticosService();
export default reportesAnaliticosService;
