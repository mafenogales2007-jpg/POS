import { Router } from 'express'
import { createVenta, deleteVenta, registerVenta, updateVenta, updaVenta } from '../controllers/ventas.controllers.js';

const router = Router();

//Definir rutas para users
router.get('/', createVenta );
router.post('/', registerVenta );
router.put('/:id', updateVenta );
router.patch('/:id', updaVenta );
router.delete('/:id', deleteVenta );

export default router;