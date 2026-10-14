// servicio se habla con la base de datos
// estas funciones relizaran las consultas a la base de datos 
import UserModel from "../models/users.model.js"; 
//TODO: Conectar el modelo de usuarios con la base de datos
const dbCreateUser = async ( newUser ) => {
    return await UserModel.create(newUser);
}

const dbGetUsers = () => {}

const dbUpdateUser = () => {}

const dbdeleteUsers = () => {}

export {
    dbCreateUser,
    dbGetUsers,
    dbUpdateUser,
    dbdeleteUsers
}