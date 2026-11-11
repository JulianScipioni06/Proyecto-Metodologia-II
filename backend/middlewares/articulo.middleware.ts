import { Request, Response, NextFunction } from 'express';

const validateInputArticulo = (req: Request, res: Response, next: NextFunction) => {
    const { nombre, stock, precio_unitario } = req.body;
    const errores: string[] = [];

    // 1. Validación del nombre
    if (!nombre) {
        errores.push('El nombre es obligatorio.');
    } else if (typeof nombre !== 'string') {
        errores.push('El nombre debe ser un texto válido.');
    }

    // 2. Validación del stock
    if (stock === undefined || stock === null) {
        errores.push('El stock es obligatorio.');
    } else if (typeof stock !== 'number') {
        errores.push('El stock debe ser un numero.');
    }

    // 3. Validación del precio_unitario
    if (precio_unitario === undefined || precio_unitario === null) {
        errores.push('El precio_unitario es obligatorio.');
    } else if (typeof precio_unitario !== 'number') {
        errores.push('El precio_unitario debe ser un numero.');
    }

    if (errores.length > 0) {
        return res.status(400).json({ errores });
    }

    next();
}

export default validateInputArticulo;