import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import productosRouter from './routers/productos.routers.js';
import inventarioRouter from './routers/inventario.routers.js'; // 1. Importa el router de inventario
import conexion from './config/mongo.config.js';

const PORT = process.env.PORT || 3001;
const app = express();

app.use(cors());
app.use(express.json());

conexion();

app.get('/health', (req, res) => {
    res.status(200).json({ success: true, msg: 'Servidor de SenaStore Funcionando!' });
});

// 2. Enlaza las rutas
app.use('/api/productos', productosRouter);
app.use('/api/inventario', inventarioRouter); // Ruta base para el inventario

app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: 'Recurso no encontrado (404)'
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Error interno del servidor (500)'
    });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});