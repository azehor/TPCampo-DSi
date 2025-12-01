import React from "react";
import {
  Box, Button, Grid, TextField, Typography, Paper
} from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { useNavigate, useLocation } from "react-router-dom";

import NuevoTrabajoDialog from "../../../components/trabajos-publicados/NuevoTrabajoDialog";
import ModificarTrabajoDialog from "../../../components/trabajos-publicados/ModificarTrabajoDialog";

import { deleteTrabajoEnRevista, getTrabajosEnRevista } from "../../../services/trabajoEnRevistaService";

import "./trabajosPublicados.css";

interface TrabajoRevista {
  id: number;
  codigo: string;
  grupo: string;
  titulo: string;
  revista: any;
  issn: string;
  editorial: string;
  pais: string;
}

export default function TrabajosPublicados() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { label: "Trabajo en Revista", path: "/actividades-idi/trabajos-publicados" },
    { label: "Publicación en Libro o Capítulo", path: "/actividades-idi/publicacion-libro" },
    { label: "Artículos de Divulgación", path: "/actividades-idi/articulos-divulgacion" },
  ];

  const [rows, setRows] = React.useState<TrabajoRevista[]>([]);
  const [count, setCount] = React.useState(0);
  const [page, setPage] = React.useState(0);
  const [search, setSearch] = React.useState("");

  

  const [openDialog, setOpenDialog] = React.useState(false);
  const [openEditDialog, setOpenEditDialog] = React.useState(false);

  const [trabajoSeleccionado, setTrabajoSeleccionado] = React.useState<any>(null);
    const limit = 10;

  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: limit
  });


  React.useEffect(() => {
    cargarPublicaciones();
  }, [page]);


  async function cargarPublicaciones() {
    try {
      const res = await getTrabajosEnRevista(page, limit);
      const trabajosRaw = res.content || [];
      const total = res.metadata.total_count || trabajosRaw.length;

      const trabajos = trabajosRaw.map((t: { id: any; codigo: any; titulo: any; revista: { nombre: any; id: any; issn: any; editorial: any; pais: { nombre: any; }; }; grupo_de_investigacion_id: any; grupo_de_investigacion: { nombre: any; }; }) => ({
        id: t.id,
        codigo: t.codigo,
        titulo: t.titulo,
        tipo: "revista",

        revista: t.revista?.nombre ?? "",
        revista_id: t.revista?.id ?? null,

        issn: t.revista?.issn ?? "",
        editorial: t.revista?.editorial ?? "",
        pais: t.revista?.pais?.nombre ?? "",

        grupo_id: t.grupo_de_investigacion_id,
        grupo: t.grupo_de_investigacion?.nombre ?? "Sin grupo"
      }));



      setRows(trabajos);
      setCount(total);
    } catch (err) {
      console.error("Error cargando trabajos en revista:", err);
    }
  }


  const columns: GridColDef[] = [
    { field: "codigo", headerName: "Código", flex: 1, minWidth: 120 },
    { field: "titulo", headerName: "Título del Trabajo", flex: 2, minWidth: 300 },
    { field: "grupo", headerName: "Grupo", flex: 2, minWidth: 300 },
    { field: "revista", headerName: "Revista", flex: 1.5, minWidth: 220 },
    { field: "editorial", headerName: "Editorial", flex: 1.5, minWidth: 220 },
    {
      field: "acciones",
      headerName: "Acciones",
      flex: 1,
      minWidth: 160,
      sortable: false,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          <Button
            size="small"
            color="primary"
            onClick={() => {
              setTrabajoSeleccionado(params.row);
              setOpenEditDialog(true);
            }}
          >
            <EditIcon />
          </Button>

          <Button
            size="small"
            color="error"
            onClick={() =>handleDelete(params.row.id)}
          >
            <DeleteIcon />
          </Button>
        </Box>
      ),
    },
  ];

  const handleDelete = async (id: number) => {
    const conf = confirm("¿Seguro que deseas eliminar el trabajo en revista?");
    if (!conf) return;

    try {
      await deleteTrabajoEnRevista({id});
      await cargarPublicaciones();
    } catch (error) {
      console.error("Error eliminando trabajo en revista:", error);
      alert("Ocurrió un error al eliminar el trabajo.");
    }
  };


  return (
    <div className="trabajos-publicados">

      {/* Título + buscador */}
      <Grid container alignItems="center" justifyContent="space-between" mb={3}>
        <Grid item>
          <Typography variant="h4" color="black">
            Trabajos Realizados y Publicados
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
              Añadir trabajo
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* Tabs */}
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

      {/* DataGrid */}
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
          rows={rows}
          rowCount={count}
          columns={columns}
          pagination
          pageSizeOptions={[limit]}
          paginationMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={(model) => {
            setPaginationModel(model);
            setPage(model.page);
          }}
          disableColumnMenu
          disableColumnResize
        />
      </Paper>

      {/* Diálogo de crear */}
      <NuevoTrabajoDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={cargarPublicaciones}
        tipo="revista"
      />

      {/* Diálogo de edición */}
      {trabajoSeleccionado && (
        <ModificarTrabajoDialog
          open={openEditDialog}
          onClose={() => setOpenEditDialog(false)}
          onConfirm={() => {
            cargarPublicaciones();
            setOpenEditDialog(false);
            setTrabajoSeleccionado(null);
          }}
          initialData={trabajoSeleccionado}
        />
      )}
    </div>
  );
}
