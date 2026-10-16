import { DataTypes, Model } from 'sequelize';
import sequelize from './connection';

class Turno extends Model {
    declare id_turno: number;
    declare fecha: Date | string;
    declare horario: string;
    declare descripcion?: string;
    declare monto?: number;
    declare estado: string;
    declare mascota_id: number;
}

Turno.init(
    {
        id_turno: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        fecha: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        horario: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        descripcion: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        monto: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        estado: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        mascota_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'Turno',
        tableName: 'Turnos', 
        timestamps: false,
    }
);

export default Turno;