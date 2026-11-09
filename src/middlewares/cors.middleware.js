/**
 * Middleware para habilitar CORS (Cross-Origin Resource Sharing)
 * Permite que clientes frontend (como React en Vite http://localhost:5173 o CRA http://localhost:3000)
 * puedan consumir la API REST sin ser bloqueados por las políticas de seguridad del navegador.
 */
export const corsMiddleware = (req, res, next) => {
  // 1. Permitir cualquier origen de origen en desarrollo (o configurar orígenes permitidos)
  res.header('Access-Control-Allow-Origin', '*');

  // 2. Métodos HTTP permitidos en la API
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');

  // 3. Cabeceras permitidas en las peticiones (incluye Authorization para JWT y Content-Type)
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Token'
  );

  // 4. Responder inmediatamente a las peticiones pre-flight de los navegadores (OPTIONS)
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
};

export default corsMiddleware;
