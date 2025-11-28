import React from "react";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Typography,
  Box, TextField, Button, Grid
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import "./patentesRegistros.css";

export default function PatentesRegistros() {
  const [search, setSearch] = React.useState("");

  const registros = [
    {
      id: 1,
      identificador: "AR133639 A3",
      grupo: "CODAPLI",
      titulo: "Efectos de la Imotica en el medioambiente",
      tipo: "Propiedad Intelectual",
    },
    {
      id: 2,
      identificador: "AR133642 A1",
      grupo: "LINES",
      titulo: "Efectos de la Imotica en el medioambiente",
      tipo: "Propiedad Industrial",
    },
    {
      id: 3,
      identificador: "AR133657 A1",
      grupo: "GIDAS",
      titulo: "Efectos de la Imotica en el medioambiente",
      tipo: "Propiedad Intelectual",
    },
  ];

  const handleEdit = (id: number) => console.log("Editar registro con ID:", id);
  const handleDelete = (id: number) => console.log("Eliminar registro con ID:", id);

  const filteredRegistros = registros.filter((r) =>
    [r.identificador, r.grupo, r.titulo, r.tipo]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="patentes-registros">
      {/* Título + buscador + botón */}
      <Grid container alignItems="center" justifyContent="space-between" mb={3}>
        <Grid item>
          <Typography variant="h4" color="black">
            Patentes y Registros
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
              onClick={() => console.log("Añadir nueva patente")}
            >
              Añadir patente
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* Tabla */}
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f3f3f3" }}>
              <TableCell sx={{ fontWeight: 600 }}>Número Identificador</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Grupo</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Título</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Tipo de Registro</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRegistros.map((r) => (
              <TableRow key={r.id} hover>
                <TableCell>{r.identificador}</TableCell>
                <TableCell>{r.grupo}</TableCell>
                <TableCell>{r.titulo}</TableCell>
                <TableCell>{r.tipo}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleEdit(r.id)} title="Editar">
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(r.id)} title="Eliminar">
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