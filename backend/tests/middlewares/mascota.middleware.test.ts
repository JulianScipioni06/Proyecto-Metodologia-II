import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import validateInputMascota from '../../middlewares/mascota.middleware';

describe('Middleware: validateInputMascota', () => {
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
            nombre: 'Toby',
            tipo: 'Perro',
            raza: 'Labrador',
        };

        validateInputMascota(req as Request, res as Response, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
    });

    // 2. CASOS LÍMITE
    it('debe permitir strings mínimos válidos y campos opcionales extra', () => {
        req.body = {
            nombre: 'A',
            tipo: 'B',
            raza: 'C',
            observaciones: '', // Campo opcional extra no requerido por el middleware
            clienteId: 1,
        };

        validateInputMascota(req as Request, res as Response, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
    });

    // 3. CASOS DE ERROR
    it('debe devolver 400 con todos los mensajes si faltan los campos obligatorios', () => {
        req.body = {};

        validateInputMascota(req as Request, res as Response, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            errores: [
                'El nombre es obligatorio.',
                'El tipo es obligatorio.',
                'La raza es obligatoria.',
            ],
        });
    });

    it('debe devolver 400 si los campos tienen tipos de dato incorrectos', () => {
        req.body = {
            nombre: 123,
            tipo: true,
            raza: ['Labrador'],
        };

        validateInputMascota(req as Request, res as Response, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            errores: [
                'El nombre debe ser un texto válido.',
                'El tipo debe ser un formato de texto válido.',
                'La raza debe ser un texto válido.',
            ],
        });
    });

    it('debe devolver 400 si se envían strings vacíos o null', () => {
        req.body = {
            nombre: '',
            tipo: null,
            raza: '',
        };

        validateInputMascota(req as Request, res as Response, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            errores: [
                'El nombre es obligatorio.',
                'El tipo es obligatorio.',
                'La raza es obligatoria.',
            ],
        });
    });
});
