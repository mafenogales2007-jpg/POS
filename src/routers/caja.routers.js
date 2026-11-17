import { Router } from 'express';
import { getCierreDiario } from '../controllers/caja.controllers.js';
import { autenticarToken, autorizarRoles } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(autenticarToken);

// HU-12 / RF-12: Cierre diario de caja (Exclusivo ADMIN)
router.get('/cierre-diario', autorizarRoles('ADMIN'), getCierreDiario);

export default router;
