// const express = require('express');   // CommonJS
import express from 'express';           // ESModule

const app = express();

// Iniciar el servidor
const port = 3000;
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});