import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import { errorHandlerGlobal } from '../../middlewares/errorHandler';

describe('Middleware: errorHandlerGlobal', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = {};
        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn().mockReturnThis(),
        };
        next = vi.fn();
        // Silenciamos console.error en el test para mantener limpia la terminal
        vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    it('debe responder 500 con el mensaje de la instancia Error', () => {
        const errorSimulado = new Error(
            'Fallo de conexión con la base de datos'
        );

        errorHandlerGlobal(
            errorSimulado,
            req as Request,
            res as Response,
            next
        );

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            msg: 'Ocurrió un error interno en el servidor. Hable con el administrador.',
            error: 'Fallo de conexión con la base de datos',
        });
    });

    it('debe responder 500 convirtiendo a string si el error lanzado no es instancia de Error', () => {
        const errorTexto = 'Error inesperado en formato string';

        errorHandlerGlobal(errorTexto, req as Request, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            msg: 'Ocurrió un error interno en el servidor. Hable con el administrador.',
            error: 'Error inesperado en formato string',
        });
    });
});
