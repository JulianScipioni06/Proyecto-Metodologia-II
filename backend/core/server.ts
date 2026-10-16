import express, { type Application, type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import 'dotenv/config'; 
import db from '../models/index';
import clientesRoutes from '../routes/clientes.route';
import articulosRoutes from '../routes/articulos.route'; 
import mascotasRoutes from '../routes/mascotas.route'; 
import turnosRoutes from '../routes/turnos.route'; 
import ventasRoutes from '../routes/venta.routes';

class Server {
    public app: Application;
    public port: string | number;

    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000;
        this.connectToDataBase();
        this.middleware();
        this.rutas();
        // this.errorHandlerGlobal();
    }

    middleware() {
        this.app.use(cors());
        this.app.use(express.json());
    }

    rutas() {
        this.app.use('/api/clientes', clientesRoutes);
        this.app.use('/api/articulos', articulosRoutes);
        this.app.use('/api/mascotas', mascotasRoutes);
        this.app.use('/api/turnos', turnosRoutes);
        this.app.use('/api/ventas', ventasRoutes);
    }
    
    // errorHandlerGlobal() { ... }

    async connectToDataBase() {
        try {
            // Sequelize ya viene inicializado desde models/index.ts
            await db.sequelize.sync({ alter: false });
            console.log('Database sincronizada correctamente con Neon');
        } catch (error) {
            console.error('Error en la conexión a la DB: ', error);
        }
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`La API esta escuchando en el puerto: ${this.port}`);
        });
    }
}

export default Server; 