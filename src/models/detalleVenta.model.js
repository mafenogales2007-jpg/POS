import { Schema, model } from 'mongoose';

const detalleVentaSchema = new Schema({
    venta: {
        type: Schema.Types.ObjectId,
        ref: 'Venta',
        required: true
    },
    producto: {
        type: Schema.Types.ObjectId,
        ref: 'Producto',
        required: true
    },
    cantidad: {
        type: Number,
        required: true,
        min: 1
    },
    precioUnitario: {
        type: Number,
        required: true,
        min: 0
    }
}, {
    timestamps: true
});

export const DetalleVentaModel = model('DetalleVenta', detalleVentaSchema);