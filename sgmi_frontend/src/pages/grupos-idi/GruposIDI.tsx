import { Button, TextField, Paper, Stack, Box } from "@mui/material"
import { DataGrid } from "@mui/x-data-grid";
//import Paper from "@mui/material/Paper"
import { useEffect, useState } from "react"
import { getGrupos } from "../../services/gruposService.ts"
import { Link } from "react-router-dom";
import "./GruposIDI.css"

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
      setRows(data.grupos);
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
    field: 'director',
    headerName: 'Director',
    description: '',
    width: 220,
    valueGetter: (value, row) => `${row?.director?.personal?.nombre || ''} ${row?.director?.personal?.apellido || ''}`,
  },
  {
    field: 'vicedirector',
    headerName: 'Vicedirector',
    description: '',
    width: 220,
    valueGetter: (value, row) => `${row?.vicedirector?.personal?.nombre || ''} ${row?.vicedirector?.personal?.apellido || ''}`,
  },
  {
      field: 'id',
      headerName: 'Acciones',
      description: '',
      width: 160,
      sortable: false,
      renderCell: (params: GridRenderCellParams<any, number>) => {
        return (
        <>
          <Link to="/memorias" state={{ grupo: params.id }}>
          <button>
              <img src="/public/more.png" className="btn-icon"></img>
          </button></Link>
          <button><img src="/public/editing.png" className="btn-icon"></img></button>
          <button><img src="/public/delete.png" className="btn-icon"></img></button>
        </>
        )
      },
    }
];

  return (
    <>
      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "flex-start"}}>
        <h2>Grupos I+D+i</h2>
        <Box>
          <TextField label="Buscar..." variant="outlined"/>
          <Button color="primary"><img src="/public/more.png" className="btn-icon"></img> Añadir Grupo</Button>
        </Box>
      </Stack>
      <Paper sx={{ height: 725, width: '100%'}}>
        <DataGrid
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
