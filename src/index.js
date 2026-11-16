import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import conexion from './config/mongo.config.js';

// Enrutadores del Módulo Juan (Catálogo e Inventario)
import categoriasRouter from './routers/categorias.routers.js';
import productosRouter from './routers/productos.routers.js';
import stockRouter from './routers/stock.routers.js';

const PORT = process.env.PORT || 3001;
const app = express();

app.use(cors());
app.use(express.json());

// Conexión a MongoDB Atlas
conexion();

// Comprobación de salud
app.get('/health', (req, res) => {
    res.status(200).json({ success: true, message: 'Servidor de SenaStore POS (Módulo Catálogo e Inventario) Funcionando!' });
});

// Rutas Oficiales del Plan de Trabajo (Sección 3.2 - Juan)
app.use('/api/categorias', categoriasRouter);
app.use('/api/productos', productosRouter);
app.use('/api/stock', stockRouter);

// Manejador 404
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Ruta no encontrada (404): ${req.method} ${req.originalUrl}`
    });
});

// Manejador 500
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
