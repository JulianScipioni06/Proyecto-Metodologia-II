import { useState } from 'react';
import './App.css';
import { Sidebar } from './components/Sidebar';
import type { SeccionActiva } from './types/models';

export function App() {
    const [seccionActiva, setSeccionActiva] = useState<SeccionActiva>('clientes');

    const renderSeccion = () => {
        return (
            <div className="card">
                <h3>Módulo: {seccionActiva.toUpperCase()}</h3>
                <p>En Desarrolo</p>
            </div>
        );
    };

    return (
        <div className="app-layout">
            <Sidebar seccionActiva={seccionActiva} onSelectSeccion={setSeccionActiva} />
            <main className="main-content">{renderSeccion()}</main>
        </div>
    );
}

export default App;