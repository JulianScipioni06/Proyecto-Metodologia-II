import { useState } from 'react';
import './App.css';
import { Sidebar } from './components/Sidebar';
import type { SeccionActiva } from './types/models';
import { ClientesPage } from './pages/ClientesPage';
import { MascotasPage } from './pages/MascotasPage';

export function App() {
    const [seccionActiva, setSeccionActiva] = useState<SeccionActiva>('clientes');

    const renderSeccion = () => {
      switch (seccionActiva){
        case 'clientes':
          return <ClientesPage/>;
        case 'mascotas':
          return <MascotasPage/>;
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