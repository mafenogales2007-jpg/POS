import mongoose from 'mongoose';

const movimientoSchema = new mongoose.Schema({
    productoId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Producto', 
        required: true 
    },
    tipo: { 
        type: String, 
        enum: ['entrada', 'salida', 'venta', 'anulacion'], 
        required: true 
    },
    cantidad: { 
        type: Number, 
        required: true, 
        min: 1 
    },
    stockAnterior: { 
        type: Number, 
        required: true 
    },
    stockNuevo: { 
        type: Number, 
        required: true 
    },
    motivo: { 
        type: String, 
        trim: true 
    },
    usuarioId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Usuario', 
        required: false 
    }
}, { 
    timestamps: true 
});

export default mongoose.model('MovimientoInventario', movimientoSchema);