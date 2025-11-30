import React from "react";
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Paper
} from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { useNavigate, useLocation } from "react-router-dom";

import NuevoTrabajoDialog from "../../../components/trabajos-publicados/NuevoTrabajoDialog";
import ModificarTrabajoDialog from "../../../components/trabajos-publicados/ModificarTrabajoDialog";

import { deletePublicacionEnLibro, getPublicaciones } from "../../../services/publicacionEnLibroService";

import "./trabajosPublicados.css";

interface Publicacion {
  id: number;
  codigo: string;
  titulo: string;
  libro: any;
  capitulo: string;
  grupo: string;
}

export default function TrabajosPublicadosLibro() {
  const navigate = useNavigate();
  const location = useLocation();

  const [rows, setRows] = React.useState<Publicacion[]>([]);
  const [count, setCount] = React.useState(0);
  const [page, setPage] = React.useState(0);
  const [search, setSearch] = React.useState("");

  const [openDialog, setOpenDialog] = React.useState(false);
  const [openEditDialog, setOpenEditDialog] = React.useState(false);
  const [trabajoSeleccionado, setTrabajoSeleccionado] = React.useState<any>(null);

  const limit = 10;

  React.useEffect(() => {
    cargarPublicaciones();
  }, [page]);

  async function cargarPublicaciones() {
    try {
      const res = await getPublicaciones(page, limit);

      const publicaciones = res.content || [];
      const total = res.count || publicaciones.length;

      const publicacionesMap = publicaciones.map((p) => ({
        id: p.id,
        codigo: p.codigo,
        titulo: p.titulo,
        tipo: "libro",

        libro: p.libro,
        capitulo: p.capitulo,

        grupo_id: p.grupo_de_investigacion_id,
        grupo: p.grupo_de_investigacion?.nombre ?? "Sin grupo"

      }));
      setRows(publicacionesMap);
      setCount(total);
    } catch (err) {
      console.error("Error cargando publicaciones:", err);
    }
  }

  const handleEdit = (row: Publicacion) => {
    setTrabajoSeleccionado(row);
    setOpenEditDialog(true);
  };

  const handleDelete = async (id: number) => {
  const conf = confirm("¿Seguro que deseas eliminar la publicación del libro?");
  if (!conf) return;

  try {
    await deletePublicacionEnLibro({ id });
    await cargarPublicaciones();
  } catch (error) {
    alert("Ocurrió un error al eliminar la publicación.");
    console.error(error);
  }
};


  const filtered = rows.filter((t) =>
    [
      t?.codigo ?? "",
      t?.titulo ?? "",
      t?.libro ?? "",
      t?.capitulo ?? ""
    ]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // Columnas DataGrid
  const columns: GridColDef[] = [
    { field: "codigo", headerName: "Código", width: 120 },
    { field: "titulo", headerName: "Título del Trabajo", width: 300 },
    { field: "grupo", headerName: "Grupo", width: 300 },
    { field: "libro", headerName: "Título del Libro", width: 250 },
    { field: "capitulo", headerName: "Capítulo", width: 120 },
    {
      field: "acciones",
      headerName: "Acciones",
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          <Button
            size="small"
            color="primary"
            onClick={() => handleEdit(params.row)}
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
            Publicación en Libro o Capítulo
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

      {/* ---------- TABS ---------- */}
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

      {/* ---------- DATAGRID ---------- */}
      <Paper elevation={3} sx={{
          height: 600,
          width: "100%" 
         }}>
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
          rowCount={15}
          columns={columns}
          pagination
          disableColumnMenu
          disableColumnResize={true}
          pageSizeOptions={[15]}
          sortingMode="server"
          filterMode="server"
          paginationMode="server"
          onPaginationModelChange={(model) => setPage(model.page)}
        />
      </Paper>

      <NuevoTrabajoDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={() => {
          cargarPublicaciones()
        }}
        tipo="libro"
    />


      {trabajoSeleccionado && (
        <ModificarTrabajoDialog
          open={openEditDialog}
          onClose={() => setOpenEditDialog(false)}
          onConfirm={(data) => {
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
