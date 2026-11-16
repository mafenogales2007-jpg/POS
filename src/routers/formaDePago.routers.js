import { Router } from 'express';
import { getFormasDePago, createFormaDePago } from '../controllers/formaDePago.controllers.js';
import { autenticarToken, autorizarRoles } from '../middlewares/auth.middleware.js';

const router = Router();

// HU-07: Catálogo de formas de pago (Cajeros y Admins)
router.get('/', autenticarToken, getFormasDePago);

// Crear nueva forma de pago (solo Administradores)
router.post('/', autenticarToken, autorizarRoles('ADMIN'), createFormaDePago);

export default router;
