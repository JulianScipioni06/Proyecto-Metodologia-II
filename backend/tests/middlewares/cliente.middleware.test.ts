import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import validateInputCliente from '../../middlewares/cliente.middleware';

describe('Middleware: validateInputCliente', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = { body: {} };
        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn().mockReturnThis(),
        };
        next = vi.fn();
    });

    // 1. CASO NORMAL
    it('debe llamar a next() cuando todos los campos obligatorios son válidos', () => {
        req.body = {
            nombre: 'Julián Scipioni',
            telefono: 2914123456,
            direccion: 'Zelarrayán 1234',
        };

        validateInputCliente(req as Request, res as Response, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
    });

    // 2. CASOS LÍMITE
    it('debe permitir valores mínimos válidos y campos adicionales opcionales', () => {
        req.body = {
            nombre: 'A',
            telefono: 1,
            direccion: 'B',
            email: '', // Campo opcional extra no requerido por el middleware
        };

        validateInputCliente(req as Request, res as Response, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
    });

    // 3. CASOS DE ERROR
    it('debe devolver 400 con todos los mensajes si faltan los campos obligatorios', () => {
        req.body = {};

        validateInputCliente(req as Request, res as Response, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            errores: [
                'El nombre es obligatorio.',
                'El telefono es obligatorio.',
                'La direccion es obligatorio.',
            ],
        });
    });

    it('debe devolver 400 si los campos tienen tipos de dato incorrectos', () => {
        req.body = {
            nombre: 12345,
            telefono: '2914123456', // String en lugar de number
            direccion: 98765,
        };

        validateInputCliente(req as Request, res as Response, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            errores: [
                'El nombre debe ser un texto válido.',
                'El telefono debe ser un numero.',
                'La direccion debe ser un texto valido.',
            ],
        });
    });

    it('debe devolver 400 si se envían strings vacíos o null', () => {
        req.body = {
            nombre: '',
            telefono: null,
            direccion: '',
        };

        validateInputCliente(req as Request, res as Response, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            errores: [
                'El nombre es obligatorio.',
                'El telefono es obligatorio.',
                'La direccion es obligatorio.',
            ],
        });
    });
});
