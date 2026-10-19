import { dbCreateProduct } from "../services/products.services.js";

// Controlador para registrar un producto
const createProduct = async (req, res) => {
    try {
        // Extraer los datos del cuerpo de la petición
        const inputData = req.body;

        // Usar el servicio para registrar
        const data = await dbCreateProduct(inputData);

        // Respuesta al cliente
        res.json({ msg: 'Registrar producto', data: data });

    } catch (error) {
        console.error(error);

        res.json({
            msg: 'No se pudo registrar el producto'
        });
    }
};

export {
    createProduct
};