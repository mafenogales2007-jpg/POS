import { dbCreateUser } from "../services/users.services.js";

// Controlador define quien hace una accion especifica 
const registerUser = async(req, res) => {
    try{
  //Obtenemos el usuario desde el cuerpo de la peticion (request)
    const user = req.body;

    //conecta con el servidor para crear un usuario en la base de datos
    const newUser = await dbCreateUser(user);  //Llega como una promesa


    // Respuesta al cliente
    res.json({ msg: 'Registra ususario ', user:newUser });
}
catch (error){
    console.error( error );
    res.json({
        msg: 'Error al registrar usuario'
        });
  }
}
const getUser = (req, res) => {
    res.json({ msg: 'Registra usuario' });
}
const updateUserPatch = (req, res) => {
    res.json({ msg: 'Actualizar usuario' });
}

const updaUserPut = (req, res) => {
    res.json({ msg: 'Actualiza usuario' });
}
const deleteUser = (req, res) => {
    res.json({ msg: 'Eliminar todos los usuarios' });
}

export {registerUser, updateUserPatch, updaUserPut, deleteUser, getUser}

