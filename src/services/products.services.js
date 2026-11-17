import productModel1 from "../models/product.model.js";

// Crear producto
const dbCreateProduct = async (newProduct) => {
    return await productModel1.create(newProduct);
};

// Obtener todos los productos
const dbGetProducts = async () => {
    return await productModel1.find();
};

// Obtener un producto por ID
const dbGetProductById = async (productId) => {
    return await productModel1.findById(productId);
};

// Actualizar producto
const dbUpdateProduct = async (productId, updatedData) => {
    return await productModel1.findByIdAndUpdate(
        productId,
        updatedData,
        {
            new: true,
            runValidators: true
        }
    );
};

// Eliminar producto
const dbDeleteProduct = async (productId) => {
    return await productModel1.findByIdAndDelete(productId);
};

export {
    dbCreateProduct,
    dbGetProducts,
    dbGetProductById,
    dbUpdateProduct,
    dbDeleteProduct
};