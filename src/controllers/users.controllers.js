// Controlador define quien hace una accion especifica 
const registerUser = (req, res) => {
    const user = req.body;

    res.json({ msg: 'Registra ususario ', user });
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

