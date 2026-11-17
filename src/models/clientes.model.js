import { Schema, model } from 'mongoose';

const clienteSchema = new Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    documento: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    telefono: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true
    }
}, {
    timestamps: true
});

export const ClienteModel = model('Cliente', clienteSchema);