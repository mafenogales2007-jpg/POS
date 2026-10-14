//mongodb+srv://Brayan:<db_password>@pos.ahsifcy.mongodb.net/
// ODM:
import mongoose from "mongoose";
const URL_REMOTE = "mongodb+srv://Brayan:123456.@pos.ahsifcy.mongodb.net/"


//Sequeliza (sql) -> MySQL, PostgreSQL, MariaDB, SQLite, Microsoft SQL Server
// Mongoose (NoSQL) -> MongoDB
//Prisma (SQL y NoSQL) -> MySQL, PostgreSQL, MariaDB, SQLite, Microsoft SQL Server, MongoDB
const conexion = async () => {
    try {
        await mongoose.connect(URL_REMOTE)
        console.log("Conectado a la base de datos");
    } catch (error) {
        console.error("Error al conectar a la base de datos:", error);
    }
}
export default conexion;