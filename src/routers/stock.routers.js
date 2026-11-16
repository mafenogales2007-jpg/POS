import { Router } from 'express';
import {
    getAlertasStockCritico,
    getStockByProductoId,
    inicializarStockController
} from '../controllers/stock.controllers.js';
import { autenticarToken, autorizarRoles } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(autenticarToken);

// HU-06 / RF-06: Consulta de productos con stock crítico (totalStock <= stockMinimo)
router.get('/alertas', getAlertasStockCritico);

// Obtener stock de un producto
router.get('/producto/:id', getStockByProductoId);

// Inicializar o ajustar stock (Solo ADMIN)
router.post('/inicializar', autorizarRoles('ADMIN'), inicializarStockController);

export default router;
