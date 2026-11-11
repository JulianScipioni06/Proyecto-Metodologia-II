import { Router } from 'express';
import validateInputMascota from '../middlewares/mascota.middleware'

import { 
    getMascotas, 
    getMascotabyId, 
    postMascota, 
    putMascota, 
    deleteMascota 
} from '../controllers/mascota.controller';

const router = Router();


router.get('/', getMascotas);
router.get('/:id', getMascotabyId);

router.post('/', validateInputMascota, postMascota);

router.put('/:id', validateInputMascota, putMascota);
router.delete('/:id', deleteMascota);

export default router;