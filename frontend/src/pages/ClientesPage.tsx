import { useEffect, useState } from 'react';
import { api } from '../services/api';
import type { Cliente } from '../types/models';

export function ClientesPage() {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [nombre, setNombre] = useState('');
    const [telefono, setTelefono] = useState('');
    const [direccion, setDireccion] = useState('');
    const [editId, setEditId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    const cargarClientes = async () => {
        try {
            const data = await api.get<Cliente[]>('/clientes');
            setClientes(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar los clientes');
        }
    };

    useEffect(() => {
        cargarClientes();
    }, []);

    const limpiarFormulario = () => {
        setNombre('');
        setTelefono('');
        setDireccion('');
        setEditId(null);
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const payload = {
            nombre,
            telefono: Number(telefono),
            direccion,
            Direccion: direccion,
        };

        try {
            if (editId) {
                await api.put(`/clientes/${editId}`, payload);
            } else {
                await api.post('/clientes', payload);
            }
            limpiarFormulario();
            cargarClientes();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al guardar el cliente');
        }
    };

    const handleEditar = (cliente: Cliente) => {
        setEditId(cliente.id_cliente ?? null);
        setNombre(cliente.nombre);
        setTelefono(String(cliente.telefono));
        setDireccion(cliente.Direccion || cliente.direccion || '');
    };

    const handleEliminar = async (id?: number) => {
        if (!id || !confirm('¿Eliminar este cliente?')) return;
        try {
            await api.delete(`/clientes/${id}`);
            cargarClientes();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al eliminar el cliente');
        }
    };

    return (
        <div>
            <div className="page-header">
                <h1>Gestión de Clientes</h1>
                <p>Administración de dueños y datos de contacto</p>
            </div>

            {error && <div className="alert-error">{error}</div>}

            <div className="card">
                <h3>{editId ? `Editando Cliente #${editId}` : 'Nuevo Cliente'}</h3>
                <form className="form-grid" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nombre completo</label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            placeholder="Ej: Juan Pérez"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Teléfono</label>
                        <input
                            type="number"
                            value={telefono}
                            onChange={(e) => setTelefono(e.target.value)}
                            placeholder="Ej: 2914123456"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Dirección</label>
                        <input
                            type="text"
                            value={direccion}
                            onChange={(e) => setDireccion(e.target.value)}
                            placeholder="Ej: Av. Alem 1200"
                            required
                        />
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
                            <th>Teléfono</th>
                            <th>Dirección</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clientes.map((c) => (
                            <tr key={c.id_cliente}>
                                <td>#{c.id_cliente}</td>
                                <td>{c.nombre}</td>
                                <td>{c.telefono}</td>
                                <td>{c.Direccion || c.direccion}</td>
                                <td className="actions-cell">
                                    <button type="button" className="btn btn-warning" onClick={() => handleEditar(c)}>
                                        Editar
                                    </button>
                                    <button type="button" className="btn btn-danger" onClick={() => handleEliminar(c.id_cliente)}>
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