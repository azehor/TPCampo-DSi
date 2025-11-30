import React from "react";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Typography,
  Box, TextField, Button, Grid
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate, useLocation } from "react-router-dom";
import NuevoTrabajoDialog from "../../../components/trabajos-publicados/NuevoTrabajoDialog";
import ModificarTrabajoDialog from "../../../components/trabajos-publicados/ModificarTrabajoDialog";
import "./trabajosPublicados.css";

export default function TrabajosPublicadosLibro() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { label: "Trabajo en Revista", path: "/actividades-idi/trabajos-publicados" },
    { label: "Publicación en Libro o Capítulo", path: "/actividades-idi/publicacion-libro" },
    { label: "Artículos de Divulgación", path: "/actividades-idi/articulos-divulgacion" },
  ];

  // Estado dinámico de trabajos
  const [trabajos, setTrabajos] = React.useState([
    {
      id: 1,
      codigo: "2025-12345",
      titulo: "Efectos de la Imotica en el medioambiente",
      libro: "Nature",
      capitulo: "0317-8471",
      grupo: "Grupo 1",
      tipo: "libro",
    },
    {
      id: 2,
      codigo: "2025-15625",
      titulo: "Efectos de la Imotica en el medioambiente",
      libro: "ACM Transactions on Information Systems",
      capitulo: "1050-124X",
      grupo: "Grupo 2",
      tipo: "libro",
    },
    {
      id: 3,
      codigo: "2025-15625",
      titulo: "Efectos de la Imotica en el medioambiente",
      libro: "ACM Transactions on Information Systems",
      capitulo: "1050-124X",
      grupo: "Grupo 3",
      tipo: "libro",
    },
  ]);

  const [search, setSearch] = React.useState("");
  const [openDialog, setOpenDialog] = React.useState(false);
  const [openEditDialog, setOpenEditDialog] = React.useState(false);
  const [trabajoSeleccionado, setTrabajoSeleccionado] = React.useState<any>(null);

  const handleEdit = (trabajo: any) => {
    setTrabajoSeleccionado(trabajo);
    setOpenEditDialog(true);
  };

  const handleDelete = (id: number) => {
    setTrabajos(trabajos.filter((t) => t.id !== id));
  };

  const handleAddTrabajo = (nuevoTrabajo: any) => {
    setTrabajos([
      ...trabajos,
      { id: trabajos.length + 1, ...nuevoTrabajo }
    ]);
    setOpenDialog(false);
  };

  const handleUpdateTrabajo = (data: any) => {
    setTrabajos((prev) =>
      prev.map((t) => (t.id === trabajoSeleccionado.id ? { ...t, ...data } : t))
    );
    setOpenEditDialog(false);
    setTrabajoSeleccionado(null);
  };

  const filteredTrabajos = trabajos.filter((t) =>
    [t.codigo, t.titulo, t.libro, t.capitulo]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="trabajos-publicados">
      <Grid container alignItems="center" justifyContent="space-between" mb={3}>
        <Grid item>
          <Typography variant="h4" color="black">
            Publicación en Libro o Capítulo
          </Typography>
        </Grid>
        <Grid item>
          <Box display="flex" gap={2}>
            <TextField
              label="Buscar"
              variant="outlined"
              size="small"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ width: "300px" }}
            />
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setOpenDialog(true)} 
            >
              Añadir trabajo
            </Button>
          </Box>
        </Grid>
      </Grid>

      <div className="tabs-container">
        {tabs.map((tab) => (
          <button
            key={tab.path}
            className={`tab-button ${location.pathname === tab.path ? "active" : ""}`}
            onClick={() => navigate(tab.path)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tabla */}
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f3f3f3" }}>
              <TableCell sx={{ fontWeight: 600 }}>Código</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Título del Trabajo</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Título del Libro</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Capítulo</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTrabajos.map((t) => (
              <TableRow key={t.id} hover>
                <TableCell>{t.codigo}</TableCell>
                <TableCell>{t.titulo}</TableCell>
                <TableCell>{t.libro}</TableCell>
                <TableCell>{t.capitulo}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit(t)}
                    title="Editar"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(t.id)}
                    title="Eliminar"
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Diálogo de nuevo trabajo */}
      <NuevoTrabajoDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={handleAddTrabajo}
        tipo="libro"
      />

      {/* Diálogo de modificar trabajo */}
      {trabajoSeleccionado && (
        <ModificarTrabajoDialog
          open={openEditDialog}
          onClose={() => setOpenEditDialog(false)}
          onConfirm={handleUpdateTrabajo}
          initialData={trabajoSeleccionado}
        />
      )}
    </div>
  );
}
