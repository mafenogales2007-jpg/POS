// const express = require('express');   // CommonJS
import express from 'express';           // ESModule
import usersRouter from './routers/ventas.routers.js';
import conexion from './config/mongo.config.js';

const app = express();

conexion()

// Definiendo 1 endpoint (ruta de entrada)
app.get('/health', (req, res) => {
    res.json({ msg: 'Servidor de SenaStore Funcionando!' });
});

//Enlazar todas las rutas
app.use('/api/ventas', usersRouter);

// Iniciar el servidor
const port = 3000;
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});