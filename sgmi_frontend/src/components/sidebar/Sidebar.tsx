import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ExportarExcelDialog from "./ExportarExcelDialog";
import "./Sidebar.css";
import { clearToken } from "../../services/auth";
import { getExcel } from "../../services/excelService";
import LogoutIcon from '@mui/icons-material/Logout';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Collapse,
  Button
} from "@mui/material";

export default function Sidebar() {
  const [openActividades, setOpenActividades] = useState(false);
  const [openExportDialog, setOpenExportDialog] = useState(false);
  const navigate = useNavigate();
  const location = useLocation().pathname;
  useEffect(()=>{ console.log(location) }, [location])

  const handleExportClick = () => {
    setOpenExportDialog(true);
  };

  const handleExportConfirm = (data: any) => {
    console.log("Exportar con filtros:", data);
    setOpenExportDialog(false);
  };

  const goToGrupos = () => {
    navigate("/grupos-idi")
  }

  const goToTrabajosPublicados = () => {
    navigate("/actividades-idi/trabajos-publicados")
  }

  const goToPatentes = () => {
    navigate("/actividades-idi/patentes-registros")
  }

  return (
    <aside
      className="sidebar"
      >
      <Box sx={{ overflow: 'auto' }}>
        <List>
          <ListItem key={"Grupos I+D+i"} disablePadding>
            <ListItemButton onClick={goToGrupos} selected={location == "/grupos-idi"}>
              <ListItemText primary={"Grupos I+D+i"}/>
            </ListItemButton>
          </ListItem>
          <ListItem key={"Administración"} disablePadding>
            <ListItemButton>
              <ListItemText primary={"Administración"}/>
            </ListItemButton>
          </ListItem>
          <ListItem key={"Actividades I+D+i"} disablePadding>
            <ListItemButton onClick={() => setOpenActividades(!openActividades)} selected={openActividades}>
              <ListItemText primary={"Actividades I+D+i"}/>
            </ListItemButton>
          </ListItem>
          <Collapse
            in={openActividades}
          >
            <List>
              <ListItem sx={{ paddingTop: 0, paddingBottom: 0 }} key={"Investigaciones"}>
                <ListItemButton>
                  <ListItemText primary={"Investigaciones"}/>
                </ListItemButton>
              </ListItem>
              <ListItem sx={{ paddingTop: 0, paddingBottom: 0 }} key={"Distinciones y Participaciones"}>
                <ListItemButton>
                  <ListItemText primary={"Distinciones y Participaciones"}/>
                </ListItemButton>
              </ListItem>
              <ListItem sx={{ paddingTop: 0, paddingBottom: 0 }} key={"Trabajos Presentados"}>
                <ListItemButton>
                  <ListItemText primary={"Trabajos Presentados"}/>
                </ListItemButton>
              </ListItem>
              <ListItem sx={{ paddingTop: 0, paddingBottom: 0 }} key={"Trabajos Publicados"}>
                <ListItemButton onClick={goToTrabajosPublicados} selected={location == "/actividades-idi/trabajos-publicados"}>
                  <ListItemText primary={"Trabajos Publicados"}/>
                </ListItemButton>
              </ListItem>
              <ListItem sx={{ paddingTop: 0, paddingBottom: 0 }} key={"Patentes y Registros"}>
                <ListItemButton onClick={goToPatentes} selected={location == "/actividades-idi/patentes-registros"}>
                  <ListItemText primary={"Patentes y Registros"}/>
                </ListItemButton>
              </ListItem>
            </List>
          </Collapse>
          <ListItem key={"Actividades Docentes"} disablePadding>
            <ListItemButton>
              <ListItemText primary={"Actividades Docentes"}/>
            </ListItemButton>
          </ListItem>
          <ListItem key={"Vinculaciones Externas"} disablePadding>
            <ListItemButton>
              <ListItemText primary={"Vinculaciones Externas"}/>
            </ListItemButton>
          </ListItem>
          <ListItem key={"Rendición de Cuentas"} disablePadding>
            <ListItemButton>
              <ListItemText primary={"Rendición de Cuentas"}/>
            </ListItemButton>
          </ListItem>
          <ListItem key={"Programación Futura"} disablePadding>
            <ListItemButton>
              <ListItemText primary={"Programación Futura"}/>
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
      {/* FOOTER DEL SIDEBAR */}
      <Box className="sidebar-footer">
        <Button
          onClick={handleExportClick}
          variant="contained"
          sx={{
            backgroundColor: "#2e7c32",
            textTransform: "none",
            minWidth: 120,
          }}
        >
          <img src="/excel.png" alt="excel" className="btn-icon" />
          Exportar a Excel
        </Button>

        <Button
          onClick={handleLogout}
          variant="contained"
          sx={{
            backgroundColor: "#1976d2",
            textTransform: "none",
            minWidth: 120,
          }}
        >
          <LogoutIcon />
          Cerrar Sesión
        </Button>
      </Box>

      {/* Dialog de exportacion */}
      <ExportarExcelDialog
        open={openExportDialog}
        onClose={() => setOpenExportDialog(false)}
        onConfirm={handleExportConfirm}
      />
    </aside>
  )


  function handleLogout() {
    clearToken();
    navigate("/login");
  }
}
