import { Router } from 'express';
import { createVenta, getVentas, getVentaById, updateVenta, deleteVenta} from '../controllers/ventas.controllers.js';
import { verificarToken } from '../middlewares/auth.middleware.js';

const router = Router();

// Definir rutas para Ventas
router.get('/', getVentas);           // Listar todas las ventas
router.get('/:id', getVentaById);     // Obtener una venta por su ID
router.post('/', createVenta);        // Registrar una nueva venta
router.put('/:id', updateVenta);      // Actualizar venta (pendiente)
router.delete('/:id', deleteVenta);   // Eliminar o anular venta

export default router;