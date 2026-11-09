import { verificarJWT } from '../helpers/auth.helpers.js';
import { UsersModel } from '../models/users.model.js';

/**
 * Middleware de Autenticación de Operadores
 * Cumple con RNF-03 y el estándar de respuestas HTTP del proyecto.
 * 
 * Soporta el estándar industrial 'Authorization: Bearer <token>' (utilizado por React 19)
 * y de forma retrocompatible 'X-Token'.
 */
const authMiddleware = async (req, res, next) => {
  try {
    // Paso 1: Obtener el token de la cabecera (Bearer o X-Token)
    let token = req.header('Authorization') || req.header('X-Token');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Acceso no autorizado: No se proporcionó token de sesión'
      });
    }

    // Si viene en formato Bearer <token>, extraemos solo el hash
    if (token.startsWith('Bearer ')) {
      token = token.slice(7).trim();
    }

    // Paso 2: Validar formato base de un JWT (3 partes separadas por puntos)
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      return res.status(401).json({
        success: false,
        message: 'Formato del token no es válido'
      });
    }

    // Paso 3: Verificar firma y expiración del JWT
    const payload = verificarJWT(token);

    if (!payload) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido o expirado. Inicie sesión nuevamente.'
      });
    }

    // Paso 4: Validar existencia y vigencia del usuario en la base de datos
    const userFound = await UsersModel.findById(payload.id).populate('tipoDocumento');

    if (!userFound || !userFound.estadoUsuario) {
      return res.status(403).json({
        success: false,
        message: 'El operador está deshabilitado o no existe en el sistema'
      });
    }

    // Guardar el usuario en req para disponibilidad en controladores y middlewares de autorización
    req.usuario = userFound;
    req.userFound = userFound;

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al procesar la autenticación: ' + error.message
    });
  }
};

export { authMiddleware };
export default authMiddleware;
