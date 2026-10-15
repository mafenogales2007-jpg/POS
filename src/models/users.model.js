import mongoose from "mongoose";

// Parte 1 : definir la estructura de datos de mi documento 
const UserSchema = new mongoose.Schema({
    name: {
        type: String,                //tipo dato
        required: true,              // Regla: Es obligatorio
        trim: true                   //modificador
    },
    email: {
        type: String,
        required: true,
        trim: true 
    },
    password: {
        type: String,
        trim: true,
        required: true 
    },
    role: {
        type: String,
        enum: ['ADMIN', 'SELLER'],
        default: 'SELLER'
    },
    status: {
        type: Boolean,
        default: true
    }
},{
    timestamps: true       //Crear automaticamente createAT, uPDATEAT
});

// Parte 2 : definir el modelo. Dicho modelo esta atado al nombre del documento
const UserModel = mongoose.model(
    'user',          //Nombre de la coleccion (pluralizar automaticamente)
    UserSchema       // Nombre del esquema que define la estructura de datos
);

export default UserModel;