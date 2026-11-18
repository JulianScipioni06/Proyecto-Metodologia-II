import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import validateInputVenta from '../../middlewares/venta.middleware';

describe('Middleware: validateInputVenta', () => {
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
            fecha_venta: '2026-11-18',
            monto_total: 45000,
            id_cliente: 3,
        };

        validateInputVenta(req as Request, res as Response, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
    });

    // 2. CASOS LÍMITE
    it('debe permitir valores de borde válidos como monto_total en 0 y campos extra opcionales', () => {
        req.body = {
            fecha_venta: '2026-11-18',
            monto_total: 0, // Caso borde válido (no es falsy para !== undefined/null)
            id_cliente: 1,
            detalles: [], // Campo opcional extra no validado por este middleware
        };

        validateInputVenta(req as Request, res as Response, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
    });

    // 3. CASOS DE ERROR
    it('debe devolver 400 con todos los mensajes si faltan los campos obligatorios', () => {
        req.body = {};

        validateInputVenta(req as Request, res as Response, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            errores: [
                'La fecha es obligatoria.',
                'El monto_total es obligatorio.',
                'El id_cliente es obligatorio.',
            ],
        });
    });

    it('debe devolver 400 si la fecha es inválida y los campos numéricos tienen tipos incorrectos', () => {
        req.body = {
            fecha_venta: 'fecha-invalida',
            monto_total: 'cuarenta-mil',
            id_cliente: 'tres',
        };

        validateInputVenta(req as Request, res as Response, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            errores: [
                'La fecha debe ser válida y tener un formato reconocido (ejemplo: AAAA-MM-DD).',
                'El monto_total debe ser un numero.',
                'El id_cliente debe ser un numero.',
            ],
        });
    });

    it('debe devolver 400 si monto_total o id_cliente son null', () => {
        req.body = {
            fecha_venta: '2026-11-18',
            monto_total: null,
            id_cliente: null,
        };

        validateInputVenta(req as Request, res as Response, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            errores: [
                'El monto_total es obligatorio.',
                'El id_cliente es obligatorio.',
            ],
        });
    });
});
