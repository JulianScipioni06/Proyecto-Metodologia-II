import { useEffect, useState } from 'react';
import { api } from '../services/api';
import type { Articulo } from '../types/models';

export function ArticulosPage() {
    const [articulos, setArticulos] = useState<Articulo[]>([]);
    const [nombre, setNombre] = useState('');
    const [categoria, setCategoria] = useState('');
    const [stock, setStock] = useState('');
    const [precioUnitario, setPrecioUnitario] = useState('');
    const [editId, setEditId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    const obtenerIdArticulo = (articulo: Articulo) => articulo.id ?? articulo.id_articulo;

    const cargarArticulos = async () => {
        try {
            const data = await api.get<Articulo[]>('/articulos');
            setArticulos(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar los artículos');
        }
    };

    useEffect(() => {
        cargarArticulos();
    }, []);

    const limpiarFormulario = () => {
        setNombre('');
        setCategoria('');
        setStock('');
        setPrecioUnitario('');
        setEditId(null);
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const payload = {
            nombre,
            categoria: categoria.trim() || 'General',
            stock: Number(stock),
            precio_unitario: Number(precioUnitario),
        };

        try {
            if (editId) {
                await api.put(`/articulos/${editId}`, payload);
            } else {
                await api.post('/articulos', payload);
            }
            limpiarFormulario();
            cargarArticulos();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al guardar el artículo');
        }
    };

    const handleEditar = (articulo: Articulo) => {
        setEditId(obtenerIdArticulo(articulo) ?? null);
        setNombre(articulo.nombre);
        setCategoria(articulo.categoria || '');
        setStock(String(articulo.stock));
        setPrecioUnitario(String(articulo.precio_unitario));
    };

    const handleEliminar = async (id?: number) => {
        if (!id || !confirm('¿Eliminar este artículo?')) return;
        try {
            await api.delete(`/articulos/${id}`);
            cargarArticulos();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al eliminar el artículo');
        }
    };

    return (
        <div>
            <div className="page-header">
                <h1>Inventario de Artículos</h1>
                <p>Gestión de productos veterinarios, alimentos y control de stock</p>
            </div>

            {error && <div className="alert-error">{error}</div>}

            <div className="card">
                <h3>{editId ? `Editando Artículo #${editId}` : 'Nuevo Artículo'}</h3>
                <form className="form-grid" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nombre del artículo</label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            placeholder="Ej: Alimento Balanceado 15kg"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Categoría / Detalle</label>
                        <input
                            type="text"
                            list="categorias-articulo"
                            value={categoria}
                            onChange={(e) => setCategoria(e.target.value)}
                            placeholder="Ej: Perro, Gato, Otro..."
                            required
                        />
                        <datalist id="categorias-articulo">
                            <option value="Perro" />
                            <option value="Gato" />
                            <option value="Perro y Gato" />
                            <option value="Aves / Roedores" />
                            <option value="Accesorios" />
                            <option value="Medicamentos" />
                            <option value="General" />
                        </datalist>
                    </div>
                    <div className="form-group">
                        <label>Stock disponible</label>
                        <input
                            type="number"
                            step="1"
                            min="0"
                            value={stock}
                            onChange={(e) => setStock(e.target.value)}
                            placeholder="Ej: 25"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Precio Unitario ($)</label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={precioUnitario}
                            onChange={(e) => setPrecioUnitario(e.target.value)}
                            placeholder="Ej: 18500.00"
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
                            <th>Categoría / Detalle</th>
                            <th>Stock</th>
                            <th>Precio Unitario</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {articulos.map((a) => {
                            const id = obtenerIdArticulo(a);
                            return (
                                <tr key={id}>
                                    <td>#{id}</td>
                                    <td>{a.nombre}</td>
                                    <td><span className="badge">{a.categoria || 'General'}</span></td>
                                    <td>{a.stock} un.</td>
                                    <td>${a.precio_unitario}</td>
                                    <td className="actions-cell">
                                        <button type="button" className="btn btn-warning" onClick={() => handleEditar(a)}>
                                            Editar
                                        </button>
                                        <button type="button" className="btn btn-danger" onClick={() => handleEliminar(id)}>
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}