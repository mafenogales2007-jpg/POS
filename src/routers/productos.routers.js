import { Router } from 'express';
import {
    createProducto,
    getProductos,
    getProductoBySku,
    getProductoById
} from '../controllers/productos.controllers.js';
import { autenticarToken, autorizarRoles } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(autenticarToken);

// HU-05: Catálogo de productos y búsqueda rápida por SKU
router.get('/', getProductos);
router.get('/sku/:sku', getProductoBySku);
router.get('/:id', getProductoById);

// Registrar producto (Solo ADMIN)
router.post('/', autorizarRoles('ADMIN'), createProducto);

export default router;
