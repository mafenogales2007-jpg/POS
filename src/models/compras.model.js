import { Schema, model } from 'mongoose';

const comprasSchema = new Schema({
    proveedor: {
        type: Schema.Types.ObjectId,
        ref: 'Tercero',
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true // Operador del sistema que registra la compra
    },
    subTotalCompras: {
        type: Number,
        required: true,
        min: 0
    },
    ivaTotalCompras: {
        type: Number,
        default: 0.00,
        min: 0
    },
    totalCompras: {
        type: Number,
        required: true,
        min: 0
    }
}, { timestamps: true });

export const ComprasModel = model('Compras', comprasSchema);
export default ComprasModel;
