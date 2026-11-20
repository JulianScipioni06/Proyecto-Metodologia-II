export type SeccionActiva = 'clientes' | 'mascotas' | 'turnos' | 'articulos' | 'ventas';

export interface Cliente {
    id_cliente?: number;
    nombre: string;
    telefono: number | string;
    direccion?: string;
    Direccion?: string;
}
export interface Mascota {
    id_mascota?: number;
    nombre: string;
    tipo: string;
    raza: string;
    cliente_id?: number;
}

export interface Turno {
    id_turno?: number;
    fecha: string;
    horario: string;
    descripcion: string;
    monto: number;
    estado: string;
    mascota_id: number;
}

export interface Articulo {
    id?: number;
    id_articulo?: number;
    nombre: string;
    categoria?: string;
    stock: number;
    precio_unitario: number;
}

export interface DetalleVentaItem {
    id_detalle?:number;
    id_articulo: number;
    cant_articulo: number;
    precio_unidad: number;
    nombre?: string;
}

export interface Venta {
    id_venta?: number;
    fecha_venta: string;
    monto_total: number;
    id_cliente: number;
    detalles?: DetalleVentaItem[];
    items?: DetalleVentaItem[];
}