import Turno from '../models/turnos.modelo';
import { Request, Response } from 'express';

// Obtener todos los turnos
export const getTurnos = async (req: Request, res: Response) => {
    try {
        const turnos = await Turno.findAll();
        res.status(200).json(turnos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los turnos', error });
    }
} 

//Filtrar por id
export const getTurnoPorId = async (req: Request, res: Response) => {
    try {
        const { id_turno } = req.params;
        const idParseado = parseInt(id_turno as string, 10);

        const turno = await Turno.findByPk(idParseado);
        if (!turno) {
            return res.status(404).json({ message: 'Turno no encontrado' });
        }
        res.status(200).json(turno);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el turno', error });
    }
} 

// Crear turno
export const postTurno = async (req: Request, res: Response) => {
    try {
        const { fecha, horario, descripcion, monto, estado, mascota_id } = req.body;
        const nuevoTurno = await Turno.create({
            fecha,
            horario,
            descripcion,
            monto,
            estado,
            mascota_id
        });
        res.status(201).json(nuevoTurno);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el turno', error });
    }
}

// Actualizar turno
export const putTurno = async (req: Request, res: Response) => {
    try {
        const { id_turno } = req.params;
        const idParseado = parseInt(id_turno as string, 10);

        const { fecha, horario, descripcion, monto, estado, mascota_id } = req.body;

        const turno = await Turno.findByPk(idParseado);
        if (!turno) {
            return res.status(404).json({ message: 'Turno no encontrado' });
        }
        await turno.update({
            fecha,
            horario,
            descripcion,
            monto,
            estado,
            mascota_id
        });
        res.status(200).json(turno);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el turno', error });
    }
}

// Eliminar turno
export const deleteTurno = async (req: Request, res: Response) => {
    try {
        const { id_turno } = req.params;
        const idParseado = parseInt(id_turno as string, 10);

        const turno = await Turno.findByPk(idParseado);
        if (!turno) {
            return res.status(404).json({ message: 'Turno no encontrado' });
        }
        await turno.destroy();
        res.status(200).json({ message: 'Turno eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el turno', error });
    }
};