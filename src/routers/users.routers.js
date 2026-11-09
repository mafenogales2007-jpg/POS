import { Router } from 'express';
import {
  loginController,
  registerUserController,
  listUsersController,
  changeUserStatusController,
  getProfileController
} from '../controllers/users.controllers.js';
import { autenticarToken, autorizarRoles } from '../middlewares/auth.middleware.js';

const router = Router();

// ================= Rutas Públicas de Autenticación =================
router.post('/login', loginController);

// ================= Rutas Protegidas (Cualquier Operador Autenticado) =================
router.get('/perfil', autenticarToken, getProfileController);

// ================= Rutas Exclusivas para ADMIN (RF-02) =================
router.post('/', autenticarToken, autorizarRoles('ADMIN'), registerUserController);
router.get('/', autenticarToken, autorizarRoles('ADMIN'), listUsersController);
router.patch('/:id/estado', autenticarToken, autorizarRoles('ADMIN'), changeUserStatusController);

export default router;
