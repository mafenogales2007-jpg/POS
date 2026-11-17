
import { Router } from 'express';

import {
    createCategoria,
    getCategorias,
    getCategoriaById,
    patchCategoria,
    deleteCategoria
} from '../controllers/categorias.controllers.js';

import {
    autenticarToken,
    autorizarRoles
} from '../middlewares/auth.middleware.js';

const router = Router();

// Consultar todas las categorías
router.get('/', autenticarToken, getCategorias);

// Consultar una categoría por ID
router.get('/:id', autenticarToken, getCategoriaById);

// Crear categoría (solo ADMIN)
router.post('/', autenticarToken, autorizarRoles('ADMIN'), createCategoria);

// Actualizar categoría (solo ADMIN)
router.patch('/:id', autenticarToken, autorizarRoles('ADMIN'), patchCategoria);

// Eliminar categoría (solo ADMIN)
router.delete('/:id', autenticarToken, autorizarRoles('ADMIN'), deleteCategoria);

export default router;
