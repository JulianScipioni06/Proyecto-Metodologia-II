import { useEffect, useState } from 'react';
import { api } from '../services/api';
import type { Cliente, Mascota } from '../types/models';

export function MascotasPage() {
    const [mascotas, setMascotas] = useState<Mascota[]>([]);
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [nombre, setNombre] = useState('');
    const [tipo, setTipo] = useState('');
    const [raza, setRaza] = useState('');
    const [clienteId, setClienteId] = useState('');
    const [editId, setEditId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    const cargarDatos = async () => {
        try {
            const [mascotasData, clientesData] = await Promise.all([
                api.get<Mascota[]>('/mascotas'),
                api.get<Cliente[]>('/clientes'),
            ]);
            setMascotas(mascotasData);
            setClientes(clientesData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar las mascotas');
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    const limpiarFormulario = () => {
        setNombre('');
        setTipo('');
        setRaza('');
        setClienteId('');
        setEditId(null);
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const payload = {
            nombre,
            tipo,
            raza,
            ...(clienteId ? { cliente_id: Number(clienteId) } : {}),
        };

        try {
            if (editId) {
                await api.put(`/mascotas/${editId}`, payload);
            } else {
                await api.post('/mascotas', payload);
            }
            limpiarFormulario();
            cargarDatos();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al guardar la mascota');
        }
    };

    const handleEditar = (mascota: Mascota) => {
        setEditId(mascota.id_mascota ?? null);
        setNombre(mascota.nombre);
        setTipo(mascota.tipo);
        setRaza(mascota.raza);
        setClienteId(mascota.cliente_id ? String(mascota.cliente_id) : '');
    };

    const handleEliminar = async (id?: number) => {
        if (!id || !confirm('¿Eliminar esta mascota?')) return;
        try {
            await api.delete(`/mascotas/${id}`);
            cargarDatos();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al eliminar la mascota');
        }
    };

    const obtenerNombreCliente = (id?: number) => {
        if (!id) return '-';
        const encontrado = clientes.find((c) => c.id_cliente === id);
        return encontrado ? `#${id} - ${encontrado.nombre}` : `#${id}`;
    };

    return (
        <div>
            <div className="page-header">
                <h1>Gestión de Mascotas</h1>
                <p>Registro de pacientes y asignación de dueños</p>
            </div>

            {error && <div className="alert-error">{error}</div>}

            <div className="card">
                <h3>{editId ? `Editando Mascota #${editId}` : 'Nueva Mascota'}</h3>
                <form className="form-grid" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nombre</label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            placeholder="Ej: Toby"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Tipo / Especie</label>
                        <input
                            type="text"
                            value={tipo}
                            onChange={(e) => setTipo(e.target.value)}
                            placeholder="Ej: Perro"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Raza</label>
                        <input
                            type="text"
                            value={raza}
                            onChange={(e) => setRaza(e.target.value)}
                            placeholder="Ej: Labrador"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Dueño (Cliente)</label>
                        <select value={clienteId} onChange={(e) => setClienteId(e.target.value)}>
                            <option value="">Sin asignar / Seleccionar...</option>
                            {clientes.map((c) => (
                                <option key={c.id_cliente} value={c.id_cliente}>
                                    #{c.id_cliente} - {c.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary">
                            {editId ? 'Actualizar' : 'Guardar'}
                        </button>
                        {editId && (
                            <button type="button" className="btn btn-secondary" onClick={limpiarFormulario}>
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div className="card table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Tipo</th>
                            <th>Raza</th>
                            <th>Dueño</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mascotas.map((m) => (
                            <tr key={m.id_mascota}>
                                <td>#{m.id_mascota}</td>
                                <td>{m.nombre}</td>
                                <td>{m.tipo}</td>
                                <td>{m.raza}</td>
                                <td>{obtenerNombreCliente(m.cliente_id)}</td>
                                <td className="actions-cell">
                                    <button type="button" className="btn btn-warning" onClick={() => handleEditar(m)}>
                                        Editar
                                    </button>
                                    <button type="button" className="btn btn-danger" onClick={() => handleEliminar(m.id_mascota)}>
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}