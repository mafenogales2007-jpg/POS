import { Schema, model } from 'mongoose';

const detalleVentaSchema = new Schema({
    venta: {
        type: Schema.Types.ObjectId,
        ref: 'Ventas',
        required: true
    },
    producto: {
        type: Schema.Types.ObjectId,
        ref: 'Productos',
        required: true
    },
    cantidadVenta: {
        type: Number,
        required: true,
        min: 1
    },
    valorUnitarioVenta: {
        type: Number,
        required: true,
        min: 0
    },
    subTotalVenta: {
        type: Number,
        required: true,
        min: 0
    },
    ivaVenta: {
        type: Number,
        default: 0.00,
        min: 0
    },
    totalVenta: {
        type: Number,
        required: true,
        min: 0
    }
}, { timestamps: true });

export const DetalleVentaModel = model('DetalleVenta', detalleVentaSchema);
export default DetalleVentaModel;
