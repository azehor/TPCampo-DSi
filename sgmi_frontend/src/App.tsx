import './App.css';
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/home';
import Header from './components/header/Header';
import Sidebar from './components/sidebar/Sidebar';
import GruposIDI from './pages/grupos-idi/GruposIDI';
import TrabajosPublicados from './pages/actividades-idi/trabajos-publicados/TrabajosPublicados';
import PatentesRegistros from './pages/actividades-idi/patentes-registros/PatentesRegistros';

export default function App() {
  const location = useLocation();

  // Oculto el sidebar solo en /login
  const hideSidebar = location.pathname === "/login";

  return (
    <div className="app-container">
      <Header />

      <div style={{ display: "flex" }}>
        {!hideSidebar && <Sidebar />}

        <div style={{ flex: 1, padding: "20px" }}>
          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/grupos-idi" element={<GruposIDI />} />
            <Route path="/actividades-idi/trabajos-publicados" element={<TrabajosPublicados />} />
            <Route path="/actividades-idi/patentes-registros" element={<PatentesRegistros />} />

          </Routes>
        </div>
      </div>
    </div>
  );
}
