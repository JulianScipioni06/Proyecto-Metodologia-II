import { Request, Response } from 'express';
import Articulo from '../models/articulos.model';

export const getArticulos = async (req: Request, res: Response) => {
    try {
        const articulos = await Articulo.findAll();
        res.status(200).json(articulos);
    } catch (error) {
        res.status(500).json({mensaje: 'Error al obtener los artículos', error});
    }
};

export const getArticuloById = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const idParseado = parseInt(id as string, 10);

        const articulo = await Articulo.findByPk(idParseado);

        if (!articulo) {
            return res.status(404).json({mensaje: 'Artículo no encontrado'});
        }
        res.status(200).json(articulo);
    } catch (error) {
        res.status(500).json({mensaje: 'Error al buscar el artículo', error});
    }
};

export const postArticulo = async (req: Request, res: Response) => {
    try {
        const nuevoArticulo = await Articulo.create(req.body);
        res.status(201).json(nuevoArticulo);
    } catch (error) {
        res.status(500).json({mensaje: 'Error al crear el artículo', error});
    }
};

export const putArticulo = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const idParseado = parseInt(id as string, 10);
        
        const articulo = await Articulo.findByPk(idParseado);
        if (!articulo) {
            return res.status(404).json({mensaje: 'Artículo no encontrado para actualizar'});
        }
        await articulo.update(req.body);
        
        res.status(200).json({mensaje: 'Artículo actualizado correctamente', articulo});
    } catch (error) {
        res.status(500).json({mensaje: 'Error al actualizar el artículo', error});
    }
};

export const deleteArticulo = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const idParseado = parseInt(id as string, 10);

        const articulo = await Articulo.findByPk(idParseado);
        if (!articulo) {
            return res.status(404).json({mensaje: 'Artículo no encontrado para eliminar'});
        }

        await articulo.destroy();
        
        res.status(200).json({mensaje: 'Artículo eliminado correctamente'});
    } catch (error) {
        res.status(500).json({mensaje: 'Error al eliminar el artículo', error});
    }
};