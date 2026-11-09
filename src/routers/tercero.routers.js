import { Router } from 'express';
import {
  crearTerceroController,
  listarTercerosController,
  obtenerTerceroPorIdController,
  obtenerTerceroPorDocumentoController,
  actualizarTerceroController,
  cambiarEstadoTerceroController
} from '../controllers/tercero.controllers.js';
import { autenticarToken, autorizarRoles } from '../middlewares/auth.middleware.js';

const router = Router();

// Todas las rutas de gestión de Terceros requieren operador autenticado (Cajero o Admin)
router.use(autenticarToken);

// Listar y consultar (accesible para cajeros en facturación y administradores)
router.get('/', listarTercerosController);
router.get('/documento/:doc', obtenerTerceroPorDocumentoController);
router.get('/:id', obtenerTerceroPorIdController);

// Crear terceros (clientes o proveedores)
router.post('/', crearTerceroController);

// Modificar datos o cambiar estado
router.put('/:id', actualizarTerceroController);
router.patch('/:id/estado', autorizarRoles('ADMIN'), cambiarEstadoTerceroController);

export default router;
