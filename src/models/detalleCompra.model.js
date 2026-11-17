import { Schema, model } from 'mongoose';

const detalleCompraSchema = new Schema({
    compra: {
        type: Schema.Types.ObjectId,
        ref: 'Compras',
        required: true
    },
    producto: {
        type: Schema.Types.ObjectId,
        ref: 'Productos',
        required: true
    },
    cantidadCompra: {
        type: Number,
        required: true,
        min: 1
    },
    valorUnitarioCompra: {
        type: Number,
        required: true,
        min: 0
    },
    subTotalCompra: {
        type: Number,
        required: true,
        min: 0
    },
    totalCompra: {
        type: Number,
        required: true,
        min: 0
    }
}, { timestamps: true });

export const DetalleCompraModel = model('DetalleCompra', detalleCompraSchema);
export default DetalleCompraModel;
