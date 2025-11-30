import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ExportarExcelDialog from "./ExportarExcelDialog";
import "./Sidebar.css";
import { clearToken } from "../../services/auth";

export default function Sidebar() {
  const [openActividades, setOpenActividades] = useState(false);
  const [openExportDialog, setOpenExportDialog] = useState(false);
  const navigate = useNavigate();

  const handleExportClick = () => {
    setOpenExportDialog(true);
  };

  const handleExportConfirm = (data: any) => {
    console.log("Exportar con filtros:", data);
    setOpenExportDialog(false);
  };

  return (
    <aside className="sidebar">
      <ul className="menu">
        <li className="menu-item">
          <Link to="/grupos-idi">Grupos I+D+i</Link>
        </li>

        <li className="menu-item">
          <span>Administración</span>
        </li>

        <li
          className="menu-item clickable"
          onClick={() => setOpenActividades(!openActividades)}
        >
          <span>Actividades I+D+i</span>
        </li>

        {openActividades && (
          <ul className="submenu">
            <li className="submenu-item">Investigaciones</li>
            <li className="submenu-item">Distinciones y Participaciones</li>
            <li className="submenu-item">Trabajos Presentados</li>

            <li className="submenu-item">
              <Link to="/actividades-idi/trabajos-publicados">
                Trabajos Publicados
              </Link>
            </li>

            <li className="submenu-item">
              <Link to="/actividades-idi/patentes-registros">
                Patentes y Registros
              </Link>
            </li>
          </ul>
        )}

        <li className="menu-item">
          <span>Actividades Docentes</span>
        </li>

        <li className="menu-item">
          <span>Vinculaciones Externas</span>
        </li>

        <li className="menu-item">
          <span>Rendición de Cuentas</span>
        </li>

        <li className="menu-item">
          <span>Programación Futura</span>
        </li>
      </ul>

      {/* FOOTER DEL SIDEBAR */}
      <div className="sidebar-footer">
        <button className="btn-export" onClick={handleExportClick}>
          <img src="/public/excel.png" alt="excel" className="btn-icon" />
          Exportar a Excel
        </button>

        <button className="btn-logout" onClick={handleLogout}>
          <img src="/public/logout.png" alt="logout" className="btn-icon" />
          Cerrar Sesión
        </button>
      </div>

      {/* Dialog de exportacion */}
      <ExportarExcelDialog
        open={openExportDialog}
        onClose={() => setOpenExportDialog(false)}
        onConfirm={handleExportConfirm}
      />
    </aside>
  );

  
  function handleLogout() {
    clearToken();
    navigate("/login");
  }
}
