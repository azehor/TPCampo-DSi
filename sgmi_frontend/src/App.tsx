// src/App.tsx
import "./App.css";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Header from "./components/header/Header";
import Sidebar from "./components/sidebar/Sidebar";
import GruposIDI from './pages/grupos-idi/GruposIDI';
import Memorias from './pages/memorias/Memorias'
import PatentesRegistros from './pages/actividades-idi/patentes-registros/PatentesRegistros';

import LoginPage from "./pages/login/login";
import Home from "./pages/home";

import TrabajosPublicadosLibro from './pages/actividades-idi/trabajos-publicados/TrabajosPublicadosLibro';
import TrabajosPublicadosDivulgacion from './pages/actividades-idi/trabajos-publicados/TrabajosPublicadosDivulgacion';
import TrabajosPublicados from './pages/actividades-idi/trabajos-publicados/TrabajosPublicadosRevista';

export default function App() {
  const location = useLocation();

  // en /login NO muestro el sidebar
  const hideSidebar = location.pathname === "/login";

  return (
    <div className="app-container">
      <Header />

      <div style={{ display: "flex" }}>
        {!hideSidebar && <Sidebar />}

        <div style={{ flex: 1, padding: "20px" }}>
          <Routes>
            {/* raíz redirige a /login */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* login */}
            <Route path="/login" element={<LoginPage />} />

            {/* home (por si después querés ir acá) */}
            <Route path="/home" element={<Home />} />

            {/* cualquier otra ruta también manda a login */}
            <Route path="*" element={<Navigate to="/login" replace />} />

            <Route path="/grupos-idi" element={<GruposIDI />} />
            <Route path="/memorias" element={<Memorias />} />
            <Route path="/actividades-idi/trabajos-publicados" element={<TrabajosPublicados />} />
            <Route path="/actividades-idi/publicacion-libro" element={<TrabajosPublicadosLibro />} />
            <Route path="/actividades-idi/articulos-divulgacion" element={<TrabajosPublicadosDivulgacion />} />
            <Route path="/actividades-idi/patentes-registros" element={<PatentesRegistros />} />

          </Routes>
        </div>
      </div>
    </div>
  );
}
