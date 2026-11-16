import jwt from 'jsonwebtoken';

/**
 * Middleware para validar el token JWT desde la cabecera Authorization: Bearer <token>
 * Cumple con RNF-03
 */
export const autenticarToken = (req, res, next) => {
    let authHeader = req.headers['authorization'] || req.header('Authorization') || req.header('X-Token');

    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: 'Acceso no autorizado: No se proporcionó la cabecera Authorization (401)'
        });
    }

    if (authHeader.startsWith('Bearer ')) {
        authHeader = authHeader.slice(7).trim();
    }

    try {
        const secret = process.env.JWT_SECRET || 'clave_secreta_temporal';
        const decoded = jwt.verify(authHeader, secret);

        req.usuario = {
            _id: decoded._id || decoded.id,
            id: decoded.id || decoded._id,
            rol: (decoded.rol || decoded.role || 'CAJERO').toUpperCase(),
            ...decoded
        };

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Token inválido o expirado. Inicie sesión nuevamente.'
        });
    }
};

/**
 * Middleware para autorizar roles específicos (ej. autorizarRoles('ADMIN'))
 * Cumple con RF-01 y RF-02
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
        const permitidos = rolesPermitidos.flat().map(r => r.toUpperCase());

        if (permitidos.length > 0 && !permitidos.includes(rolUsuario)) {
            return res.status(403).json({
                success: false,
                message: `Acceso denegado: El rol '${rolUsuario}' no tiene permisos para esta operación (se requiere: ${permitidos.join(' o ')})`
            });
        }

        next();
    };
};

export const verificarToken = autenticarToken;

export default {
    autenticarToken,
    autorizarRoles,
    verificarToken
};
