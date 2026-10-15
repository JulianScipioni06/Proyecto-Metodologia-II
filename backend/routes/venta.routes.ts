import { Router } from 'express';
import { getVentas, crearVenta, anularVenta } from '../controllers/venta.controller';

const router = Router();

router.get('/', getVentas);
router.post('/', crearVenta);
router.delete('/:id_venta', anularVenta);

export default router;