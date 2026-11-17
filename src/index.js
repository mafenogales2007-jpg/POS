
import express from 'express';
import 'dotenv/config';

import conexion from './config/mongo.config.js';

// Middlewares
import corsMiddleware from './middlewares/cors.middleware.js';

// Rutas de Usuarios
import tipoDocumentoRouter from './routers/tipoDocumento.routers.js';
import usersRouter from './routers/users.routers.js';
import terceroRouter from './routers/tercero.routers.js';
import passwordRouter from './routers/encriptar.routers.js';

// Rutas de Categorías e Inventario
import categoriasRouter from './routers/categorias.routers.js';
import productosRouter from './routers/productos.routers.js';
import stockRouter from './routers/stock.routers.js';

const PORT = process.env.PORT || 3001;
const app = express();

// Conexión a MongoDB
conexion();

// Middlewares globales
app.use(corsMiddleware);
app.use(express.json());

// Endpoint de salud
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Servidor POS funcionando correctamente'
    });
});

// Rutas del módulo Usuarios
app.use('/api/tipos-documento', tipoDocumentoRouter);
app.use('/api/users', usersRouter);
app.use('/api/terceros', terceroRouter);
app.use('/api/password', passwordRouter);

// Rutas del módulo Categorías e Inventario
app.use('/api/categorias', categoriasRouter);
app.use('/api/productos', productosRouter);
app.use('/api/stock', stockRouter);

// Manejador de rutas no encontradas (404)
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`
    });
});

// Manejador global de errores (500)
app.use((err, req, res, next) => {
    console.error('Error no controlado:', err);

    res.status(err.statusCode || err.status || 500).json({
        success: false,
        message: err.message || 'Error interno del servidor'
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor POS corriendo en http://localhost:${PORT}`);
});
