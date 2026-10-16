import { Router } from 'express';
import { createDetalleVenta, getDetallesVenta } from '../controllers/detalleVenta.controllers.js';

const router = Router();

router.get('/', getDetallesVenta);
router.post('/', createDetalleVenta);

export default router;