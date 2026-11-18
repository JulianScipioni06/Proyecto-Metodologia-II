import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import validateInputArticulo from '../../middlewares/articulo.middleware';

describe('Middleware: validateInputArticulo', () => {
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
    it('debe llamar a next() cuando todos los campos obligatorios tienen tipos válidos', () => {
        req.body = {
            nombre: 'Alimento Balanceado 15kg',
            stock: 10,
            precio_unitario: 25000,
        };

        validateInputArticulo(req as Request, res as Response, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
    });

    // 2. CASOS LÍMITE
    it('debe permitir valores de borde válidos como stock y precio_unitario en 0, y campos extra opcionales', () => {
        req.body = {
            nombre: 'Correa básica',
            stock: 0,
            precio_unitario: 0,
            descripcion: '', // Campo opcional extra no requerido por el middleware
        };

        validateInputArticulo(req as Request, res as Response, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
    });

    // 3. CASOS DE ERROR
    it('debe devolver 400 con todos los mensajes si faltan los campos obligatorios', () => {
        req.body = {};

        validateInputArticulo(req as Request, res as Response, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            errores: [
                'El nombre es obligatorio.',
                'El stock es obligatorio.',
                'El precio_unitario es obligatorio.',
            ],
        });
    });

    it('debe devolver 400 si los campos tienen tipos de dato incorrectos', () => {
        req.body = {
            nombre: 12345,
            stock: 'diez',
            precio_unitario: '25000',
        };

        validateInputArticulo(req as Request, res as Response, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            errores: [
                'El nombre debe ser un texto válido.',
                'El stock debe ser un numero.',
                'El precio_unitario debe ser un numero.',
            ],
        });
    });

    it('debe devolver 400 si stock o precio_unitario son null', () => {
        req.body = {
            nombre: 'Pipeta antipulgas',
            stock: null,
            precio_unitario: null,
        };

        validateInputArticulo(req as Request, res as Response, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            errores: [
                'El stock es obligatorio.',
                'El precio_unitario es obligatorio.',
            ],
        });
    });
});
