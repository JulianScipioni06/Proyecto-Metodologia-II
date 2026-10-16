import { Sequelize } from 'sequelize';
import configJson from '../config/database.config'; 

const env = process.env.NODE_ENV || 'development';
const config = (configJson as any)[env];

const sequelize = new Sequelize(
    config.database, 
    config.username, 
    config.password, 
    config
);

export default sequelize;