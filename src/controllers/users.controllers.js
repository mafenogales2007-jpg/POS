import {
  loginService,
  registrarUsuarioService,
  listarUsuariosService,
  cambiarEstadoUsuarioService
} from '../services/users.services.js';

/**
 * Endpoint POST /api/auth/login
 */
export const loginController = async (req, res) => {
  try {
    const { identificador, email, documento, clave, password } = req.body;
    const credencial = identificador || email || documento;
    const passwordIngresado = clave || password;

    const data = await loginService({ identificador: credencial, clave: passwordIngresado });

    return res.status(200).json({
      success: true,
      message: 'Inicio de sesión exitoso',
      data
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message || 'Error en la autenticación'
    });
  }
};

/**
 * Endpoint POST /api/users (Exclusivo ADMIN)
 */
export const registerUserController = async (req, res) => {
  try {
    const nuevoUsuario = await registrarUsuarioService(req.body);
    return res.status(201).json({
      success: true,
      message: 'Operador registrado exitosamente',
      data: nuevoUsuario
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Error al registrar el operador'
    });
  }
};

/**
 * Endpoint GET /api/users (Exclusivo ADMIN)
 */
export const listUsersController = async (req, res) => {
  try {
    const usuarios = await listarUsuariosService();
    return res.status(200).json({
      success: true,
      message: 'Lista de operadores obtenida exitosamente',
      data: usuarios
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error al obtener los operadores'
    });
  }
};

/**
 * Endpoint PATCH /api/users/:id/estado (Exclusivo ADMIN)
 */
export const changeUserStatusController = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const usuarioActualizado = await cambiarEstadoUsuarioService(id, estado);
    return res.status(200).json({
      success: true,
      message: `Operador ${estado ? 'activado' : 'desactivado'} exitosamente`,
      data: usuarioActualizado
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Error al actualizar el estado del operador'
    });
  }
};

/**
 * Endpoint GET /api/auth/perfil (Para validar sesión y cargar contexto en React 19)
 */
export const getProfileController = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Perfil del operador autenticado',
    data: req.usuario
  });
};
