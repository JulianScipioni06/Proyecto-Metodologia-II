import { Router } from 'express';
import{
    getTurnos,
    getTurnoPorId,
    postTurno,
    putTurno,
    deleteTurno,
} from '../controllers/turno.controller';

import validateInputTurno from '../middlewares/turno.middleware'

const router = Router();

router.get('/', getTurnos);
router.get('/:id_turno', getTurnoPorId);

router.post('/', validateInputTurno, postTurno);

router.put('/:id_turno', validateInputTurno, putTurno);
router.delete('/:id_turno', deleteTurno);

export default  router;