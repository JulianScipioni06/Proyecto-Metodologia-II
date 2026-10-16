import { DataTypes, Model } from 'sequelize';
import sequelize from './connection';

class Mascota extends Model {
    declare id_mascota: number; 
    declare nombre: string;     
    declare tipo: string;       
    declare raza?: string;      
    declare cliente_id: number; 
}

Mascota.init(
    {
        id_mascota: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nombre: {
            type: DataTypes.STRING(100),
            allowNull: false, 
        },
        tipo: {
            type: DataTypes.STRING(20),
            allowNull: false, 
        },
        raza: {
            type: DataTypes.STRING(50),
            allowNull: true, 
        }
    },
    
    {
        sequelize,
        modelName: 'Mascota',
        tableName: 'mascotas',
        timestamps: false, 
    }
);

export default Mascota;