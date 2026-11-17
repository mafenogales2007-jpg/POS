import { Router } from 'express';
import {
  obtenerTiposDocumentoController,
  obtenerTipoDocumentoPorIdController,
  crearTipoDocumentoController
} from '../controllers/tipoDocumento.controllers.js';
import { autenticarToken, autorizarRoles} from '../middlewares/auth.middleware.js';

const router = Router();

// Rutas de consulta (accesibles para poblar listas desplegables en formularios de registro)
router.get('/', autenticarToken, autorizarRoles(['ADMIN']), obtenerTiposDocumentoController);
router.get('/:id', obtenerTipoDocumentoPorIdController);

// Ruta de creación (restringida funcionalmente según el plan)
router.post('/', crearTipoDocumentoController);

export default router;
