import { Request, Response, NextFunction } from 'express';

const validateInputMascota = (req: Request, res: Response, next: NextFunction) => {
    const { nombre, tipo, raza } = req.body;
    const errores: string[] = [];

    // 1. Validación del nombre
    if (!nombre) {
        errores.push('El nombre es obligatorio.');
    } else if (typeof nombre !== 'string') {
        errores.push('El nombre debe ser un texto válido.');
    }

    // 2. Validación del tipo
    if (!tipo) {
        errores.push('El tipo es obligatorio.');
    } else if (typeof tipo !== 'string') {
        errores.push('El tipo debe ser un formato de texto válido.');
    }

    // 3. Validación de la raza
    if (!raza) {
        errores.push('La raza es obligatoria.');
    } else if (typeof raza !== 'string') {
        errores.push('La raza debe ser un texto válido.');
    }

    if (errores.length > 0) {
        return res.status(400).json({ errores });
    }

    next();
}

export default validateInputMascota;