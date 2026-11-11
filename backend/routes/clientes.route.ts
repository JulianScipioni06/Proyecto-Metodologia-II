import { Router } from 'express';
import {
    getClientes, 
    getCliente, 
    postCliente, 
    putCliente, 
    deleteCliente 
} from '../controllers/cliente.controller';

import validateInputCliente from '../middlewares/cliente.middleware';


const router = Router();

router.get('/', getClientes);
router.get('/:id', getCliente);

router.post('/', validateInputCliente, postCliente);

router.put('/:id', validateInputCliente, putCliente);
router.delete('/:id', deleteCliente);

export default router;