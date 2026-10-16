import 'dotenv/config';

const esNube = process.env.PGHOST && process.env.PGHOST !== 'localhost';

const dbConfig = {
    development: {
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'admin',
        database: process.env.DB_NAME || 'veterinaria_db',
        host: process.env.DB_HOST || 'localhost',
        port: 5432,
        dialect: 'postgres',
        logging: false,
        pool: {
            max: 7,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        dialectOptions: esNube ? {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        } : {}
    }
};

export default dbConfig;