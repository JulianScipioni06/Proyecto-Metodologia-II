import { Router } from 'express';
import validateInputArticulo from '../middlewares/articulo.middleware'

import { 
    getArticulos, 
    getArticuloById, 
    postArticulo, 
    putArticulo, 
    deleteArticulo 
} from '../controllers/articulos.controller';

const router = Router();

router.get('/', getArticulos);
router.get('/:id', getArticuloById);

router.post('/', validateInputArticulo, postArticulo);

router.put('/:id', validateInputArticulo, putArticulo);
router.delete('/:id', deleteArticulo);

export default router;