import { Router } from 'express';
import { getVentas, crearVenta, anularVenta } from '../controllers/venta.controller';
import validateInputVenta from '../middlewares/venta.middleware'

const router = Router();

router.get('/', getVentas);
router.post('/', validateInputVenta, crearVenta);
router.delete('/:id_venta', anularVenta);

export default router;