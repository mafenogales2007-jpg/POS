import { Router } from 'express';
import { createCliente, getClientes, getClienteById, patchCliente, deleteCliente} from '../controllers/clientes.controllers.js';

const router = Router();

router.get('/', getClientes);
router.get('/:id', getClienteById);
router.post('/', createCliente);
router.patch('/:id', patchCliente);
router.delete('/:id', deleteCliente);

export default router;