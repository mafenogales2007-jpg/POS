import { Schema, model } from 'mongoose';

// Subesquema para los productos individuales dentro de la venta
const DetalleVentaSchema = new Schema({
    productoId: {
        type: Schema.Types.ObjectId,
        ref: 'Producto', // Nombre del modelo de productos si existe
        required: true
    },
    nombreProducto: {
        type: String,
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
    },
    subtotal: {
        type: Number,
        required: true
    }
});

// Esquema principal de la venta
const VentaSchema = new Schema(
    {
        cliente: {
            type: String,
            default: 'Cliente general'
        },
        usuarioId: {
            type: Schema.Types.ObjectId,
            ref: 'Usuario', // ID del vendedor/cajero que procesa la venta
            required: false
        },
        productos: [DetalleVentaSchema],
        metodoPago: {
            type: String,
            enum: ['efectivo', 'tarjeta', 'nequi', 'daviplata', 'transferencia'],
            required: true,
            default: 'efectivo'
        },
        subtotal: {
            type: Number,
            required: true
        },
        impuestos: {
            type: Number,
            default: 0
        },
        total: {
            type: Number,
            required: true
        },
        estado: {
            type: String,
            enum: ['completada', 'anulada', 'pendiente'],
            default: 'completada'
        }
    },
    {
        timestamps: true // Agrega automáticamentecreatedAt y updatedAt
    }
);

export const VentaModel = model('Venta', VentaSchema);