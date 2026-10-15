import { DataTypes, Model } from 'sequelize';
import db from './index'; // Importamos el db que configuraste en tu index.ts

class DetalleVenta extends Model {
    declare id_detalle: number;
    declare id_venta: number;    
    declare id_articulo: number;
    declare cant_articulo: number;
    declare precio_unidad: number;
}

DetalleVenta.init(
    {
        id_detalle : {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        cant_articulo : {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        precio_unidad : {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        }
    },
    {
        sequelize: db.sequelize,
        modelName: 'DetalleVenta',
        tableName: 'detalleVentas',
        timestamps: false,
    }
);

export default DetalleVenta;