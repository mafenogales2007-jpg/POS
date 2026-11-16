import { Schema, model } from 'mongoose';

const categoriaSchema = new Schema({
    nombreCategoria: {
        type: String,
        required: true,
        unique: true,
        trim: true
    }
}, { timestamps: true });

export const CategoriaModel = model('Categoria', categoriaSchema);
export default CategoriaModel;
