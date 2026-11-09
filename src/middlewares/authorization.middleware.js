/**
 * Middleware para autorizar roles específicos (ej. ADMIN, CAJERO)
 * Compatible con la estructura en capas y estándar de respuestas del POS.
 */
const authorizationMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    // Extraer el usuario inyectado por authMiddleware
    const usuario = req.usuario || req.userFound;

    if (!usuario) {
      return res.status(401).json({
        success: false,
        message: 'No hay usuario autenticado en la petición'
      });
    }

    const role = usuario.rol;

    if (!role) {
      return res.status(403).json({
        success: false,
        message: 'Error: El usuario autenticado no tiene rol asignado'
      });
    }

    // Convertir a arreglo si se pasa un string único
    const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    // Verificar si el rol está permitido
    if (!rolesArray.includes(role)) {
      return res.status(403).json({
        success: false,
        message: `Acceso denegado: el rol '${role}' no está autorizado para realizar esta acción`
      });
    }

    next();
  };
};

export { authorizationMiddleware };
export default authorizationMiddleware;
