import { Fragment, useEffect, useState } from 'react';
import { api } from '../services/api';
import type { Articulo, Cliente, DetalleVentaItem, Venta } from '../types/models';

interface DetalleConArticulo extends DetalleVentaItem {
    Articulo?: {
        id?: number;
        id_articulo?: number;
        nombre: string;
    };
}

interface VentaConDetalles extends Venta {
    detalles?: DetalleConArticulo[];
    items?: DetalleConArticulo[];
}

export function VentasPage() {
    const [ventas, setVentas] = useState<VentaConDetalles[]>([]);
    const [articulos, setArticulos] = useState<Articulo[]>([]);
    const [clientes, setClientes] = useState<Cliente[]>([]);

    const [clienteId, setClienteId] = useState('');
    const [articuloSeleccionado, setArticuloSeleccionado] = useState('');
    const [cantidad, setCantidad] = useState('1');
    const [itemsCarrito, setItemsCarrito] = useState<DetalleVentaItem[]>([]);
    const [ventaExpandidaId, setVentaExpandidaId] = useState<number | null>(null);

    const [cargando, setCargando] = useState(false);
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [mensajeExito, setMensajeExito] = useState<string | null>(null);

    const obtenerIdArticulo = (a: Articulo): number => Number(a.id_articulo ?? a.id ?? 0);

    const cargarDatos = async () => {
        try {
            setCargando(true);
            const [ventasData, articulosData, clientesData] = await Promise.all([
                api.get<VentaConDetalles[]>('/ventas'),
                api.get<Articulo[]>('/articulos'),
                api.get<Cliente[]>('/clientes'),
            ]);
            setVentas(ventasData);
            setArticulos(articulosData);
            setClientes(clientesData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar los datos de ventas');
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    const limpiarMensajes = () => {
        setError(null);
        setMensajeExito(null);
    };

    const agregarItemDesdeBuscador = () => {
        limpiarMensajes();
        const idArt = Number(articuloSeleccionado);
        const cant = Number(cantidad);
        const art = articulos.find((a) => obtenerIdArticulo(a) === idArt);

        if (!art || !Number.isInteger(cant) || cant <= 0) {
            setError('Seleccioná un artículo válido y una cantidad entera mayor a 0.');
            return;
        }

        const yaEnCarrito = itemsCarrito.find((item) => item.id_articulo === idArt);
        const cantidadAcumulada = (yaEnCarrito?.cant_articulo ?? 0) + cant;

        if (cantidadAcumulada > art.stock) {
            setError(
                `Stock insuficiente para "${art.nombre}". Stock disponible: ${art.stock} un. (Ya tenés ${yaEnCarrito?.cant_articulo ?? 0} en el carrito)`
            );
            return;
        }

        if (yaEnCarrito) {
            setItemsCarrito((prev) =>
                prev.map((item) =>
                    item.id_articulo === idArt
                        ? { ...item, cant_articulo: cantidadAcumulada }
                        : item
                )
            );
        } else {
            setItemsCarrito((prev) => [
                ...prev,
                {
                    id_articulo: idArt,
                    cant_articulo: cant,
                    precio_unidad: Number(art.precio_unitario),
                    nombre: art.nombre,
                },
            ]);
        }

        setArticuloSeleccionado('');
        setCantidad('1');
    };

    const incrementarCantidad = (idArticulo: number) => {
        limpiarMensajes();
        const art = articulos.find((a) => obtenerIdArticulo(a) === idArticulo);
        const itemActual = itemsCarrito.find((item) => item.id_articulo === idArticulo);

        if (!itemActual) return;

        if (art && itemActual.cant_articulo + 1 > art.stock) {
            setError(`Stock máximo alcanzado para "${itemActual.nombre}" (${art.stock} un. disponibles).`);
            return;
        }

        setItemsCarrito((prev) =>
            prev.map((item) =>
                item.id_articulo === idArticulo
                    ? { ...item, cant_articulo: item.cant_articulo + 1 }
                    : item
            )
        );
    };

    const restarCantidad = (idArticulo: number) => {
        limpiarMensajes();
        setItemsCarrito((prev) =>
            prev
                .map((item) =>
                    item.id_articulo === idArticulo
                        ? { ...item, cant_articulo: item.cant_articulo - 1 }
                        : item
                )
                .filter((item) => item.cant_articulo > 0)
        );
    };

    const quitarItem = (idArticulo: number) => {
        limpiarMensajes();
        setItemsCarrito((prev) => prev.filter((item) => item.id_articulo !== idArticulo));
    };

    const montoTotal = itemsCarrito.reduce(
        (acc, item) => acc + item.cant_articulo * item.precio_unidad,
        0
    );

    const handleRegistrarVenta = async (e: React.FormEvent) => {
        e.preventDefault();
        limpiarMensajes();

        if (!clienteId) {
            setError('Seleccioná un cliente para la venta.');
            return;
        }

        if (itemsCarrito.length === 0) {
            setError('Agregá al menos un artículo al carrito de compras.');
            return;
        }

        
        const payload = {
            id_cliente: Number(clienteId),
            fecha_venta: new Date().toISOString().slice(0, 10),
            monto_total: Number(montoTotal.toFixed(2)),
            items: itemsCarrito.map((item) => ({
                id_articulo: item.id_articulo,
                cant_articulo: item.cant_articulo,
                precio_unidad: Number(item.precio_unidad),
            })),
        };

        try {
            setGuardando(true);
            await api.post('/ventas', payload);
            setItemsCarrito([]);
            setClienteId('');
            setMensajeExito('¡Venta registrada con éxito!');
            await cargarDatos();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al registrar la venta');
        } finally {
            setGuardando(false);
        }
    };

    const handleEliminarVenta = async (idVenta?: number) => {
        if (!idVenta || !confirm(`¿Estás seguro de anular la venta #${idVenta}? Se restituirá el stock de los artículos.`)) {
            return;
        }
        limpiarMensajes();

        try {
            setGuardando(true);
            await api.delete(`/ventas/${idVenta}`);
            if (ventaExpandidaId === idVenta) {
                setVentaExpandidaId(null);
            }
            setMensajeExito(`Venta #${idVenta} anulada y stock restituido con éxito.`);
            await cargarDatos();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al anular la venta');
        } finally {
            setGuardando(false);
        }
    };

    const toggleDetalleVenta = (idVenta?: number) => {
        if (!idVenta) return;
        setVentaExpandidaId((prev) => (prev === idVenta ? null : idVenta));
    };

    const obtenerNombreArticulo = (det: DetalleConArticulo) => {
        if (det.Articulo?.nombre) return det.Articulo.nombre;
        if (det.nombre) return det.nombre;
        const encontrado = articulos.find(
            (a) => obtenerIdArticulo(a) === Number(det.id_articulo)
        );
        return encontrado ? encontrado.nombre : `Artículo #${det.id_articulo}`;
    };

    const obtenerNombreCliente = (id: number) => {
        const c = clientes.find((cl) => Number(cl.id_cliente) === Number(id));
        return c ? c.nombre : `Cliente #${id}`;
    };

    return (
        <div>
            <div className="page-header">
                <h1>Ventas y Facturación</h1>
                <p>Registro de ventas con descuento y restitución automática de stock en inventario</p>
            </div>

            {error && <div className="alert-error">{error}</div>}
            {mensajeExito && <div className="alert-success">{mensajeExito}</div>}

            <div className="card">
                <h3>Nueva Venta</h3>
                <form onSubmit={handleRegistrarVenta}>
                    <div className="form-grid" style={{ marginBottom: '1rem' }}>
                        <div className="form-group">
                            <label>Cliente</label>
                            <select
                                value={clienteId}
                                onChange={(e) => {
                                    limpiarMensajes();
                                    setClienteId(e.target.value);
                                }}
                                disabled={guardando}
                            >
                                <option value="">Seleccionar cliente...</option>
                                {clientes.map((c) => (
                                    <option key={c.id_cliente} value={c.id_cliente}>
                                        #{c.id_cliente} - {c.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Artículo</label>
                            <select
                                value={articuloSeleccionado}
                                onChange={(e) => {
                                    limpiarMensajes();
                                    setArticuloSeleccionado(e.target.value);
                                }}
                                disabled={guardando}
                            >
                                <option value="">Seleccionar artículo...</option>
                                {articulos.map((a) => {
                                    const id = obtenerIdArticulo(a);
                                    const yaEnCarrito = itemsCarrito.find(
                                        (item) => item.id_articulo === id
                                    );
                                    const cantEnCarrito = yaEnCarrito?.cant_articulo ?? 0;
                                    const stockDisponibleReal = a.stock - cantEnCarrito;
                                    const agotado = stockDisponibleReal <= 0;

                                    return (
                                        <option key={id} value={id} disabled={agotado}>
                                            {a.nombre} {a.categoria ? `[${a.categoria}]` : ''} - $
                                            {Number(a.precio_unitario).toFixed(2)} (Disp:{' '}
                                            {stockDisponibleReal} un.{cantEnCarrito > 0 ? ` - ${cantEnCarrito} en carrito` : ''})
                                        </option>
                                    );
                                })}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Cantidad</label>
                            <input
                                type="number"
                                min="1"
                                step="1"
                                value={cantidad}
                                onChange={(e) => {
                                    limpiarMensajes();
                                    setCantidad(e.target.value);
                                }}
                                disabled={guardando}
                            />
                        </div>

                        <div className="form-actions">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={agregarItemDesdeBuscador}
                                disabled={guardando || !articuloSeleccionado}
                            >
                                + Agregar al carrito
                            </button>
                        </div>
                    </div>

                    {itemsCarrito.length > 0 && (
                        <div className="table-wrapper" style={{ marginBottom: '1rem' }}>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Artículo</th>
                                        <th>Cantidad</th>
                                        <th>Precio Unit.</th>
                                        <th>Subtotal</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {itemsCarrito.map((item) => (
                                        <tr key={item.id_articulo}>
                                            <td>{item.nombre}</td>
                                            <td>
                                                <strong>{item.cant_articulo} un.</strong>
                                            </td>
                                            <td>${Number(item.precio_unidad).toFixed(2)}</td>
                                            <td>${(item.cant_articulo * item.precio_unidad).toFixed(2)}</td>
                                            <td className="actions-cell">
                                                <button
                                                    type="button"
                                                    className="btn btn-primary"
                                                    onClick={() => incrementarCantidad(item.id_articulo)}
                                                    disabled={guardando}
                                                    aria-label={`Sumar una unidad de ${item.nombre}`}
                                                >
                                                    +
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-warning"
                                                    onClick={() => restarCantidad(item.id_articulo)}
                                                    disabled={guardando}
                                                    aria-label={`Restar una unidad de ${item.nombre}`}
                                                >
                                                    −
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-danger"
                                                    onClick={() => quitarItem(item.id_articulo)}
                                                    disabled={guardando}
                                                >
                                                    Quitar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong>Total Venta: ${montoTotal.toFixed(2)}</strong>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={guardando || itemsCarrito.length === 0 || !clienteId}
                        >
                            {guardando ? 'Procesando venta...' : 'Confirmar Venta'}
                        </button>
                    </div>
                </form>
            </div>

            <div className="card table-wrapper">
                <h3>Historial de Ventas</h3>
                {cargando && ventas.length === 0 ? (
                    <p style={{ color: '#6b7280' }}>Cargando ventas...</p>
                ) : ventas.length === 0 ? (
                    <p style={{ color: '#6b7280' }}>No hay ventas registradas aún.</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>ID Venta</th>
                                <th>Fecha</th>
                                <th>Cliente</th>
                                <th>Monto Total</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ventas.map((v) => {
                                const estaExpandida = ventaExpandidaId === v.id_venta;
                                const listaDetalles = v.detalles ?? v.items ?? [];

                                return (
                                    <Fragment key={v.id_venta}>
                                        <tr>
                                            <td>#{v.id_venta}</td>
                                            <td>{String(v.fecha_venta).split('T')[0]}</td>
                                            <td>{obtenerNombreCliente(v.id_cliente)}</td>
                                            <td>${Number(v.monto_total).toFixed(2)}</td>
                                            <td className="actions-cell">
                                                <button
                                                    type="button"
                                                    className="btn btn-secondary"
                                                    onClick={() => toggleDetalleVenta(v.id_venta)}
                                                >
                                                    {estaExpandida ? 'Ocultar compra' : 'Ver compra'}
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-danger"
                                                    onClick={() => handleEliminarVenta(v.id_venta)}
                                                    disabled={guardando}
                                                >
                                                    Eliminar venta
                                                </button>
                                            </td>
                                        </tr>

                                        {estaExpandida && (
                                            <tr>
                                                <td
                                                    colSpan={5}
                                                    style={{ backgroundColor: '#f9fafb', padding: '1rem' }}
                                                >
                                                    <strong>
                                                        Detalle de artículos comprados (Venta #{v.id_venta}):
                                                    </strong>
                                                    {listaDetalles.length === 0 ? (
                                                        <p style={{ marginTop: '0.5rem', color: '#6b7280' }}>
                                                            Esta venta no tiene artículos asociados en la respuesta.
                                                        </p>
                                                    ) : (
                                                        <table
                                                            style={{
                                                                marginTop: '0.6rem',
                                                                backgroundColor: '#ffffff',
                                                            }}
                                                        >
                                                            <thead>
                                                                <tr>
                                                                    <th>Artículo</th>
                                                                    <th>Cantidad</th>
                                                                    <th>Precio Unitario</th>
                                                                    <th>Subtotal</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {listaDetalles.map((det, idx) => (
                                                                    <tr
                                                                        key={
                                                                            det.id_detalle ??
                                                                            `${det.id_articulo}-${idx}`
                                                                        }
                                                                    >
                                                                        <td>{obtenerNombreArticulo(det)}</td>
                                                                        <td>{det.cant_articulo} un.</td>
                                                                        <td>
                                                                            ${Number(det.precio_unidad).toFixed(2)}
                                                                        </td>
                                                                        <td>
                                                                            $
                                                                            {(
                                                                                det.cant_articulo *
                                                                                Number(det.precio_unidad)
                                                                            ).toFixed(2)}
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    )}
                                                </td>
                                            </tr>
                                        )}
                                    </Fragment>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
