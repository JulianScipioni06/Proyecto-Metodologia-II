import { Router } from 'express';
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

router.post('/', postArticulo);

router.put('/:id', putArticulo);
router.delete('/:id', deleteArticulo);

export default router;