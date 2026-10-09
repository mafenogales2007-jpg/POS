import { Router } from 'express'
import { createUser, deleteUser, registerUser, updateUser, updaUser } from '../controllers/users.controllers.js';

const router = Router();

//Definir rutas para users
router.get('/', createUser );
router.post('/', registerUser );
router.put('/', updateUser );
router.patch('/', updaUser );
router.delete('/', deleteUser );

export default router;