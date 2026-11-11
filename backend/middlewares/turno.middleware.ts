import { Request, Response, NextFunction } from 'express';

const validateInputTurno = (req: Request, res: Response, next: NextFunction) => {
    const { fecha, horario, descripcion, monto, estado, mascota_id } = req.body;
    const errores: string[] = [];

    // 1. Validación de la fecha
    if (!fecha) {
        errores.push('La fecha es obligatoria.');
    } else if (isNaN(Date.parse(fecha))) {
        errores.push('La fecha debe ser válida y tener un formato reconocido (ejemplo: AAAA-MM-DD).');
    }

    // 2. Validación del horario
    if (!horario) {
        errores.push('El horario es obligatorio.');
    } else if (typeof horario !== 'string') {
        errores.push('El horario debe ser un formato de texto valido.');
    }

    // 3. Validación del descripcion
    if (typeof descripcion !== 'string') {
        errores.push('La descripcion debe ser un formato de texto valido..');
    }

    // 4. Validación del monto
    if (typeof monto !== 'number') {
        errores.push('El monto debe ser un numero.');
    }

    // 5. Validacion del estado
    if (!estado) {
        errores.push('El estado es obligatorio.');
    } else if (typeof estado !== 'string') {
        errores.push('El estado debe ser un formato de texto valido.');
    }

    // 6. Validación del mascota_id
    if (mascota_id === undefined || mascota_id === null) {
        errores.push('El mascota_id es obligatorio.');
    } else if (typeof mascota_id !== 'number') {
        errores.push('El mascota_id debe ser un numero.');
    }

    if (errores.length > 0) {
        return res.status(400).json({ errores });
    }

    next();
}

export default validateInputTurno;