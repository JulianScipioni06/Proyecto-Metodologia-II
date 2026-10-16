import { DataTypes, Model } from 'sequelize';
import sequelize from './connection';

class Venta extends Model {
    declare id_venta: number;
    declare fecha_venta: Date;
    declare monto_total: number;
    declare id_cliente: number;
}

Venta.init(
    {
        id_venta : {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        fecha_venta : {
            type: DataTypes.DATE,
            allowNull: false,
        },
        monto_total : {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        }
    },
    {
        sequelize,
        modelName: 'Venta',
        tableName: 'ventas',
        timestamps: false,
    }
);

export default Venta;