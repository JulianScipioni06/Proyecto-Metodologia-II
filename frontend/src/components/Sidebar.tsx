import type { SeccionActiva } from "../types/models";

interface SidebarProps {
    seccionActiva: SeccionActiva;
    onSelectSeccion: (seccion: SeccionActiva) => void;
}

const MENU_ITEMS: { id: SeccionActiva; label: string; sub: string } [] = [
    { id: 'clientes', label: 'Clientes', sub: 'Dueños y contactos'},
    { id: 'mascotas', label: 'Mascotas', sub: 'Pacientes registrados'},
    { id: 'turnos', label: 'Turnos', sub: 'Agenda clínica' },
    { id: 'articulos', label: 'Artículos', sub: 'Stock y productos' },
    { id: 'ventas', label: 'Ventas', sub: 'Facturación y anulaciones' },
];

export function Sidebar({ seccionActiva, onSelectSeccion }: SidebarProps) {
    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <div className="brand-badge">VET</div>
                <div>
                    <h2>VetSync</h2>
                    <span>Panel Administrativo</span>
                </div>
            </div>

            <nav className="sidebar-nav">
                <p className="nav-section-title">MÓDULOS</p>
                {MENU_ITEMS.map((item) => (
                    <button
                        key={item.id}
                        type="button"
                        className={`nav-item ${seccionActiva === item.id ? 'active' : ''}`}
                        onClick={() => onSelectSeccion(item.id)}
                    >
                        <span className="nav-label">{item.label}</span>
                        <span className="nav-sub">{item.sub}</span>
                    </button>
                ))}
            </nav>

            <div className="sidebar-footer">
                <small></small>
            </div>
        </aside>
    );
}