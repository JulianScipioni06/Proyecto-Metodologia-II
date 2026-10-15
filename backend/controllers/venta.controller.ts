import { Request, Response } from 'express';
import db from '../models/index';
import Venta from '../models/venta.model';
import DetalleVenta from '../models/detalleVenta.model';
import Articulo from '../models/articulos.model';

// GET: Listar todas las ventas
export const obtenerVentas = async (req: Request, res: Response): Promise<void> => {
    try {
        const ventas = await Venta.findAll();
        res.status(200).json(ventas);
    } catch (error: any) {
        res.status(500).json({ msg: 'Error al obtener el historial de ventas', error: error.message });
    }
};

export const crearVenta = async (req: Request, res: Response): Promise<void> => {
    const t = await db.sequelize.transaction();

    try {
        const { id_cliente, items, monto_total } = req.body;

        const nuevaVenta = await Venta.create({
            id_cliente,
            fecha_venta: new Date(),
            monto_total
        }, { transaction: t });

        for (const item of items) {

            const articulo: any = await Articulo.findByPk(item.id_articulo, { transaction: t });

            if (!articulo || articulo.stock < item.cant_articulo) {
                throw new Error(`Stock insuficiente para el artículo ${item.id_articulo}`);
            }

            articulo.stock -= item.cant_articulo;
            await articulo.save({ transaction: t });

            await DetalleVenta.create({
                id_venta: nuevaVenta.id_venta,
                id_articulo: item.id_articulo,
                cant_articulo: item.cant_articulo,
                precio_unidad: item.precio_unidad
            }, { transaction: t });
        }

        await t.commit();
        res.status(201).json({ msg: 'Venta registrada con éxito', venta: nuevaVenta });

    } catch (error: any) {
        await t.rollback();
        res.status(400).json({ msg: 'Error al registrar la venta', error: error.message });
    }
};

export const anularVenta = async (req: Request, res: Response): Promise<void> => {
    const t = await db.sequelize.transaction();

    try {
        const { id_venta } = req.params;

        const venta = await Venta.findByPk(Number(id_venta), { transaction: t });
        if (!venta) {
            throw new Error('Venta no encontrada');
        }

        const detalles = await DetalleVenta.findAll({ 
            where: { id_venta }, 
            transaction: t 
        });

        for (const detalle of detalles) {
            const articulo: any = await Articulo.findByPk(detalle.id_articulo, { transaction: t });
            if (articulo) {
                articulo.stock += detalle.cant_articulo; 
                await articulo.save({ transaction: t });
            }
        }

        await DetalleVenta.destroy({ where: { id_venta }, transaction: t });
        await venta.destroy({ transaction: t });

        await t.commit();
        res.status(200).json({ msg: 'Venta anulada y stock restituido con éxito' });

    } catch (error: any) {
        await t.rollback();
        res.status(400).json({ msg: 'Error al anular la venta', error: error.message });
    }
};