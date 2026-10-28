import { Router } from 'express';
import { inventarioController } from '../controllers/inventario.controller.js';

const router = Router();

router.get('/', inventarioController.listarInventario);
router.get('/stock-bajo', inventarioController.listarStockBajo);
router.get('/movimientos', inventarioController.listarMovimientos); 
router.put('/:id/stock', inventarioController.ajustarStock);

export default router;