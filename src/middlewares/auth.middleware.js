
import { validateToken } from '../helpers/jwt.helpers.js';
import { UsersModel } from '../models/users.model.js';

/**
 * Middleware para validar el token JWT.
 * Comprueba que el token sea válido y que el usuario
 * exista y permanezca activo en la base de datos.
 */
export const autenticarToken = async (req, res, next) => {
    try {
        let authHeader =
            req.headers['authorization'] ||
            req.header('Authorization') ||
            req.header('X-Token');

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

        // Buscar al usuario mediante el ID incluido en el token
        const usuarioActivo = await UsersModel.findById(
            payload.id || payload._id
        );

        if (!usuarioActivo || !usuarioActivo.estadoUsuario) {
            return res.status(403).json({
                success: false,
                message: 'El usuario asociado a este token está inactivo o fue eliminado'
            });
        }

        // Datos del usuario autenticado
        req.usuario = {
            ...usuarioActivo.toObject(),
            id: usuarioActivo._id,
            rol: (usuarioActivo.rol || payload.rol || payload.role || 'CAJERO').toUpperCase()
        };

        req.userFound = usuarioActivo;

        next();

    } catch (error) {
        console.error('Error al autenticar:', error);

        return res.status(500).json({
            success: false,
            message: 'Error al autenticar el token'
        });
    }
};

/**
 * Middleware para autorizar roles específicos.
 * Ejemplo: autorizarRoles('ADMIN')
 */
export const autorizarRoles = (...rolesPermitidos) => {
    return (req, res, next) => {

        if (!req.usuario) {
            return res.status(401).json({
                success: false,
                message: 'No hay usuario autenticado en la petición'
            });
        }

        const rolUsuario = (req.usuario.rol || '').toUpperCase();

        const permitidos = rolesPermitidos
            .flat()
            .map(rol => rol.toUpperCase());

        if (permitidos.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'La ruta no tiene definidos los roles permitidos'
            });
        }

        if (!permitidos.includes(rolUsuario)) {
            return res.status(403).json({
                success: false,
                message: `Acceso denegado: el rol '${rolUsuario}' no tiene permisos para esta operación`
            });
        }

        next();
    };
};

// Compatibilidad con otras implementaciones del middleware
export const verificarToken = autenticarToken;

export default {
    autenticarToken,
    autorizarRoles,
    verificarToken
};
