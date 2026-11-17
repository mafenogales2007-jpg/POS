import { Router } from 'express';
import { getRotacionProductos } from '../controllers/reportesAnaliticos.controllers.js';
import { autenticarToken, autorizarRoles } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(autenticarToken);

// HU-12 / RF-13: Reporte de rotación de productos (Exclusivo ADMIN)
router.get('/rotacion', autorizarRoles('ADMIN'), getRotacionProductos);

export default router;
