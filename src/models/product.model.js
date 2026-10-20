import mongoose from "mongoose";

const { Schema, model } = mongoose;

const productSchema = new Schema({
    name: {
        type: String,
        unique: true,
        minlength: 3,
        trim: true,
        required: true
    },
    description: {
        type: String,
        trim: true
    },
    price: {
        type: Number,
        min: 0,
        default: 0
    },
    stock: {
        type: Number,
        min: 0,
        default: 1
    },
    state: {
        type: String,
        enum: [
            "disponible",
            "en garantia",
            "entregado",
            "en transito"
        ],
        default: "disponible"
    },
    createdBy: {
        type: String,
        ref: "User",
        required: [true, "El ID del creador del producto es obligatorio"]
    }
}, {
    timestamps: true,
    versionKey: false
});

const productModel1 = model("Product", productSchema);

export default productModel1;