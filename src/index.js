import express from 'express';          // ESModule
import 'dotenv/config';
import usersRouter from './routers/ventas.routers.js';
import conexion from './config/mongo.config.js';
import productosRouter from './routers/productos.routers.js';
import categoriasRouter from './routers/categorias.routers.js';
import detalleVentaRouter from './routers/detalleVenta.routers.js';
import clientesRouter from './routers/clientes.routers.js';

const PORT = process.env.PORT || 3001;

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
app.use('/api/clientes', clientesRouter);

// Iniciar el servido
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});