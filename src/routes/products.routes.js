import { Router } from "express";
import {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
} from "../controllers/products.controllers.js";

const router = Router();

// Crear producto
router.post("/", createProduct);

// Obtener todos los productos
router.get("/", getProducts);

// Obtener un producto por ID
router.get("/:id", getProductById);

// Actualizar un producto
router.patch("/:id", updateProduct);

// Eliminar un producto
router.delete("/:id", deleteProduct);

export default router;