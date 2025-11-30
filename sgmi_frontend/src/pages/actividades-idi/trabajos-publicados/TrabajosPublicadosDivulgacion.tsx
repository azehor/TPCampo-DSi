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

import { deleteArticulosDivulgacion, getArticulosDivulgacion } from "../../../services/articuloDeDivulgacionService";

import "./trabajosPublicados.css";

interface Divulgacion {
  id: number;
  codigo: string;
  titulo: string;
  nombre: string;
  grupo: string;
}

export default function TrabajosPublicadosDivulgacion() {
  const navigate = useNavigate();
  const location = useLocation();

  const [rows, setRows] = React.useState<Divulgacion[]>([]);
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
    cargarDivulgaciones();
  }, [page]);

  async function cargarDivulgaciones() {
    try {
      const res = await getArticulosDivulgacion(page, limit);


      const articulos = res.content || [];
      console.log(articulos);
      
      const total = res.metadata.total_count || articulos.length;

      const articulosMap = articulos.map((a: { id: any; codigo: any; titulo: any; nombre: any; grupo_de_investigacion_id: any; grupo_de_investigacion: { nombre: any; }; }) => ({
        id: a.id,
        codigo: a.codigo,
        titulo: a.titulo,
        tipo: "divulgacion",

        nombre: a.nombre,

        grupo_id: a.grupo_de_investigacion_id,
        grupo: a.grupo_de_investigacion?.nombre ?? "Sin grupo"
      }));
      setRows(articulosMap);
      setCount(total);
    } catch (err) {
      console.error("Error cargando divulgaciones:", err);
    }
  }

  const filtered = rows.filter((t) =>
    [t.codigo, t.titulo, t.nombre]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const columns: GridColDef[] = [
    { field: "codigo", headerName: "Código", flex: 1, minWidth: 100  },
    { field: "titulo", headerName: "Título del Trabajo", flex: 3, minWidth: 180 },
    { field: "grupo", headerName: "Grupo", flex: 2.5, minWidth: 180  },
    { field: "nombre", headerName: "Nombre del Artículo", flex: 2.5, minWidth: 200 },
    {
      field: "acciones",
      headerName: "Acciones",
      flex: 1,
      minWidth: 120,
      sortable: false,
      renderCell: (params) => (
        <Box display="flex" >
          <Button size="small" color="primary"
            onClick={() => {
              setTrabajoSeleccionado(params.row);
              setOpenEditDialog(true);
            }}>
            <EditIcon />
          </Button>

          <Button size="small" color="error"
            onClick={async () => {
              const conf = confirm("¿Seguro que deseas eliminar el artículo de divulgación?");
              if (!conf) return;

              try {
                await deleteArticulosDivulgacion(params.row.id);
                await cargarDivulgaciones();
              } catch (error) {
                alert("Ocurrió un error al eliminar el artículo.");
                console.error(error);
              }
            }}>
            <DeleteIcon />
          </Button>
        </Box>
      ),
    },
  ];

  const tabs = [
    { label: "Trabajo en Revista", path: "/actividades-idi/trabajos-publicados" },
    { label: "Publicación en Libro o Capítulo", path: "/actividades-idi/publicacion-libro" },
    { label: "Artículos de Divulgación", path: "/actividades-idi/articulos-divulgacion" },
  ];

  return (
    <div className="trabajos-publicados">

      <Grid container alignItems="center" justifyContent="space-between" mb={3}>
        <Grid item>
          <Typography variant="h4" color="black">
            Artículos de Divulgación
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

      {/* DATAGRID */}
      <Paper elevation={3} sx={{ height: 600, width: "100%" }}>
        <DataGrid
          sx={{
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
          paginationModel={paginationModel}
          onPaginationModelChange={(model) => {
            setPaginationModel(model);
            setPage(model.page);
          }}
        />
      </Paper>

      {/* DIALOG NUEVO */}
      <NuevoTrabajoDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={cargarDivulgaciones}
        tipo="divulgacion"
      />

      {/* DIALOG EDITAR */}
      {trabajoSeleccionado && (
        <ModificarTrabajoDialog
          open={openEditDialog}
          onClose={() => setOpenEditDialog(false)}
          onConfirm={() => {
            cargarDivulgaciones();
            setOpenEditDialog(false);
            setTrabajoSeleccionado(null);
          }}
          initialData={trabajoSeleccionado}
        />
      )}
    </div>
  );
}
