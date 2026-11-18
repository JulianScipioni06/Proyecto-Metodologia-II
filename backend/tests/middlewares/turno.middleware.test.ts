import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import validateInputTurno from '../../middlewares/turno.middleware';

describe('Middleware: validateInputTurno', () => {
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
            fecha: '2026-11-20',
            horario: '10:30',
            descripcion: 'Consulta general y vacunación',
            monto: 15000,
            estado: 'Pendiente',
            mascota_id: 1,
        };

        validateInputTurno(req as Request, res as Response, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
    });

    // 2. CASOS LÍMITE
    it('debe permitir valores de borde válidos como descripcion vacía y monto en 0', () => {
        req.body = {
            fecha: '2026-11-20',
            horario: '14:00',
            descripcion: '', // String vacío válido
            monto: 0, // Número en 0 válido
            estado: 'Confirmado',
            mascota_id: 1,
        };

        validateInputTurno(req as Request, res as Response, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
    });

    // 3. CASOS DE ERROR
    it('debe devolver 400 con todos los mensajes si faltan los campos obligatorios o tienen tipos inválidos por ausencia', () => {
        req.body = {};

        validateInputTurno(req as Request, res as Response, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            errores: [
                'La fecha es obligatoria.',
                'El horario es obligatorio.',
                'La descripcion debe ser un formato de texto valido..',
                'El monto debe ser un numero.',
                'El estado es obligatorio.',
                'El mascota_id es obligatorio.',
            ],
        });
    });

    it('debe devolver 400 si la fecha tiene un formato inválido y los demás tipos son incorrectos', () => {
        req.body = {
            fecha: 'fecha-no-valida',
            horario: 1030,
            descripcion: 123,
            monto: 'quince-mil',
            estado: true,
            mascota_id: 'uno',
        };

        validateInputTurno(req as Request, res as Response, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            errores: [
                'La fecha debe ser válida y tener un formato reconocido (ejemplo: AAAA-MM-DD).',
                'El horario debe ser un formato de texto valido.',
                'La descripcion debe ser un formato de texto valido..',
                'El monto debe ser un numero.',
                'El estado debe ser un formato de texto valido.',
                'El mascota_id debe ser un numero.',
            ],
        });
    });
});
