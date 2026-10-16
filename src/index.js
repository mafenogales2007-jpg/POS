
import express from 'express';
import reportesRouter from './routes/reportes.routes.js';
import conexion from './config/mongo.config.js';

const app = express();

app.use(express.json());

conexion();

app.get('/health', (req, res) => {
    res.json({ msg: 'Servidor de SenaStore Funcionando!' });
});

app.use('/api/reportes', reportesRouter);

const port = 3000;

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
