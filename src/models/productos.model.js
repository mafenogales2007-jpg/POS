import { Schema, model } from 'mongoose';

const productoSchema = new Schema({
    nombre: { type: String, required: true },
    precio: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
    descripcion: { type: String }
}, {
    timestamps: true
});

export const ProductoModel = model('Producto', productoSchema);
