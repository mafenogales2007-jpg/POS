import { Router } from 'express';
import {
  obtenerTiposDocumentoController,
  obtenerTipoDocumentoPorIdController,
  crearTipoDocumentoController
} from '../controllers/tipoDocumento.controllers.js';

const router = Router();

// Rutas de consulta (accesibles para poblar listas desplegables en formularios de registro)
router.get('/', obtenerTiposDocumentoController);
router.get('/:id', obtenerTipoDocumentoPorIdController);

// Ruta de creación (restringida funcionalmente según el plan)
router.post('/', crearTipoDocumentoController);

export default router;
