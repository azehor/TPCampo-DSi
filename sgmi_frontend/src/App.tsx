import "./App.css";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Header from "./components/header/Header";
import Sidebar from "./components/sidebar/Sidebar";

import LoginPage from "./pages/login/login";
import Home from "./pages/home";

import GruposIDI from "./pages/grupos-idi/GruposIDI";
import Memorias from "./pages/memorias/Memorias";
import PatentesRegistros from "./pages/actividades-idi/patentes-registros/PatentesRegistros";
import TrabajosPublicados from "./pages/actividades-idi/trabajos-publicados/TrabajosPublicadosRevista";
import TrabajosPublicadosLibro from "./pages/actividades-idi/trabajos-publicados/TrabajosPublicadosLibro";
import TrabajosPublicadosDivulgacion from "./pages/actividades-idi/trabajos-publicados/TrabajosPublicadosDivulgacion";

import ProtectedRoute from "./components/ProtectedRoute";
import { getToken } from "./services/auth";
import PerfilPage from "./pages/perfil";
import { AdminPanel } from "./pages/AdminPanel";
import ManejadorDeMensajes from "./components/common/ManejadorDeMensajes";

export default function App() {
  const location = useLocation();
  const hideSidebar = location.pathname === "/login";
  const hideHeader = location.pathname === "/login";

  return (
    <div className="app-container">
      {!hideHeader && <Header />}

      <div className="main-layout">
        {!hideSidebar && <Sidebar />}

        <div className="content-area">
          <Routes>
            {/* Redirigir*/}
            <Route
              path="/"
              element={
                getToken() ? (
                  <Navigate to="/home" replace />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            {/* login */}
            <Route path="/login" element={<LoginPage />} />

            {/* RUTAS PROTEGIDAS */}
            <Route path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />

            <Route path="/perfil"
              element={
                <ProtectedRoute>
                  <PerfilPage />
                </ProtectedRoute>
              }
            />

            <Route path="/admin-panel"
              element={
                <ProtectedRoute>
                  <AdminPanel />
                </ProtectedRoute>
              }
            />

            <Route path="/grupos-idi"
              element={
                <ProtectedRoute>
                  <GruposIDI />
                </ProtectedRoute>
              }
            />

            <Route path="/memorias"
              element={
                <ProtectedRoute>
                  <Memorias />
                </ProtectedRoute>
              }
            />

            <Route path="/actividades-idi/trabajos-publicados"
              element={
                <ProtectedRoute>
                  <TrabajosPublicados />
                </ProtectedRoute>
              }
            />

            <Route path="/actividades-idi/publicacion-libro"
              element={
                <ProtectedRoute>
                  <TrabajosPublicadosLibro />
                </ProtectedRoute>
              }
            />

            <Route path="/actividades-idi/articulos-divulgacion"
              element={
                <ProtectedRoute>
                  <TrabajosPublicadosDivulgacion />
                </ProtectedRoute>
              }
            />

            <Route path="/actividades-idi/patentes-registros"
              element={
                <ProtectedRoute>
                  <PatentesRegistros />
                </ProtectedRoute>
              }
            />

            {/* fallback */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </div>

      <ManejadorDeMensajes />
    </div>
  );
}
