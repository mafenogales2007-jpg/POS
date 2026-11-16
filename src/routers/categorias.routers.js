import { Router } from 'express';
import { createCategoria, getCategorias, getCategoriaById } from '../controllers/categorias.controllers.js';
import { autenticarToken, autorizarRoles } from '../middlewares/auth.middleware.js';

const router = Router();

// HU-04: Endpoints GET /api/categorias, POST /api/categorias (restringido a ADMIN)
router.get('/', autenticarToken, getCategorias);
router.get('/:id', autenticarToken, getCategoriaById);
router.post('/', autenticarToken, autorizarRoles('ADMIN'), createCategoria);

export default router;
