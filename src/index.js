import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import conexion from './config/mongo.config.js';

// Enrutadores del Módulo Adrian (Compras, Fidelización y Cierre de Caja)
import comprasRouter from './routers/compras.routers.js';
import puntosRouter from './routers/puntos.routers.js';
import cajaRouter from './routers/caja.routers.js';
import reportesAnaliticosRouter from './routers/reportesAnaliticos.routers.js';

// Enrutadores de soporte existentes
import productsRouter from './routes/products.routes.js';
import reportesRouter from './routes/reportes.routes.js';

const PORT = process.env.PORT || 3001;
const app = express();

app.use(cors());
app.use(express.json());

// Conexión a MongoDB Atlas
conexion();

// Endpoint de comprobación de salud
app.get('/health', (req, res) => {
    res.json({ success: true, message: 'Servidor de SenaStore POS (Módulo Reportes y Compras) Funcionando!' });
});

// Rutas Oficiales del Plan de Trabajo (Sección 3.4 - Adrian)
app.use('/api/compras', comprasRouter);
app.use('/api/puntos', puntosRouter);
app.use('/api/caja', cajaRouter);
app.use('/api/reportes', reportesAnaliticosRouter);

// Rutas legacy de soporte
app.use('/api/products', productsRouter);
app.use('/api/reportes-legacy', reportesRouter);

// Manejo de rutas no encontradas (404)
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Ruta no encontrada (404): ${req.method} ${req.originalUrl}`
    });
});

// Manejo de errores no controlados (500)
app.use((err, req, res, next) => {
    console.error(err.stack);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Error interno del servidor (500)'
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor POS corriendo en http://localhost:${PORT}`);
});
