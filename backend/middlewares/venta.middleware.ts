import { Request, Response, NextFunction } from 'express';

const validateInputVenta = (req: Request, res: Response, next: NextFunction) => {
    const { fecha_venta, monto_total, id_cliente } = req.body;
    const errores: string[] = [];

    // 1. Validación de la fecha
    if (!fecha_venta) {
        errores.push('La fecha es obligatoria.');
    } else if (isNaN(Date.parse(fecha_venta))) {
        errores.push('La fecha debe ser válida y tener un formato reconocido (ejemplo: AAAA-MM-DD).');
    }

    // 2. Validación del monto_total
    if (monto_total === undefined || monto_total === null) {
        errores.push('El monto_total es obligatorio.');
    } else if (typeof monto_total !== 'number') {
        errores.push('El monto_total debe ser un numero.');
    }

    // 3. Validación del id_cliente
    if (id_cliente === undefined || id_cliente === null) {
        errores.push('El id_cliente es obligatorio.');
    } else if (typeof id_cliente !== 'number') {
        errores.push('El id_cliente debe ser un numero.');
    }

    if (errores.length > 0) {
        return res.status(400).json({ errores });
    }

    next();
}

export default validateInputVenta;