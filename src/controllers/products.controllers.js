import {
    dbCreateProduct,
    dbGetProducts,
    dbGetProductById,
    dbUpdateProduct,
    dbDeleteProduct
} from "../services/products.services.js";

const createProduct = async (req, res) => {
    try {
        const inputData = req.body;

        const data = await dbCreateProduct(inputData);

        return res.status(201).json({
            msg: "Producto registrado correctamente",
            data
        });
    } catch (error) {
        console.error("Error al registrar producto:", error);

        if (error.name === "ValidationError") {
            const errors = {};
            for (const field in error.errors) {
                errors[field] = error.errors[field].message;

            }
            res.json({errors});    
            }
            res.json({ msg: "Error al registrar producto"});

    
        return res.status(400).json({
            msg: "No se pudo registrar el producto",
            error: error.message
        });
    }
};

const getProducts = async (req, res) => {
    try {
        const data = await dbGetProducts();
        res.status(200).json({ msg: "Lista de productos", data });
    } catch (error) {
        res.status(500).json({
            msg: "Error al obtener productos",
            error: error.message
        });
    }
};

// Obtener producto por ID
const getProductById = async (req, res) => {
    try {
        const data = await dbGetProductById(req.params.id);

        if (!data) {
            return res.status(404).json({
                msg: "Producto no encontrado"
            });
        }

        return res.status(200).json({
            msg: "Producto encontrado",
            data
        });
    } catch (error) {
        return res.status(400).json({
            msg: "Error al obtener el producto",
            error: error.message
        });
    }
};

// Actualizar producto
const updateProduct = async (req, res) => {
    try {
        const data = await dbUpdateProduct(req.params.id, req.body);

        if (!data) {
            return res.status(404).json({
                msg: "Producto no encontrado"
            });
        }

        return res.status(200).json({
            msg: "Producto actualizado correctamente",
            data
        });
    } catch (error) {
        return res.status(400).json({
            msg: "No se pudo actualizar el producto",
            error: error.message
        });
    }
};

// Eliminar producto
const deleteProduct = async (req, res) => {
    try {
        const data = await dbDeleteProduct(req.params.id);

        if (!data) {
            return res.status(404).json({
                msg: "Producto no encontrado"
            });
        }

        return res.status(200).json({
            msg: "Producto eliminado correctamente",
            data
        });
    } catch (error) {
        return res.status(400).json({
            msg: "No se pudo eliminar el producto",
            error: error.message
        });
    }
};

export {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
};