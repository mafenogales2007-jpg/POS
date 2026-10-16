
import express from 'express';
import { obtenerReportes } from '../controllers/reportes.controllers.js';

const router = express.Router();

// Ruta principal de reportes
router.get('/', obtenerReportes);

export default router;
