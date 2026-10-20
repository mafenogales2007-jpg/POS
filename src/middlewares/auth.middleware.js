import jwt from 'jsonwebtoken';

export const verificarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: 'Acceso denegado. Token no proporcionado (401 Unauthorized).'
        });
    }

    const token = authHeader.split(' ')[1]; // Formato: Bearer TOKEN

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Formato de token inválido.'
        });
    }

    try {
        const secret = process.env.JWT_SECRET || 'clave_secreta_temporal';
        const decoded = jwt.verify(token, secret);
        req.usuario = decoded; // Guardamos los datos del usuario decodificados
        next();
    } catch (error) {
        return res.status(403).json({
            success: false,
            message: 'Token inválido o expirado (403 Forbidden).'
        });
    }
};