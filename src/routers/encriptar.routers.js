import { Router } from 'express';
import { encriptarPasswordController } from '../controllers/encriptar.controllers.js';

const router = Router();

router.get('/encriptar', encriptarPasswordController );

export default router;