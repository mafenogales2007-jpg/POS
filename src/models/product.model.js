import mongoose from "mongoose";

const productSchema = new Schema({
    name: {
        type: String,
        unique : true,
        minlenght: true,
        trim:true
    },
    description: String,
    price : {
        type:number,
        min:0,
        default: 0
    },
    stock: {
        type:Number,
        min: 0,
        default: 1
    },
    state:{
        type: String,
        enum:['disponible',
            'en garantia',
            'entregado',
            'en transito'
        ],
        default: 'disponible'
    },
    createdBy: {
        type: String,
        required: true
    }
    
} , {
    timestamps: true,
    versionKey: false
}); 

const productModel1 = model("Product", productSchema);

export default productModel1 