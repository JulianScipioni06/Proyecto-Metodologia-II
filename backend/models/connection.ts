import { Sequelize, Options } from 'sequelize';
import configJson from '../config/database.config';

const env = (process.env.NODE_ENV || 'development') as keyof typeof configJson;
const config = configJson[env];

const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config as Options
);

export default sequelize;
