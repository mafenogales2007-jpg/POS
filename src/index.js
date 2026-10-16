import express from 'express';          // ESModule
import usersRouter from './routers/ventas.routers.js';
import conexion from './config/mongo.config.js';
import productosRouter from './routers/productos.routers.js';
import categoriasRouter from './routers/categorias.routers.js';
import detalleVentaRouter from './routers/detalleVenta.routers.js';

const app = express();

app.use(express.json());

conexion();

// Definiendo 1 endpoint (ruta de entrada)
app.get('/health', (req, res) => {
    res.json({ msg: 'Servidor de SenaStore Funcionando!' });
});

// Enlazar todas las rutas
app.use('/api/productos', productosRouter);
app.use('/api/ventas', usersRouter);
app.use('/api/categorias', categoriasRouter);
app.use('/api/detalles-venta', detalleVentaRouter);

// Iniciar el servidor
const port = 3000;
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});