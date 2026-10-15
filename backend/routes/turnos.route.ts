import { Router } from 'express';
import{
    getTurnos,
    getTurnoPorId,
    postTurno,
    putTurno,
    deleteTurno,
} from '../controllers/turno.controller';

const router = Router();

router.get('/', getTurnos);
router.get('/:id_turno', getTurnoPorId);

router.post('/', postTurno);

router.put('/:id_turno', putTurno);
router.delete('/:id_turno', deleteTurno);

module.exports = router;