import React from "react";
import {
  Box, Button, Grid, TextField, Typography, Paper
} from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import NuevoRegistroDialog from "../../../components/patentes-registros/NuevoRegistroDialog";
import ModificarRegistroDialog from "../../../components/patentes-registros/ModificarRegistroDialog";

import { deletePatente, getPatentes } from "../../../services/patenteService";

import "./patentesRegistros.css";

interface Patente {
  id: number;
  identificador: string;
  titulo: string;
  tipo: string;
  grupo: string;
  grupo_id: number;
}

export default function PatentesRegistros() {
  const [openDialog, setOpenDialog] = React.useState(false);
  const [openEditDialog, setOpenEditDialog] = React.useState(false);

  const [registroSeleccionado, setRegistroSeleccionado] = React.useState<any>(null);

  const [rows, setRows] = React.useState<Patente[]>([]);
  const [count, setCount] = React.useState(0);
  const [page, setPage] = React.useState(0);
  const [search, setSearch] = React.useState("");

  const limit = 10;

  React.useEffect(() => {
    cargarPatentes();
  }, [page]);

  async function cargarPatentes() {
    try {
      const res = await getPatentes(page, limit);

      const patentes = res.content || [];
      const total = res.count || patentes.length;

      const patentesMap = patentes.map((p: any) => ({
        id: p.id,
        identificador: p.identificador,
        titulo: p.titulo,
        tipo: p.tipo,
        grupo_id: p.grupo_de_investigacion_id,
        grupo: p.grupo_de_investigacion?.nombre ?? "Sin grupo"
      }));

      setRows(patentesMap);
      setCount(total);
    } catch (err) {
      console.error("Error cargando patentes:", err);
    }
  }

  const filtered = rows.filter((t) =>
    [t.identificador, t.titulo, t.tipo, t.grupo]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const columns: GridColDef[] = [
  { field: "identificador", headerName: "Identificador", flex: 1.5, minWidth: 120 },
  { field: "grupo", headerName: "Grupo", flex: 2.5, minWidth: 150 },
  { field: "titulo", headerName: "Título", flex: 3.5, minWidth: 200 },
  { field: "tipo", headerName: "Tipo", flex: 1.5, minWidth: 120 },

  {
    field: "acciones",
    headerName: "Acciones",
    flex: 1,
    minWidth: 140,
    sortable: false,
    renderCell: (params) => (
      <Box display="flex" gap={1}>
        <Button
          size="small"
          color="primary"
          onClick={() => {
            setRegistroSeleccionado(params.row);
            setOpenEditDialog(true);
          }}
        >
          <EditIcon />
        </Button>

        <Button
          size="small"
          color="error"
          onClick={() => handleDelete(params.row.id)}
        >
          <DeleteIcon />
        </Button>
      </Box>
    ),
  },
];

  const handleDelete = async (id: number) => {
    const conf = confirm("¿Seguro que deseas eliminar la patente?");
    if (!conf) return;

    try {
      await deletePatente({ id });
      await cargarPatentes();
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("Ocurrió un error eliminando la patente.");
    }
  };

  return (
    <div className="patentes-registros">
      {/* TÍTULO + BUSCADOR */}
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
              sx={{ width: 300 }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenDialog(true)}
            >
              Añadir Registro
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* DATAGRID */}
      <Paper elevation={3} sx={{ height: 600, width: "100%" }}>
      <DataGrid
        sx={{
          // ---- HEADER GRIS ----
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#f3f3f3 !important",
          },
          "& .MuiDataGrid-columnHeader": {
            backgroundColor: "#f3f3f3 !important",
          },
          "& .MuiDataGrid-columnHeadersInner": {
            backgroundColor: "#f3f3f3 !important",
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: 600,
            color: "#000",
          },
        }}

        rows={filtered}
        rowCount={count}
        columns={columns}
        pagination
        pageSizeOptions={[limit]}
        paginationMode="server"
        onPaginationModelChange={(model) => setPage(model.page)}
      />

      </Paper>

      {/* NUEVO */}
      <NuevoRegistroDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={() => {
          cargarPatentes();
          setOpenDialog(false);
        }}
      />

      {/* EDITAR */}
      {registroSeleccionado && (
        <ModificarRegistroDialog
          open={openEditDialog}
          onClose={() => setOpenEditDialog(false)}
          onConfirm={() => {
            cargarPatentes();
            setOpenEditDialog(false);
            setRegistroSeleccionado(null);
          }}
          initialData={registroSeleccionado}
        />
      )}
    </div>
  );
}
