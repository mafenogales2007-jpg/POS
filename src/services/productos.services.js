import Producto from '../models/productos.model.js';

export const obtenerProductosService = async () => {
    return await Producto.find();
};

export const crearProductoService = async (datosProducto) => {
    const nuevoProducto = new Producto(datosProducto);
    return await nuevoProducto.save();
};

export const obtenerStockBajoService = async (limite = 5) => {
    return await Producto.find({ stock: { $lte: limite } });
};

export const eliminarProductoService = async (id) => {
    const productoEliminado = await Producto.findByIdAndDelete(id);
    if (!productoEliminado) {
        throw new Error('Producto no encontrado para eliminar');
    }
    return productoEliminado;
};

export const actualizarStockService = async (id, nuevoStock) => {
    const producto = await Producto.findByIdAndUpdate(
        id, 
        { stock: nuevoStock }, 
        { new: true, runValidators: true }
    );
    if (!producto) throw new Error('Producto no encontrado en el inventario');
    return producto;
};