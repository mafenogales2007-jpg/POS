
import { productosService } from '../services/productos.services.js';
import { handleMongooseError } from '../helpers/handle-mongoose-error.helper.js';

// Crear producto
export const createProducto = async (req, res) => {
    try {
        const nuevo = await productosService.crearProducto(req.body);

        return res.status(201).json({
            success: true,
            message: 'Producto y existencias registradas exitosamente',
            data: nuevo
        });
    } catch (error) {
        const errorParsed = handleMongooseError(error);
        return res.status(errorParsed.status).json(errorParsed.response);
    }
};

// Obtener todos los productos
export const getProductos = async (req, res) => {
    try {
        const productos = await productosService.obtenerProductos();

        return res.status(200).json({
            success: true,
            message: 'Catálogo de productos obtenido exitosamente',
            data: productos
        });
    } catch (error) {
        const errorParsed = handleMongooseError(error);
        return res.status(errorParsed.status).json(errorParsed.response);
    }
};

// Buscar producto por SKU
export const getProductoBySku = async (req, res) => {
    try {
        const { sku } = req.params;
        const producto = await productosService.obtenerProductoPorSku(sku);

        if (!producto) {
            return res.status(404).json({
                success: false,
                message: `Producto con SKU '${sku}' no encontrado`
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Producto obtenido exitosamente por SKU',
            data: producto
        });
    } catch (error) {
        const errorParsed = handleMongooseError(error);
        return res.status(errorParsed.status).json(errorParsed.response);
    }
};

// Obtener producto por ID
export const getProductoById = async (req, res) => {
    try {
        const { id } = req.params;
        const producto = await productosService.obtenerProductoPorId(id);

        if (!producto) {
            return res.status(404).json({
                success: false,
                message: `Producto con ID '${id}' no encontrado`
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Producto obtenido exitosamente',
            data: producto
        });
    } catch (error) {
        const errorParsed = handleMongooseError(error);
        return res.status(errorParsed.status).json(errorParsed.response);
    }
};

// Actualizar producto
export const patchProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const producto = await productosService.actualizarProducto(id, req.body);

        if (!producto) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado para actualizar'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Producto actualizado exitosamente',
            data: producto
        });
    } catch (error) {
        const errorParsed = handleMongooseError(error);
        return res.status(errorParsed.status).json(errorParsed.response);
    }
};

// Eliminar producto
export const deleteProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const producto = await productosService.eliminarProducto(id);

        if (!producto) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado para eliminar'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Producto eliminado exitosamente',
            data: producto
        });
    } catch (error) {
        const errorParsed = handleMongooseError(error);
        return res.status(errorParsed.status).json(errorParsed.response);
    }
};

export default {
    createProducto,
    getProductos,
    getProductoBySku,
    getProductoById,
    patchProducto,
    deleteProducto
};
