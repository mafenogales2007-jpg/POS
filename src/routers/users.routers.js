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

// ================= Rutas de Creación y Consulta de Usuarios =================
// Si no hay usuarios en la BD, permite registrar el primer ADMIN sin pedir token inicial
router.post('/', async (req, res, next) => {
  const { UsersModel } = await import('../models/users.model.js');
  const count = await UsersModel.countDocuments();
  if (count === 0) {
    return registerUserController(req, res);
  }
  return autenticarToken(req, res, () => {
    autorizarRoles('ADMIN')(req, res, next);
  });
}, registerUserController);
router.get('/', autenticarToken, autorizarRoles('ADMIN'), listUsersController);
router.patch('/:id/estado', autenticarToken, autorizarRoles('ADMIN'), changeUserStatusController);

export default router;
