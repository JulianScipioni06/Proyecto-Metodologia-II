import {Request, Response} from 'express';
const Mascota = require('./mascota.model');

//obtener todas las mascotas - get
export const obtenerMascotas = async (req: Request, res: Response) => {
    try {
        const mascotas = await Mascota.findAll();
        res.status(200).json(mascotas);
    } catch (error) {
        res.status(500).json({mensaje: 'Error al obtener las mascotas', error});
    }
};

//obtener una mascota por id - get
export const obtenerMascotaPorId = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;

        const mascota = await Mascota.findByPk(id);

        if (!mascota) {
            return res.status(404).json({mensaje: 'Mascota no encontrada'});
        }
        res.status(200).json(mascota);
    } catch (error) {
        res.status(500).json({mensaje: 'Error al buscar la mascota', error});
    }
};

//crear mascotas - post
export const crearMascota = async (req: Request, res: Response) => {
    try {
        const nuevaMascota = await Mascota.create(req.body);
        res.status(201).json(nuevaMascota);
    } catch (error) {
        res.status(500).json({mensaje: 'Error al crear la mascota', error});
    }
};

//actualizar mascota - put
export const actualizarMascota = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;

        const mascota = await Mascota.findByPk(id);
        if (!mascota) {
            return res.status(404).json({mensaje: 'Mascota no encontrada para actualizar'});
        }

        await mascota.update(req.body);
        
        res.status(200).json({mensaje: 'Mascota actualizada correctamente', mascota});
    } catch (error) {
        res.status(500).json({mensaje: 'Error al actualizar la mascota', error});
    }
};

//eliminar mascota - delete
export const eliminarMascota = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;

        const mascota = await Mascota.findByPk(id);
        if (!mascota) {
            return res.status(404).json({mensaje: 'Mascota no encontrada para eliminar'});
        }

        await mascota.destroy();
        
        res.status(200).json({mensaje: 'Mascota eliminada correctamente'});
    } catch (error) {
        res.status(500).json({mensaje: 'Error al eliminar la mascota', error});
    }
};