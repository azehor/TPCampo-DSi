import React from "react";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Typography,
  Box, TextField, Button, Grid
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import NuevoRegistroDialog from "../../../components/patentes-registros/NuevoRegistroDialog";
import ModificarRegistroDialog from "../../../components/patentes-registros/ModificarRegistroDialog"; // ← nuevo
import "./patentesRegistros.css";

export default function PatentesRegistros() {
  const [search, setSearch] = React.useState("");
  const [openDialog, setOpenDialog] = React.useState(false);
  const [openEditDialog, setOpenEditDialog] = React.useState(false);
  const [registroSeleccionado, setRegistroSeleccionado] = React.useState<any>(null);

  const [registros, setRegistros] = React.useState([
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
  ]);

  const handleEdit = (registro: any) => {
    setRegistroSeleccionado({
      tipoRegistro: registro.tipo,
      grupo: registro.grupo,
      codigoTrabajo: registro.titulo,
      identificador: registro.identificador,
    });
    setOpenEditDialog(true);
  };

  const handleUpdateRegistro = (data: any) => {
    setRegistros((prev) =>
      prev.map((r) =>
        r.id === registroSeleccionado.id
          ? {
              ...r,
              grupo: data.grupo,
              titulo: data.codigoTrabajo,
              identificador: data.identificador,
              tipo: data.tipoRegistro,
            }
          : r
      )
    );
    setOpenEditDialog(false);
    setRegistroSeleccionado(null);
  };

  const handleDelete = (id: number) => {
    setRegistros(registros.filter((r) => r.id !== id));
  };

  const handleAddRegistro = (nuevo: {
    grupo: string;
    titulo: string;
    identificador: string;
    tipoRegistro: string;
  }) => {
    setRegistros([
      ...registros,
      {
        id: registros.length + 1,
        grupo: nuevo.grupo,
        titulo: nuevo.titulo,
        identificador: nuevo.identificador,
        tipo: nuevo.tipoRegistro,
      },
    ]);
    setOpenDialog(false);
  };

  const filteredRegistros = registros.filter((r) =>
    [r.identificador, r.grupo, r.titulo, r.tipo]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="patentes-registros">
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
              onClick={() => setOpenDialog(true)}
            >
              Añadir patente
            </Button>
          </Box>
        </Grid>
      </Grid>

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
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit(r)}
                    title="Editar"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(r.id)}
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

      <NuevoRegistroDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={handleAddRegistro}
      />

      {registroSeleccionado && (
        <ModificarRegistroDialog
          open={openEditDialog}
          onClose={() => setOpenEditDialog(false)}
          onConfirm={handleUpdateRegistro}
          initialData={registroSeleccionado}
        />
      )}
    </div>
  );
}
