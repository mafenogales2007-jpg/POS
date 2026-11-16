import { Schema, model } from 'mongoose';

const stockSchema = new Schema({
    producto: {
        type: Schema.Types.ObjectId,
        ref: 'Productos',
        required: true,
        unique: true
    },
    totalStock: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    stockMinimo: {
        type: Number,
        required: true,
        default: 5,
        min: 0
    }
}, { timestamps: true });

export const StockModel = model('Stock', stockSchema);
export default StockModel;
