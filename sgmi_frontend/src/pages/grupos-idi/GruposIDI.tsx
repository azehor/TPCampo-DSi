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

   const limit = 10;
  
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
    { field: "nombre", headerName: "Nombre", width: 360 },
    { field: "sigla", headerName: "Sigla", width: 100 },
    {
      field: "facultad_regional",
      headerName: "Facultad Regional",
      width: 220,
      valueGetter: (_, row) => row?.facultad_regional?.nombre || "",
    },
    {
      field: "director",
      headerName: "Director",
      width: 220,
      valueGetter: (_, row) =>
        `${row?.director?.personal?.nombre || ""} ${
          row?.director?.personal?.apellido || ""
        }`,
    },
    {
      field: "vicedirector",
      headerName: "Vicedirector",
      width: 220,
      valueGetter: (_, row) =>
        `${row?.vicedirector?.personal?.nombre || ""} ${
          row?.vicedirector?.personal?.apellido || ""
        }`,
    },
    {
      field: "acciones",
      headerName: "Acciones",
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Box display="flex" alignItems="center">
          <Link to="/memorias" state={{ grupo: params.id }}>
            <button
              style={{
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
              }}
            >
              <img src="/more.png" className="btn-icon" />
            </button>
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
    <>
      <Stack
        direction="row"
        sx={{ justifyContent: "space-between", alignItems: "flex-start" }}
      >
        <Grid>
          <Typography variant="h4" color="black">
            Grupos I+D+i
          </Typography>
        </Grid>

        <Box>
          <TextField
            label="Buscar..."
            variant="outlined"
            size="small"
            sx={{ width: 300 }}
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
          >
            Añadir Grupo
          </Button>
        </Box>
      </Stack>

      <Paper elevation={3} sx={{ height: 600, width: "100%" }}>
        <DataGrid
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
    </>
  );
}
