import { useState } from 'react';
import './App.css';
import { Sidebar } from './components/Sidebar';
import type { SeccionActiva } from './types/models';
import { ClientesPage } from './pages/ClientesPage';
import { MascotasPage } from './pages/MascotasPage';
import { TurnosPage } from './pages/TurnosPage';
import { ArticulosPage } from './pages/ArticulosPage';

export function App() {
    const [seccionActiva, setSeccionActiva] = useState<SeccionActiva>('turnos');

    const renderSeccion = () => {
      switch (seccionActiva){
        case 'clientes':
          return <ClientesPage/>;
        case 'mascotas':
          return <MascotasPage/>;
        case 'turnos':
          return <TurnosPage/>;
        case 'articulos':
          return <ArticulosPage/>;
        default:
          return (
                <div className="card">
                    <h3>Módulo: {seccionActiva.toUpperCase()}</h3>
                    <p>En Desarrolo</p>
                </div>
            );
      }
    };
    return (
        <div className="app-layout">
            <Sidebar seccionActiva={seccionActiva} onSelectSeccion={setSeccionActiva} />
            <main className="main-content">{renderSeccion()}</main>
        </div>
    );
}

export default App;