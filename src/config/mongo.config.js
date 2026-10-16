import mongoose from 'mongoose';



const URL_REMOTE = process.env.URI_MONGO || 'mongodb://localhost:27017';


const conexion = async() => {
    try {
        await mongoose.connect(URL_REMOTE);
        console.log("conectado a la base de datos MongoDB");
    } catch (error) {
          console.error("Error al conectar a la  base de datos Mongo");
        
    }


}
 export default conexion ;