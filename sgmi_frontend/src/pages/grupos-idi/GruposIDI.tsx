import { Button, TextField, Paper, Stack, Box, Grid, Typography } from "@mui/material"
//import Paper from "@mui/material/Paper"
import { useEffect, useState } from "react"
import { deleteGrupo, getGrupos } from "../../services/gruposService.ts"
import { Link } from "react-router-dom";
import "./GruposIDI.css"
import { DataGrid, type GridColDef} from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import NuevoGrupoDialog from "../../components/Grupos-idi/NuevoGrupoDialog.tsx";
import ModificarGrupoDialog from "../../components/Grupos-idi/ModificarGrupoDialog.tsx";

//function renderBotonAcciones(props Gri)
export default function GruposIDI() {
  const [rows, setRows] = useState([]);
  const [filterModel, setFilterModel] = useState({ items: [] });
  const [sortModel, setSortModel] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [grupoSeleccionado, setGrupoSeleccionado] = useState<any>(null);
  const [search, setSearch] = useState("");

  const limit = 9;
  const [count, setCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
      page: 0,
      pageSize: limit
  });

  async function cargarGrupos() {
    const res = await getGrupos(
      paginationModel.page,
      paginationModel.pageSize,
      sortModel,
      filterModel
    );
    const total = res.metadata.total_count || res.length;
    setRows(res.content);
    setCount(total); 
  }

  useEffect(() => {
    cargarGrupos();
  }, [paginationModel, sortModel, filterModel]);

  const handleDelete = async (id: number) => {
    const conf = confirm("¿Seguro que deseas eliminar el grupo?");
    if (!conf) return;

    try {
      await deleteGrupo({ id });
      await cargarGrupos();
      alert("Grupo eliminado.");
    } catch (err) {
      console.error(err);
      alert("Error eliminando el grupo.");
    }
  };

  const columns: GridColDef[] = [
    { field: "nombre", headerName: "Nombre", flex: 3, minWidth: 220 },
    { field: "sigla", headerName: "Sigla", flex: 1, minWidth: 100 },
    {
      field: "facultad_regional",
      headerName: "Facultad Regional",
      flex: 2,
      minWidth: 220,
      valueGetter: (_, row) => row?.facultad_regional?.nombre || "",
    },
    {
      field: "director",
      headerName: "Director",
      flex: 2,
      minWidth: 220,
      valueGetter: (_, row) =>
        `${row?.director?.personal?.nombre || ""} ${
          row?.director?.personal?.apellido || ""
        }`,
    },
    {
      field: "vicedirector",
      headerName: "Vicedirector",
      flex: 2,
      minWidth: 220,
      valueGetter: (_, row) =>
        `${row?.vicedirector?.personal?.nombre || ""} ${
          row?.vicedirector?.personal?.apellido || ""
        }`,
    },
    {
      field: "acciones",
      headerName: "Acciones",
      flex: 1.5,
      minWidth: 200,
      sortable: false,
      renderCell: (params) => (
        <Box display="flex" alignItems="center">
          <Link to="/memorias" state={{ grupo: params.row }}>
            <Button
              size="small"
              color="primary"
              >
                <LibraryBooksIcon />
            </Button>
          </Link>

          <Button
            size="small"
            color="primary"
            onClick={() => {
              setGrupoSeleccionado(params.row);
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

  return (
    <div className="grupos-idi">
      <Grid container alignItems="center" justifyContent="space-between" mb={3}>
        <Grid>
          <Typography variant="h4" color="black">
            Grupos I+D+i
          </Typography>
        </Grid>

        <Grid>
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
              Añadir Grupo
            </Button>
          </Box>
        </Grid>
      </Grid>

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
          columns={columns}
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

      {/* Crear grupo */}
      <NuevoGrupoDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={async () => {
          await cargarGrupos();
          setOpenDialog(false);
        }}
      />

      {/* Editar grupo */}
      {grupoSeleccionado && (
        <ModificarGrupoDialog
          open={openEditDialog}
          onClose={() => setOpenEditDialog(false)}
          onConfirm={async () => {
            await cargarGrupos();
            setOpenEditDialog(false);
            setGrupoSeleccionado(null);
          }}
          initialData={grupoSeleccionado}
        />
      )}
    </div>
  );
}
