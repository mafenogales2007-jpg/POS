import { Router } from 'express';
import { createCategoria, getCategorias, patchCategoria, deleteCategoria } from '../controllers/categorias.controllers.js';

const router = Router();

router.get('/', getCategorias);
router.post('/', createCategoria);
router.patch('/:id', patchCategoria);
router.delete('/:id', deleteCategoria);

export default router;