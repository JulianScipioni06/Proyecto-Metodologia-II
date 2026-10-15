import db from '../models/index';
import Venta from '../models/venta.model';
import DetalleVenta from '../models/detalleVenta.model';
import Articulo from '../models/articulos.model';

class VentaFacade {
    
    // Método para crear la venta
    async registrarVenta(id_cliente: number, items: any[], monto_total: number) {
        const t = await db.sequelize.transaction();

        try {
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
            return nuevaVenta; // Devolvemos el objeto limpio si todo salió bien

        } catch (error) {
            await t.rollback();
            throw error; // Pateamos el error para que lo ataje el controlador
        }
    }

    // Método para anular la venta
    async cancelarVenta(id_venta: number) {
        const t = await db.sequelize.transaction();

        try {
            const venta = await Venta.findByPk(id_venta, { transaction: t });
            if (!venta) throw new Error('Venta no encontrada');

            const detalles = await DetalleVenta.findAll({ where: { id_venta }, transaction: t });

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
            return true;

        } catch (error) {
            await t.rollback();
            throw error;
        }
    }
}

export default new VentaFacade();