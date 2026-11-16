import { Router } from 'express';
import { consultarPuntosController, redimirPuntosController } from '../controllers/puntos.controllers.js';
import { autenticarToken } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(autenticarToken);

// HU-11 / RF-11: Consultar puntos por cédula o ID
router.get('/:identificador', consultarPuntosController);

// HU-11 / RF-11: Redimir puntos en caja
router.post('/redimir', redimirPuntosController);

export default router;
