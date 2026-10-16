import { Router } from 'express';
import { createProducto, getProductos, getProductoById, patchProducto, deleteProducto } from '../controllers/productos.controllers.js';

const router = Router();

router.get('/', getProductos);
router.get('/:id', getProductoById);
router.post('/', createProducto);
router.patch('/:id', patchProducto);
router.delete('/:id', deleteProducto);

export default router;