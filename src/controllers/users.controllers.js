const createUser = (req, res) => {
    res.json({ msg: 'Listar todos los usuarios' });
}

const registerUser = (req, res) => {
    res.json({ msg: 'Registrar todos los usuarios' });
}
const updateUser = (req, res) => {
    res.json({ msg: 'Actualizar todo' });
}

const updaUser = (req, res) => {
    res.json({ msg: 'Actualizar todos los usuarios' });
}
const deleteUser = (req, res) => {
    res.json({ msg: 'Eliminar todos los usuarios' });
}



export {createUser, registerUser, updateUser, updaUser, deleteUser}

