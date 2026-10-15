import { Router } from 'express';

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

router.post('/', postMascota);

router.put('/:id', putMascota);
router.delete('/:id', deleteMascota);

export default router;