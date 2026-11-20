import { useEffect, useState } from 'react';
import { api } from '../services/api';
import type { Mascota, Turno } from '../types/models';

export function TurnosPage() {
    const [turnos, setTurnos] = useState<Turno[]>([]);
    const [mascotas, setMascotas] = useState<Mascota[]>([]);
    const [fecha, setFecha] = useState('');
    const [horario, setHorario] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [monto, setMonto] = useState('0');
    const [estado, setEstado] = useState('Pendiente');
    const [mascotaId, setMascotaId] = useState('');
    const [editId, setEditId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    const cargarDatos = async () => {
        try {
            const [turnosData, mascotasData] = await Promise.all([
                api.get<Turno[]>('/turnos'),
                api.get<Mascota[]>('/mascotas'),
            ]);
            setTurnos(turnosData);
            setMascotas(mascotasData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar los turnos');
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    const limpiarFormulario = () => {
        setFecha('');
        setHorario('');
        setDescripcion('');
        setMonto('0');
        setEstado('Pendiente');
        setMascotaId('');
        setEditId(null);
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const payload = {
            fecha,
            horario,
            descripcion: descripcion || '',
            monto: Number(monto),
            estado,
            mascota_id: Number(mascotaId),
        };

        try {
            if (editId) {
                await api.put(`/turnos/${editId}`, payload);
            } else {
                await api.post('/turnos', payload);
            }
            limpiarFormulario();
            cargarDatos();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al guardar el turno');
        }
    };

    const handleEditar = (turno: Turno) => {
        setEditId(turno.id_turno ?? null);
        setFecha(String(turno.fecha).split('T')[0]);
        setHorario(turno.horario);
        setDescripcion(turno.descripcion || '');
        setMonto(String(turno.monto ?? 0));
        setEstado(turno.estado);
        setMascotaId(String(turno.mascota_id));
    };

    const handleEliminar = async (id?: number) => {
        if (!id || !confirm('¿Eliminar este turno?')) return;
        try {
            await api.delete(`/turnos/${id}`);
            cargarDatos();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al eliminar el turno');
        }
    };

    const obtenerNombreMascota = (id: number) => {
        const encontrada = mascotas.find((m) => m.id_mascota === id);
        return encontrada ? `#${id} - ${encontrada.nombre} (${encontrada.tipo})` : `#${id}`;
    };

    return (
        <div>
            <div className="page-header">
                <h1>Agenda de Turnos</h1>
                <p>Control de consultas veterinarias, horarios y estados</p>
            </div>

            {error && <div className="alert-error">{error}</div>}

            <div className="card">
                <h3>{editId ? `Editando Turno #${editId}` : 'Agendar Turno'}</h3>
                <form className="form-grid" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Fecha</label>
                        <input
                            type="date"
                            value={fecha}
                            onChange={(e) => setFecha(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Horario</label>
                        <input
                            type="time"
                            value={horario}
                            onChange={(e) => setHorario(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Mascota</label>
                        <select
                            value={mascotaId}
                            onChange={(e) => setMascotaId(e.target.value)}
                            required
                        >
                            <option value="">Seleccionar mascota...</option>
                            {mascotas.map((m) => (
                                <option key={m.id_mascota} value={m.id_mascota}>
                                    #{m.id_mascota} - {m.nombre} ({m.tipo})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Descripción</label>
                        <input
                            type="text"
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            placeholder="Ej: Vacunación / Control"
                        />
                    </div>
                    <div className="form-group">
                        <label>Monto ($)</label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={monto}
                            onChange={(e) => setMonto(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Estado</label>
                        <select value={estado} onChange={(e) => setEstado(e.target.value)}>
                            <option value="Pendiente">Pendiente</option>
                            <option value="Confirmado">Confirmado</option>
                            <option value="Completado">Completado</option>
                            <option value="Cancelado">Cancelado</option>
                        </select>
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary">
                            {editId ? 'Actualizar' : 'Agendar'}
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
                            <th>Fecha</th>
                            <th>Horario</th>
                            <th>Mascota</th>
                            <th>Descripción</th>
                            <th>Monto</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {turnos.map((t) => (
                            <tr key={t.id_turno}>
                                <td>#{t.id_turno}</td>
                                <td>{String(t.fecha).split('T')[0]}</td>
                                <td>{t.horario}</td>
                                <td>{obtenerNombreMascota(t.mascota_id)}</td>
                                <td>{t.descripcion || '-'}</td>
                                <td>${t.monto ?? 0}</td>
                                <td><span className="badge">{t.estado}</span></td>
                                <td className="actions-cell">
                                    <button type="button" className="btn btn-warning" onClick={() => handleEditar(t)}>
                                        Editar
                                    </button>
                                    <button type="button" className="btn btn-danger" onClick={() => handleEliminar(t.id_turno)}>
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