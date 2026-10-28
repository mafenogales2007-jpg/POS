import mongoose from 'mongoose';

const productoSchema = new mongoose.Schema({
    nombre: { 
        type: String, 
        required: true, 
        trim: true 
    },
    descripcion: { 
        type: String 
    },
    precio: { 
        type: Number, 
        required: true, 
        min: 0 
    },
    stock: { 
        type: Number, 
        required: true, 
        min: 0, 
        default: 0 
    },
    stockMinimo: { 
        type: Number, 
        required: true, 
        min: 0, 
        default: 5 // Límite personalizado para alertas de reabastecimiento
    },
    categoria: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Categoria', 
        required: false 
    }
}, { 
    timestamps: true 
});

export default mongoose.model('Producto', productoSchema);