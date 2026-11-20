import { Request, Response, NextFunction } from 'express';

export const errorHandlerGlobal = (
    err: unknown,
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    const errorMessage = err instanceof Error ? err.message : String(err);

    console.error(`[Error catch] ${errorMessage}`);

    res.status(500).json({
        msg: 'Ocurrió un error interno en el servidor. Hable con el administrador.',
        error: errorMessage,
    });
};
