import React, { useEffect, useState } from "react";
import {
  Box, Button, Paper, Tabs, Tab
} from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import LinkIcon from '@mui/icons-material/Link';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import AsociarTrabajoDialog from "./AsociarTrabajoDialog";

import {
  getTrabajosEnRevistaPorMemoria,
  getPublicacionesEnLibroPorMemoria,
  getArticulosDivulgacionPorMemoria,
  getPatentesPorMemoria,
  addTrabajoRevistaToMemoria,
  addPublicacionLibroToMemoria,
  addArticuloDivulgacionToMemoria,
  addPatenteToMemoria,
  removeTrabajoRevistaFromMemoria,
  removePublicacionLibroFromMemoria,
  removeArticuloDivulgacionFromMemoria,
  removePatenteFromMemoria
} from "../../services/memoriasService";

import { api } from "../../services/api"

export default function SeccionActividad({ memoriaId }: { memoriaId: number }) {

  const [tab, setTab] = useState(0);
  const [rows, setRows] = useState<any[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [trabajosDisponibles, setTrabajosDisponibles] = useState<any[]>([]);

  const limit = 6;
  const [count, setCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
      page: 0,
      pageSize: limit
  });
  const [filterModel, setFilterModel] = useState({ items: [] });
  const [sortModel, setSortModel] = useState([]);

  useEffect(() => {
    cargarDatos();
    cargarDisponibles();
  }, [tab, paginationModel]);

  async function cargarDatos() {
    let res;

    if (tab === 0) {
      res = await getTrabajosEnRevistaPorMemoria(memoriaId, paginationModel.page, paginationModel.pageSize);
    }
    if (tab === 1) {
      res = await getPublicacionesEnLibroPorMemoria(memoriaId, paginationModel.page, paginationModel.pageSize);
    }
    if (tab === 2) {
      res = await getArticulosDivulgacionPorMemoria(memoriaId, paginationModel.page, paginationModel.pageSize);
    }
    if (tab === 3) {
      res = await getPatentesPorMemoria(memoriaId, paginationModel.page, paginationModel.pageSize);
    }
    setRows(res.content);
    const total = res.metadata.total_count || res.length;
    setCount(total);
  }

  async function cargarDisponibles() {
    if (tab === 0) {
      const res = await api.get("/api/trabajo_en_revista")
      setTrabajosDisponibles(res.data.content);
    }
    if (tab === 1) {
      const res = await api.get("/api/publicacion_en_libros")
      setTrabajosDisponibles(res.data.content);
    }
    if (tab === 2) {
      const res = await api.get("/api/articulo_de_divulgacions")
      setTrabajosDisponibles(res.data.content);
    }
    if (tab === 3) {
      const res = await api.get("/api/patentes")
      setTrabajosDisponibles(res.data.content);
    }
  }

  const handleAsociar = async (trabajoId: number) => {
    if (tab === 0) await addTrabajoRevistaToMemoria(memoriaId, trabajoId);
    if (tab === 1) await addPublicacionLibroToMemoria(memoriaId, trabajoId);
    if (tab === 2) await addArticuloDivulgacionToMemoria(memoriaId, trabajoId);
    if (tab === 3) await addPatenteToMemoria(memoriaId, trabajoId);

    await cargarDatos();
    setOpenDialog(false);
  };

  const handleDesasociar = async (trabajoId: number) => {
    if (tab === 0) await removeTrabajoRevistaFromMemoria(memoriaId, trabajoId);
    if (tab === 1) await removePublicacionLibroFromMemoria(memoriaId, trabajoId);
    if (tab === 2) await removeArticuloDivulgacionFromMemoria(memoriaId, trabajoId);
    if (tab === 3) await removePatenteFromMemoria(memoriaId, trabajoId);

    await cargarDatos();
  }

  const etiquetas = [
    "Trabajo en Revista",
    "Publicación en Libro",
    "Artículo de Divulgación",
    "Patente"
  ];

  const columnas: GridColDef[][] = [
    [
      { field: "codigo", headerName: "Código", flex: 1, minWidth: 120 },
      { field: "titulo", headerName: "Título del Trabajo", flex: 2, minWidth: 150 },
      { field: "revista", headerName: "Revista", flex: 1.5, minWidth: 120, valueGetter: (_, row) => row?.revista?.nombre || "" },
      { field: "editorial", headerName: "Editorial", flex: 1, minWidth: 100, valueGetter: (_, row) => row?.revista?.editorial || "" },
      { field: "pais", headerName: "País", flex: 1, minWidth: 160, valueGetter: (_, row) => row?.revista?.pais?.nombre || "" },
      {
        field: "acciones",
        headerName: "Acciones",
        flex: 1,
        minWidth: 120,
        sortable: false,
        renderCell: (params) => (
          <Box display="flex" gap={1}>
            <Button
              size="small"
              color="error"
              onClick={() =>handleDesasociar(params.row.id)}
            >
              <LinkOffIcon />
            </Button>
          </Box>
        ),
      },
    ],
    [
      { field: "codigo", headerName: "Código", flex: 1, minWidth: 120 },
      { field: "titulo", headerName: "Título del Trabajo", flex: 2.25, minWidth: 300 },
      { field: "libro", headerName: "Título del Libro", flex: 2.25, minWidth: 250 },
      { field: "capitulo", headerName: "Capítulo", flex: 1, minWidth: 120 },
      {
        field: "acciones",
        headerName: "Acciones",
        flex: 1,
        minWidth: 120,
        sortable: false,
        renderCell: (params) => (
          <Box display="flex" gap={1}>
            <Button
              size="small"
              color="error"
              onClick={() => handleDesasociar(params.row.id)}
            >
              <LinkOffIcon />
            </Button>
          </Box>
        ),
      },
    ],
    [
      { field: "codigo", headerName: "Código", flex: 1, minWidth: 100  },
      { field: "titulo", headerName: "Título del Trabajo", flex: 3, minWidth: 180 },
      { field: "nombre", headerName: "Nombre del Artículo", flex: 2.5, minWidth: 200 },
      {
        field: "acciones",
        headerName: "Acciones",
        flex: 1,
        minWidth: 120,
        sortable: false,
        renderCell: (params) => (
          <Box display="flex" >
            <Button
              size="small"
              color="error"
              onClick={() => handleDesasociar(params.row.id)}
              >
              <LinkOffIcon />
            </Button>
          </Box>
        ),
      },
    ],
    [
      { field: "identificador", headerName: "Identificador", flex: 1.5, minWidth: 120 },
      { field: "titulo", headerName: "Título", flex: 3.5, minWidth: 200 },
      { field: "tipo", headerName: "Tipo", flex: 1.5, minWidth: 120 },

      {
        field: "acciones",
        headerName: "Acciones",
        flex: 1,
        minWidth: 120,
        sortable: false,
        renderCell: (params) => (
          <Box display="flex" gap={1}>
            <Button
              size="small"
              color="error"
              onClick={() => handleDesasociar(params.row.id)}
            >
              <LinkOffIcon />
            </Button>
          </Box>
        ),
      },
    ]
  ];

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ flexGrow: 1 }}>
          <Tab label="Trabajo en Revista" />
          <Tab label="Publicación en Libro o Capítulo" />
          <Tab label="Artículos de Divulgación" />
          <Tab label="Patentes" />
        </Tabs>

        <Button
          variant="outlined"
          size="small"
          startIcon={<LinkIcon />}
          sx={{ ml: 2 }}
          onClick={() => setOpenDialog(true)}
        >
          Asociar
        </Button>
      </Box>

      <Paper sx={{ mt: 2, height: 450 }}>
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
          columns={columnas[tab]}
          rowCount={count}
          pagination
          paginationMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={(model) => setPaginationModel(model)}
          sortingMode="server"
          filterMode="server"
          onSortModelChange={setSortModel}
          onFilterModelChange={setFilterModel}
          disableColumnMenu
          disableColumnResize
        />
      </Paper>

      <AsociarTrabajoDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={handleAsociar}
        tipo={tab === 0 ? "revista" : tab === 1 ? "libro" : tab === 2 ? "divulgacion" : "patente"}
        trabajos={trabajosDisponibles}
      />

    </Box>
  );
}
