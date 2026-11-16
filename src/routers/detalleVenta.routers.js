import { Router } from 'express';
import { getDetallesVenta } from '../controllers/detalleVenta.controllers.js';
import { autenticarToken } from '../middlewares/auth.middleware.js';

const router = Router();

// Consulta de detalles de venta protegida
router.get('/', autenticarToken, getDetallesVenta);

export default router;
