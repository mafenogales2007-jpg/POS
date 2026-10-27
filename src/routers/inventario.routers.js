import { Router } from 'express';
// Aquí puedes importar las funciones de tu controlador de inventario
const router = Router();

// Ejemplo de ruta de inventario
router.get('/', (req, res) => {
    res.status(200).json({ success: true, message: 'Ruta de inventario activa' });
});

export default router;