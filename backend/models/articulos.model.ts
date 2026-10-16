import { DataTypes, Model } from 'sequelize';
import sequelize from './connection';

class Articulo extends Model {
    declare id_articulo: number;
    declare nombre: string;
    declare stock: number;
    declare precio_unitario: number;
}

Articulo.init(
    {
        nombre: {
            type: DataTypes.STRING(100),
            allowNull: false, 
        },
        stock: {
            type: DataTypes.INTEGER,
            allowNull: false, 
        },
        precio_unitario: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false, 
        }
    },

    {
        sequelize,
        modelName: 'Articulo',
        tableName: 'articulos',
        timestamps: false,
    }
);

export default Articulo;