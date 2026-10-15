import mongoose from 'mongoose';


const URL_LOCAL = 'mongodb://localhost:27017' // locahcosmongodb
const URL_REMOTE = 'mongodb+srv://mafenogales2007_db_user:MAFO2007@mafo.nqrki56.mongodb.net/'


const conexion = async() => {
    try {
        await mongoose.connect(URL_REMOTE);
        console.log("conectado a la base de datos MongoDB");
    } catch (error) {
          console.error("Error al conectar a la  base de datos Mongo");
        
    }


}
 export default conexion ;