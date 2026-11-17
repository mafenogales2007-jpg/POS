import { Router } from 'express';
import { createCompra, getCompras, getCompraById } from '../controllers/compras.controllers.js';
import { autenticarToken, autorizarRoles } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(autenticarToken);

// HU-10 / RF-10: Registrar compras a proveedores (Solo ADMIN)
router.post('/', autorizarRoles('ADMIN'), createCompra);

// Consultar compras
router.get('/', autorizarRoles('ADMIN'), getCompras);
router.get('/:id', autorizarRoles('ADMIN'), getCompraById);

export default router;
