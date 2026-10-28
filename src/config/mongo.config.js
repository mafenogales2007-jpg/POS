import mongoose from 'mongoose';

const URL_REMOTE = process.env.URI_MONGO;

const conexion = async () => {
    try {
        if (!URL_REMOTE) {
            throw new Error("La variable URI_MONGO no está definida en el archivo .env");
        }
        await mongoose.connect(URL_REMOTE);
        console.log("Conectado exitosamente a la base de datos remota de MongoDB Atlas");
    } catch (error) {
        console.error("Error al conectar a la base de datos:", error.message);
        process.exit(1);
    }
};

export default conexion;
