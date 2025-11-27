import { useState } from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar() {
  const [openActividades, setOpenActividades] = useState(false);

  return (
    <aside className="sidebar">
      <ul className="menu">

        <li className="menu-item">
          <Link to="/grupos-idi">Grupos I+D+i</Link>
        </li>

        <li className="menu-item">
          <span>Administración</span>
        </li>

        {/* ACTIVIDADES I+D+i */}
        <li 
          className="menu-item clickable"
          onClick={() => setOpenActividades(!openActividades)}
        >
          <span>Actividades I+D+i</span>
        </li>

        {/* SUBMENÚ */}
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
    </aside>
  );
}
