
import mongoose from 'mongoose';

// Permite utilizar cualquiera de las dos variables de conexión
const URL_REMOTE = process.env.MONGODB_URI || process.env.URI_MONGO;

const conexion = async () => {
    try {
        if (!URL_REMOTE) {
            throw new Error(
                "No se encontró la cadena de conexión de MongoDB. Defina MONGODB_URI o URI_MONGO en el archivo .env"
            );
        }

        await mongoose.connect(URL_REMOTE);

        console.log("Conectado exitosamente a la base de datos remota de MongoDB Atlas");

    } catch (error) {
        console.error("Error al conectar a la base de datos:", error.message);
        process.exit(1);
    }
};

export default conexion;
