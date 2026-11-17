import { VentasModel } from '../models/ventas.model.js';
import mongoose from 'mongoose';

class CajaService {
    /**
     * RF-12 / HU-12:
     * Consolidación diaria de facturación agrupada por cajero y métodos de pago.
     * Endpoint: GET /api/caja/cierre-diario?fecha=YYYY-MM-DD
     */
    async obtenerCierreDiario(fechaStr) {
        let inicioDia, finDia;

        if (fechaStr) {
            inicioDia = new Date(`${fechaStr}T00:00:00.000Z`);
            finDia = new Date(`${fechaStr}T23:59:59.999Z`);
        } else {
            const hoy = new Date();
            inicioDia = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 0, 0, 0);
            finDia = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 23, 59, 59, 999);
        }

        // 1. Métricas generales del día (Total facturado, IVA, Descuentos y número de ventas)
        const resumenGeneral = await VentasModel.aggregate([
            {
                $match: {
                    createdAt: { $gte: inicioDia, $lte: finDia },
                    estadoVentas: 'Completada'
                }
            },
            {
                $group: {
                    _id: null,
                    totalVentasDia: { $sum: '$totalVentas' },
                    subTotalVentasDia: { $sum: '$subTotalVentas' },
                    ivaTotalDia: { $sum: '$ivaVentas' },
                    descuentosTotalDia: { $sum: '$descuento' },
                    cantidadTransacciones: { $sum: 1 }
                }
            }
        ]);

        // 2. Facturación agrupada por cajero (Arqueo por operador)
        const ventasPorCajero = await VentasModel.aggregate([
            {
                $match: {
                    createdAt: { $gte: inicioDia, $lte: finDia },
                    estadoVentas: 'Completada'
                }
            },
            {
                $group: {
                    _id: '$cajero',
                    totalCobrado: { $sum: '$totalVentas' },
                    totalTransacciones: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'cajeroInfo'
                }
            },
            {
                $unwind: {
                    path: '$cajeroInfo',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 1,
                    totalCobrado: 1,
                    totalTransacciones: 1,
                    cajeroNombre: {
                        $concat: [
                            { $ifNull: ['$cajeroInfo.nombreUsuario', 'Operador'] },
                            ' ',
                            { $ifNull: ['$cajeroInfo.apellidoUsuario', ''] }
                        ]
                    },
                    documentoCajero: '$cajeroInfo.documentoUsuario'
                }
            }
        ]);

        // 3. Facturación agrupada por Métodos de Pago
        const ventasPorMetodoPago = await VentasModel.aggregate([
            {
                $match: {
                    createdAt: { $gte: inicioDia, $lte: finDia },
                    estadoVentas: 'Completada'
                }
            },
            {
                $group: {
                    _id: '$formaDePago',
                    totalRecaudado: { $sum: '$totalVentas' },
                    transacciones: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'formadepagos',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'formaPagoInfo'
                }
            },
            {
                $unwind: {
                    path: '$formaPagoInfo',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 1,
                    totalRecaudado: 1,
                    transacciones: 1,
                    descripcionFormaDePago: { $ifNull: ['$formaPagoInfo.descripcionFormaDePago', 'Sin definir'] }
                }
            }
        ]);

        const datosResumen = resumenGeneral[0] || {
            totalVentasDia: 0,
            subTotalVentasDia: 0,
            ivaTotalDia: 0,
            descuentosTotalDia: 0,
            cantidadTransacciones: 0
        };

        return {
            fecha: fechaStr || inicioDia.toISOString().split('T')[0],
            rango: { desde: inicioDia, hasta: finDia },
            resumen: datosResumen,
            arqueoPorCajero: ventasPorCajero,
            consolidadoMetodosPago: ventasPorMetodoPago
        };
    }
}

export const cajaService = new CajaService();
export default cajaService;
