import { DataTypes, Model } from 'sequelize';
const { sequelize } = require('./index');

class Cliente extends Model {
    declare id_cliente: number;
    declare nombre: string;
    declare telefono: string;
    declare Direccion: string;
}

Cliente.init(
    {
        id_cliente: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nombre: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        telefono: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true,
        },
        Direccion: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'Cliente',
        tableName: 'Clientes',
        timestamps: false,
    }
);

export default Cliente;