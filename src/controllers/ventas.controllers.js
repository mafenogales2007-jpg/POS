// Controlador define quien hace una accion especifica 
const createVenta = (req, res) => {
    res.json({ msg: 'Registra las ventas' });
}

const registerVenta = (req, res) => {
    res.json({ msg: 'Crear nueva venta' });
}
const updateVenta = (req, res) => {
    res.json({ msg: 'Actualizar todo' });
}

const updaVenta = (req, res) => {
    res.json({ msg: 'Actualizar todos las ventas' });
}
const deleteVenta = (req, res) => {
    res.json({ msg: 'Eliminar la venta' });
}

export {createVenta, registerVenta, updateVenta, updaVenta, deleteVenta}