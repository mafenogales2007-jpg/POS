import express from 'express';
import cors from 'cors';
import conexion from './config/mongo.config.js';
import ventasRouter from './routers/ventas.routers.js';
import detalleVentaRouter from './routers/detalleVenta.routers.js';
import formaDePagoRouter from './routers/formaDePago.routers.js';
import productosRouter from './routers/productos.routers.js';
import categoriasRouter from './routers/categorias.routers.js';
import clientesRouter from './routers/clientes.routers.js';

const PORT = process.env.PORT || 3001;

const app = express();

app.use(cors());
app.use(express.json());

conexion();

// Endpoint de comprobación
app.get('/health', (req, res) => {
    res.status(200).json({ success: true, message: 'Servidor de SenaStore POS Funcionando!' });
});

// Rutas del Módulo de Facturación y Ventas (POS)
app.use('/api/ventas', ventasRouter);
app.use('/api/detalles-venta', detalleVentaRouter);
app.use('/api/formas-de-pago', formaDePagoRouter);

// Rutas auxiliares
app.use('/api/productos', productosRouter);
app.use('/api/categorias', categoriasRouter);
app.use('/api/clientes', clientesRouter);

// Manejador de rutas no encontradas (404)
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Recurso no encontrado (404): ${req.method} ${req.originalUrl}`
    });
});

// Manejador de errores imprevistos (500)
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
