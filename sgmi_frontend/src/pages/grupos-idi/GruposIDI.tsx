import { Button, TextField, Paper, Stack, Box, Grid, Typography } from "@mui/material"
//import Paper from "@mui/material/Paper"
import { useEffect, useState } from "react"
import { getGrupos } from "../../services/gruposService.ts"
import { Link } from "react-router-dom";
import "./GruposIDI.css"
import { DataGrid, type GridColDef} from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

//function renderBotonAcciones(props Gri)
export default function GruposIDI() {
  const [rows, setRows] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 15,
  });
  const [filterModel, setFilterModel] = useState({ items: [] });
  const [sortModel, setSortModel] = useState([]);
  useEffect(() => {
    getGrupos(paginationModel.page, paginationModel.pageSize, sortModel, filterModel).then((data) => {
      setRows(data.content);
    })
  }, [paginationModel, sortModel, filterModel])


  const columns: GridColDef[] = [
  { field: 'nombre', headerName: 'Nombre', width: 360 },
  { field: 'sigla', headerName: 'Sigla', width: 100 },
  {
    field: 'facultad_regional',
    headerName: 'Facultad Regional',
    width: 220,
    valueGetter: (value, row) => `${row?.facultad_regional?.nombre || ''}`,
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
      <Box display="flex" alignItems="center" >
        <Link to="/memorias" state={{ grupo: params.id }}>
          <button style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}>
            <img src="/more.png" className="btn-icon" />
          </button>
        </Link>
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
  }
];

  function setOpenDialog(arg0: boolean): void {
    throw new Error("Function not implemented.");
  }

  return (
    <>
      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "flex-start"}}>
        <Grid item>
          <Typography variant="h4" color="black">
            Grupos I+D+i
          </Typography>
        </Grid>
        <Box>
          <TextField label="Buscar..." 
          variant="outlined"
              size="small"
              sx={{ width: 300 }} 
          />
          <Button variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenDialog(true)}
            >
            Añadir Grupo</Button>
        </Box>
      </Stack>
      <Paper elevation={3} sx={{ height: 600, width: "100%" }}>
        <DataGrid
          sx={{
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#f3f3f3',
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            fontWeight: 600,
            color: '#000',
          }
        }}
          rows={rows}
          rowCount={15}
          columns={columns}
          pagination
          disableColumnMenu
          disableColumnResize={true}
          pageSizeOptions={[15]}
          sortingMode="server"
          filterMode="server"
          paginationMode="server"
          onPaginationModelChange={(newPaginationModel) => {
            getGrupos(newPaginationModel.page, newPaginationModel.pageSize, sortModel, filterModel).then((data) => {
              setRows(data.grupos);
            })
          }}
          onSortModelChange={(newSortModel) => {
            getGrupos(paginationModel.page, paginationModel.pageSize, newSortModel, filterModel).then((data) => {
              console.log(newSortModel)
              setRows(data.grupos);
            })
          }}
          onFilterModelChange={(newFilterModel) => {
            getGrupos(paginationModel.page, paginationModel.pageSize, sortModel, newFilterModel).then((data) => {
              setRows(data.grupos);
            })
          }}
        />
      </Paper>
    </>
  )
}
function handleEdit(row: any): void {
  throw new Error("Function not implemented.");
}

function handleDelete(id: any): void {
  throw new Error("Function not implemented.");
}

