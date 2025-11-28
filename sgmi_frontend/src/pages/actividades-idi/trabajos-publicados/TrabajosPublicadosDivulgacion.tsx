import React from "react";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Typography,
  Box, TextField, Button, Grid
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate, useLocation } from "react-router-dom";
import "./trabajosPublicados.css";

export default function TrabajosPublicadosDivulgacion() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { label: "Trabajo en Revista", path: "/actividades-idi/trabajos-publicados" },
    { label: "Publicación en Libro o Capítulo", path: "/actividades-idi/publicacion-libro" },
    { label: "Artículos de Divulgación", path: "/actividades-idi/articulos-divulgacion" },
  ];

  const trabajos = [
    {
      id: 1,
      codigo: "2025-12345",
      titulo: "Efectos de la Imotica en el medioambiente",
      articulo: "Imotica International",
    },
    {
      id: 2,
      codigo: "2025-15625",
      titulo: "Efectos de la Imotica en el medioambiente",
      articulo: "ACM Transactions on Information Systems",
    },
    {
      id: 3,
      codigo: "2025-15625",
      titulo: "Efectos de la Imotica en el medioambiente",
      articulo: "ACM Transactions on Information Systems",
    },
  ];

  const [search, setSearch] = React.useState("");

  const handleEdit = (id: number) => console.log("Editar artículo con ID:", id);
  const handleDelete = (id: number) => console.log("Eliminar artículo con ID:", id);

  const filteredTrabajos = trabajos.filter((t) =>
    [t.codigo, t.titulo, t.articulo]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="trabajos-publicados">
      {/* Título + buscador + botón */}
      <Grid container alignItems="center" justifyContent="space-between" mb={3}>
        <Grid item>
          <Typography variant="h4" color="black">
            Artículos de Divulgación
          </Typography>
        </Grid>
        <Grid item>
          <Box display="flex" gap={2}>
            <TextField
              label="Buscar artículo"
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
              onClick={() => console.log("Añadir nuevo artículo")}
            >
              Añadir trabajo
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* Tabs encima de la tabla */}
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
              <TableCell sx={{ fontWeight: 600 }}>Nombre del Artículo</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTrabajos.map((t) => (
              <TableRow key={t.id} hover>
                <TableCell>{t.codigo}</TableCell>
                <TableCell>{t.titulo}</TableCell>
                <TableCell>{t.articulo}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleEdit(t.id)} title="Editar">
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(t.id)} title="Eliminar">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
