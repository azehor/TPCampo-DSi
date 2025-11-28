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

export default function TrabajosPublicados() {
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
      revista: "Nature",
      issn: "0317-8471",
      editorial: "Springer Nature",
      pais: "Reino Unido",
    },
    {
      id: 2,
      codigo: "2025-15625",
      titulo: "Efectos de la Imotica en el medioambiente",
      revista: "ACM Transactions on Information Systems",
      issn: "1050-124X",
      editorial: "Association for Computing Machinery",
      pais: "Estados Unidos",
    },
    {
      id: 3,
      codigo: "2025-15625",
      titulo: "Efectos de la Imotica en el medioambiente",
      revista: "ACM Transactions on Information Systems",
      issn: "1050-124X",
      editorial: "Association for Computing Machinery",
      pais: "Estados Unidos",
    },
  ];

  const [search, setSearch] = React.useState("");

  const handleEdit = (id: number) => console.log("Editar trabajo con ID:", id);
  const handleDelete = (id: number) => console.log("Eliminar trabajo con ID:", id);

  const filteredTrabajos = trabajos.filter((t) =>
    [t.codigo, t.titulo, t.revista, t.issn, t.editorial, t.pais]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="trabajos-publicados">
      <Grid container alignItems="center" justifyContent="space-between" mb={3}>
        <Grid item>
          <Typography variant="h4" color="black">
            Trabajos Realizados y Publicados
          </Typography>
        </Grid>
        <Grid item>
          <Box display="flex" gap={2}>
            <TextField
              label="Buscar trabajo"
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
              onClick={() => console.log("Añadir nuevo trabajo")}
            >
              Añadir trabajo
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* Fila inferior: pestañas justo encima de la tabla */}
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
              <TableCell sx={{ fontWeight: 600 }}>Revista</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>ISSN</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Editorial</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>País</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTrabajos.map((t) => (
              <TableRow key={t.id} hover>
                <TableCell>{t.codigo}</TableCell>
                <TableCell>{t.titulo}</TableCell>
                <TableCell>{t.revista}</TableCell>
                <TableCell>{t.issn}</TableCell>
                <TableCell>{t.editorial}</TableCell>
                <TableCell>{t.pais}</TableCell>
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
