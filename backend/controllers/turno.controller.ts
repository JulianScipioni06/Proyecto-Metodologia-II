const Turno = require('../models/turno.model');
const { request, response } = require('express');

// Obtener todos los turnos
export const getTurnos = async (req: typeof request, res: typeof response) => {
    try {
        const turnos = await Turno.findAll();
        res.status(200).json(turnos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los turnos', error });
    }
} 

//Filtrar por id
export const getTurnoPorId = async (req: typeof request, res: typeof response) => {
    try {
        const { id_turno } = req.params;
        const turno = await Turno.findByPk(id_turno);
        if (!turno) {
            return res.status(404).json({ message: 'Turno no encontrado' });
        }
        res.status(200).json(turno);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el turno', error });
    }
} 

// Crear turno
export const postTurno = async (req: typeof request, res: typeof response) => {
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
export const putTurno = async (req: typeof request, res: typeof response) => {
    try {
        const { id_turno } = req.params;
        const { fecha, horario, descripcion, monto, estado, mascota_id } = req.body;
        const turno = await Turno.findByPk(id_turno);
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
export const deleteTurno = async (req: typeof request, res: typeof response) => {
    try {
        const { id_turno } = req.params;
        const turno = await Turno.findByPk(id_turno);
        if (!turno) {
            return res.status(404).json({ message: 'Turno no encontrado' });
        }
        await turno.destroy();
        res.status(200).json({ message: 'Turno eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el turno', error });
    }
};