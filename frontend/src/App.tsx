import { useState } from 'react';
import './App.css';
import { Sidebar } from './components/Sidebar';
import type { SeccionActiva } from './types/models';
import { ClientesPage } from './pages/ClientesPage';
import { MascotasPage } from './pages/MascotasPage';
import { TurnosPage } from './pages/TurnosPage';
import { ArticulosPage } from './pages/ArticulosPage';
import { VentasPage } from './pages/VentasPage';

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
        case 'ventas':
          return <VentasPage/>
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