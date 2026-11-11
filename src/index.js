import express from 'express';
import corsMiddleware from './middlewares/cors.middleware.js';
import tipoDocumentoRouter from './routers/tipoDocumento.routers.js';
import usersRouter from './routers/users.routers.js';
import terceroRouter from './routers/tercero.routers.js';
import passwordRouter from './routers/encriptar.routers.js';

import conexion from './config/mongo.config.js';

const app = express();
conexion(); // Conexión a MongoDB Atlas

// Middlewares globales
app.use(corsMiddleware); // Habilita CORS para React y otros clientes
app.use(express.json());  // Habilita parseo de JSON en body

// Endpoint de salud
app.get('/health', (req, res) => {
    res.json({ success: true, message: 'Servidor POS Funcionando Correctamente' });
});

// Rutas de la API (Camino B)
app.use('/api/tipos-documento', tipoDocumentoRouter);
app.use('/api/users', usersRouter);
app.use('/api/terceros', terceroRouter);
app.use('/api/password', passwordRouter );

// Manejo de rutas no encontradas (404)
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`
    });
});

// Middleware global para captura de errores imprevistos (500)
app.use((err, req, res, next) => {
    console.error('Error no controlado:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Error interno del servidor'
    });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor POS corriendo en http://localhost:${PORT}`);
});
