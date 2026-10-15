import { Request, Response } from 'express';
import VentaFacade from '../services/venta.facade';
import Venta from '../models/venta.model';

export const obtenerVentas = async (req: Request, res: Response): Promise<void> => {
    try {
        const ventas = await Venta.findAll();
        res.status(200).json(ventas);
    } catch (error: any) {
        res.status(500).json({ msg: 'Error al obtener el historial de ventas', error: error.message });
    }
};

export const crearVenta = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id_cliente, items, monto_total } = req.body;

        // Magia pura: delegamos toda la complejidad a la Fachada
        const nuevaVenta = await VentaFacade.registrarVenta(id_cliente, items, monto_total);

        res.status(201).json({ msg: 'Venta registrada con éxito', venta: nuevaVenta });
    } catch (error: any) {
        res.status(400).json({ msg: 'Error al registrar la venta', error: error.message });
    }
};

export const anularVenta = async (req: Request, res: Response): Promise<void> => {
    try {
        const id_venta = Number(req.params.id_venta);

        // De nuevo, le pasamos el problema a la Fachada
        await VentaFacade.cancelarVenta(id_venta);

        res.status(200).json({ msg: 'Venta anulada y stock restituido con éxito' });
    } catch (error: any) {
        res.status(400).json({ msg: 'Error al anular la venta', error: error.message });
    }
};