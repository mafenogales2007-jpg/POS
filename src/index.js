
import express from 'express';
import conexion from './config/mongo.config.js';

// Middleware global
import corsMiddleware from './middlewares/cors.middleware.js';

// Rutas del módulo Usuarios
import tipoDocumentoRouter from './routers/tipoDocumento.routers.js';
import usersRouter from './routers/users.routers.js';
import terceroRouter from './routers/tercero.routers.js';
import passwordRouter from './routers/encriptar.routers.js';

// Rutas del módulo Categorías y Productos
import categoriasRouter from './routers/categorias.routers.js';
import productosRouter from './routers/productos.routers.js';

// Rutas del módulo Inventario
import inventarioRouter from './routers/inventario.routers.js';
import stockRouter from './routers/stock.routers.js';

// Rutas del módulo Ventas
import ventasRouter from './routers/ventas.routers.js';
import detalleVentaRouter from './routers/detalleVenta.routers.js';
import formaDePagoRouter from './routers/formaDePago.routers.js';
import clientesRouter from './routers/clientes.routers.js';

// Rutas del módulo Compras, Caja y Puntos
import comprasRouter from './routers/compras.routers.js';
import puntosRouter from './routers/puntos.routers.js';
import cajaRouter from './routers/caja.routers.js';

// Rutas del módulo Reportes
import reportesAnaliticosRouter from './routers/reportesAnaliticos.routers.js';
import productsRouter from './routes/products.routes.js';
import reportesRouter from './routes/reportes.routes.js';

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

// Rutas del módulo Categorías y Productos
app.use('/api/categorias', categoriasRouter);
app.use('/api/productos', productosRouter);

// Rutas del módulo Inventario
app.use('/api/inventario', inventarioRouter);
app.use('/api/stock', stockRouter);

// Rutas del módulo Ventas
app.use('/api/ventas', ventasRouter);
app.use('/api/detalles-venta', detalleVentaRouter);
app.use('/api/formas-de-pago', formaDePagoRouter);
app.use('/api/clientes', clientesRouter);

// Rutas del módulo Compras, Caja y Puntos
app.use('/api/compras', comprasRouter);
app.use('/api/puntos', puntosRouter);
app.use('/api/caja', cajaRouter);

// Rutas del módulo Reportes
app.use('/api/reportes', reportesAnaliticosRouter);
app.use('/api/reportes-legacy', reportesRouter);

// Rutas adicionales de productos
app.use('/api/products', productsRouter);

// Manejador de rutas no encontradas (404)
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`
    });
});

// Manejador global de errores
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
