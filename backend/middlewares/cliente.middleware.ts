import { Request, Response, NextFunction } from 'express';

const validateInputCliente = (req: Request, res: Response, next: NextFunction) => {
    const { nombre, telefono, direccion } = req.body;
    const errores: string[] = [];

    // 1. Validación del nombre
    if (!nombre) {
        errores.push('El nombre es obligatorio.');
    } else if (typeof nombre !== 'string') {
        errores.push('El nombre debe ser un texto válido.');
    }

    // 2. Validación del telefono
    if (!telefono) {
        errores.push('El telefono es obligatorio.');
    } else if (typeof telefono !== 'number') {
        errores.push('El telefono debe ser un numero.');
    }

    // 3. Validación de la direccion
    if (!direccion) {
        errores.push('La direccion es obligatorio.');
    } else if (typeof direccion !== 'string') {
        errores.push('La direccion debe ser un texto valido.');
    }

    if (errores.length > 0) {
        return res.status(400).json({ errores });
    }

    next();
}

export default validateInputCliente;