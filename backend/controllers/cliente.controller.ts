import { Request, Response } from 'express';
const Cliente = require('../models/cliente');

export const getClientes = async (req: Request, res: Response) => {
    try {
        const clientes = await Cliente.findAll();
        res.json(clientes);
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener los clientes', error });
    }
};

export const getCliente = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const cliente = await Cliente.findByPk(id);
        if (cliente) {
            res.json(cliente);
        } else {
            res.status(404).json({ msg: `No existe un cliente con el id ${id}` });
        }
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener el cliente', error });
    }
};

export const postCliente = async (req: Request, res: Response) => {
    const { body } = req; 
    try {
        const cliente = await Cliente.create(body);
        res.status(201).json(cliente);
    } catch (error) {
        res.status(500).json({ msg: 'Error al crear el cliente', error });
    }
};

export const putCliente = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { body } = req;
    try {
        const cliente = await Cliente.findByPk(id);
        if (!cliente) {
            return res.status(404).json({ msg: `No existe un cliente con el id ${id}` });
        }

        await cliente.update(body);
        res.json(cliente);
    } catch (error) {
        res.status(500).json({ msg: 'Error al actualizar el cliente', error });
    }
};

export const deleteCliente = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const cliente = await Cliente.findByPk(id);
        if (!cliente) {
            return res.status(404).json({ msg: `No existe un cliente con el id ${id}` });
        }

        await cliente.destroy();
        res.json({ msg: 'Cliente eliminado correctamente', cliente });
    } catch (error) {
        res.status(500).json({ msg: 'Error al eliminar el cliente', error });
    }
};