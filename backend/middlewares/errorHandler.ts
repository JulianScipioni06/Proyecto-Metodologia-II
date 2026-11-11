import { Request, Response, NextFunction } from 'express';

export const errorHandlerGlobal = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(`[Error catch] ${err.message || err}`);
    
    res.status(500).json({
        msg: 'Ocurrió un error interno en el servidor. Hable con el administrador.',
        error: err.message || err
    });
};