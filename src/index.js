
import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import dotenv from 'dotenv';
import reportesRouter from './routes/reportes.routes.js';
import conexion from './config/mongo.config.js';
import productsRouter from './routes/products.routes.js';

const PORT = process.env.PORT || 3001;
const app = express();

dotenv.config();

app.use(cors());

app.use(express.json());

conexion();

app.get('/health', (req, res) => {
    res.json({ msg: 'Servidor de SenaStore Funcionando!' });
});

//Rutas
app.use('/api/reportes', reportesRouter);
app.use( '/api/products', productsRouter);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
