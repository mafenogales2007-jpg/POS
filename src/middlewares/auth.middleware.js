import { validateToken } from '../helpers/jwt.helpers.js';
import { UsersModel } from '../models/users.model.js';

/**
 * Middleware para validar el token JWT desde la cabecera Authorization: Bearer <token>
 * Cumple con RNF-03
 */
export const autenticarToken = async (req, res, next) => {
  try {
    let authHeader = req.headers['authorization'] || req.header('Authorization') || req.header('X-Token');

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Acceso no autorizado: No se proporcionó la cabecera Authorization'
      });
    }

    if (authHeader.startsWith('Bearer ')) {
      authHeader = authHeader.slice(7).trim();
    }

    const payload = validateToken(authHeader);

    if (!payload) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido o expirado. Inicie sesión nuevamente.'
      });
    }

    // Verificar que el usuario continúe activo en la base de datos
    const usuarioActivo = await UsersModel.findById(payload.id);

    if (!usuarioActivo || !usuarioActivo.estadoUsuario) {
      return res.status(403).json({
        success: false,
        message: 'El operador asociado a este token está inactivo o fue eliminado'
      });
    }

    // Inyectar datos del usuario autenticado en la petición
    req.usuario = usuarioActivo;
    req.userFound = usuarioActivo;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al autenticar el token: ' + error.message
    });
  }
};

/**
 * Middleware para autorizar roles específicos (ej. autorizarRoles('ADMIN'))
 * Cumple con RF-01 y RF-02
 */
export const autorizarRoles = (rolesPermitidos = []) => {
  return (req, res, next) => {
    if( rolesPermitidos.length == 0 ) {
      return res.status(401).json({
        success: false,
        message: 'La ruta no tiene definidos los roles permitidos'
      });
    }

    if (!req.usuario) {
      return res.status(401).json({
        success: false,
        message: 'No hay usuario autenticado en la petición'
      });
    }

    if (!rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({
        success: false,
        message: `Acceso denegado: El rol '${req.usuario.rol}' no tiene permisos para esta operación`
      });
    }

    next();
  };
};

export default {
  autenticarToken,
  autorizarRoles
};
