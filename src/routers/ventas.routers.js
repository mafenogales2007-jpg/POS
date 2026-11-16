import { Router } from 'express';
import {
    createVenta,
    getVentas,
    getVentaById,
    anularVentaController
} from '../controllers/ventas.controllers.js';
import { autenticarToken, autorizarRoles } from '../middlewares/auth.middleware.js';

const router = Router();

// Todas las rutas de ventas requieren autenticación de operador (RNF-03)
router.use(autenticarToken);

// RF-07: Listar historial y consultar ventas (Cajeros y Admins)
router.get('/', getVentas);
router.get('/:id', getVentaById);

// RF-07, RF-08: Registrar venta transaccional (Cajeros y Admins)
router.post('/', createVenta);

// RF-09: Anulación supervisada de ventas (Exclusivo para ADMIN)
router.patch('/:id/anular', autorizarRoles('ADMIN'), anularVentaController);

export default router;
