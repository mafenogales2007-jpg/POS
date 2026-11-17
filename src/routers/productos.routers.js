
import { Router } from 'express';

import {
    createProducto,
    getProductos,
    getProductoBySku,
    getProductoById,
    patchProducto,
    deleteProducto
} from '../controllers/productos.controllers.js';

import {
    autenticarToken,
    autorizarRoles
} from '../middlewares/auth.middleware.js';

const router = Router();

// Todas las rutas requieren autenticación
router.use(autenticarToken);

// Consultar todos los productos
router.get('/', getProductos);

// Buscar producto por SKU
router.get('/sku/:sku', getProductoBySku);

// Consultar producto por ID
router.get('/:id', getProductoById);

// Crear producto (solo ADMIN)
router.post('/', autorizarRoles('ADMIN'), createProducto);

// Actualizar producto (solo ADMIN)
router.patch('/:id', autorizarRoles('ADMIN'), patchProducto);

// Eliminar producto (solo ADMIN)
router.delete('/:id', autorizarRoles('ADMIN'), deleteProducto);

export default router;
