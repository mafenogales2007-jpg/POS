import { Router } from 'express'
import { deleteUser, registerUser, getUser } from '../controllers/users.controllers.js';

const router = Router();

//Definir rutas para users
router.get('/', getUser );
router.post('/', registerUser );
// router.put('/', updateUser );
// router.patch('/', updateUserPatch );
router.delete('/', deleteUser );

export default router;