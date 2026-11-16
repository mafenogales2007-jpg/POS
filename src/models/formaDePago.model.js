import { Schema, model } from 'mongoose';

const formaDePagoSchema = new Schema({
    descripcionFormaDePago: {
        type: String,
        required: true,
        unique: true,
        trim: true
    }
}, { timestamps: true });

export const FormaDePagoModel = model('FormaDePago', formaDePagoSchema);
