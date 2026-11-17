
import { Schema, model } from 'mongoose';

const productosSchema = new Schema({
    sku: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true
    },
    nombreProductos: {
        type: String,
        required: true,
        trim: true
    },
    descripcionProductos: {
        type: String,
        trim: true
    },
    precioVenta: {
        type: Number,
        required: true,
        min: 0,
        default: 0.00
    },
    ivaProductos: {
        type: Number,
        default: 0.00,
        min: 0,
        max: 100
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    },
    estadoProductos: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

export const ProductosModel = model('Productos', productosSchema);
export default ProductosModel;
