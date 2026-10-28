import { Router } from 'express';
import { listarCategorias, crearCategoria, eliminarCategoria } from '../controllers/categorias.controllers.js';

const router = Router();

router.get('/', listarCategorias);
router.post('/', crearCategoria);
router.delete('/:id', eliminarCategoria);

export default router;