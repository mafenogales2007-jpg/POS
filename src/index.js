// const express = require('express');   // CommonJS
import express from 'express';           // ESModule

import usersRouter from './rourtes/users.rourtes.js';
import conexion from './config/mongo.config.js';

const app = express();    // Instancia de express
conexion(); //ejecuta la conexion a la base de datos 

app.use(express.json());  // habilita a la aplicacion para interpretar JSON   

// Definiendo 1 endpoint (ruta de entrada)
app.get('/health', (req, res) => {
    res.json({ msg: 'Servidor de SenaStore Funcionando!' });
});

//Enlazar todas las rutas
app.use('/api/users', usersRouter);

// Iniciar el servidor
const port = 3000;
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});