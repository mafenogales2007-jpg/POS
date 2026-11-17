
import { Schema, model } from 'mongoose';

const ventasSchema = new Schema({
    cliente: {
        type: Schema.Types.ObjectId,
        ref: 'Tercero',
        required: true
    },
    cajero: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    formaDePago: {
        type: Schema.Types.ObjectId,
        ref: 'FormaDePago',
        required: true
    },
    subTotalVentas: {
        type: Number,
        required: true,
        min: 0
    },
    descuento: {
        type: Number,
        default: 0.00,
        min: 0
    },
    ivaVentas: {
        type: Number,
        default: 0.00,
        min: 0
    },
    totalVentas: {
        type: Number,
        required: true,
        min: 0
    },
    estadoVentas: {
        type: String,
        enum: ['Completada', 'Anulada', 'Pendiente'],
        default: 'Completada'
    }
}, { timestamps: true });

export const VentasModel = model('Ventas', ventasSchema);

export default VentasModel;
