import { Router } from 'express';
import { listarProductos, crearProducto, modificarStock, eliminarProducto, listarStockBajo } from '../controllers/productos.controllers.js';

const router = Router();

router.get('/', listarProductos);
router.post('/', crearProducto);
router.put('/:id/stock', modificarStock);
router.delete('/:id', eliminarProducto);
router.get('/alertas/stock-bajo', listarStockBajo);

export default router;