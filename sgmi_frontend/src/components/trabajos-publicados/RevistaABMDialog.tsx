import React, { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Stack,
  Paper,
  Box,
  IconButton,
} from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { getRevistas, createRevista, updateRevista, deleteRevista } from "../../services/revistaService";
import { getPaises } from "../../services/paisService";
import type { Revista } from "../../models/revista.model";
import type { Pais } from "../../models/pais.model";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm?: () => void;
}

type FormMode = "list" | "create" | "edit";

export default function RevistaABMDialog({
  open,
  onClose,
  onConfirm,
}: Props) {
  const [mode, setMode] = React.useState<FormMode>("list");
  const [revistas, setRevistas] = React.useState<Revista[]>([]);
  const [paises, setPaises] = React.useState<Pais[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [count, setCount] = React.useState(0);
  const pageSize = 5;

  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: pageSize,
  });

  const [form, setForm] = React.useState({
    id: "",
    nombre: "",
    issn: "",
    editorial: "",
    pais_id: "",
  });

  // Cargar revistas cuando cambia paginación
  useEffect(() => {
    if (open && mode === "list") {
      cargarRevistas();
    }
  }, [open, mode, paginationModel]);

  // Cargar países
  useEffect(() => {
    if (open) {
      cargarPaises();
    }
  }, [open]);

  async function cargarRevistas() {
    try {
      setLoading(true);
      const res = await getRevistas(paginationModel.page, pageSize, null, null);
      const lista = res.content || res;
      const total = res.metadata?.total_count || lista.length;
      setRevistas(lista);
      setCount(total);
    } catch (e) {
      console.error("Error cargando revistas", e);
      alert("Error al cargar revistas");
    } finally {
      setLoading(false);
    }
  }

  async function cargarPaises() {
    try {
      const res = await getPaises();
      setPaises(res);
    } catch (e) {
      console.error("Error cargando países", e);
    }
  }

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleEdit = (revista: Revista) => {
    setForm({
      id: revista.id.toString(),
      nombre: revista.nombre,
      issn: revista.issn,
      editorial: revista.editorial,
      pais_id: (revista.pais_id || revista.pais?.id || "").toString(),
    });
    setMode("edit");
  };

  const handleDelete = async (id: number) => {
    const conf = confirm("¿Seguro que deseas eliminar esta revista?");
    if (!conf) return;

    try {
      setLoading(true);
      await deleteRevista(id);
      setPaginationModel({ page: 0, pageSize: pageSize });
      await cargarRevistas();
    } catch (error) {
      console.error("Error eliminando revista:", error);
      alert("Error al eliminar revista");
    } finally {
      setLoading(false);
    }
  };

  async function handleSave() {
    try {
      if (!form.nombre || !form.issn || !form.editorial || !form.pais_id) {
        alert("Complete todos los campos");
        return;
      }

      setLoading(true);

      if (mode === "create") {
        await createRevista({
          nombre: form.nombre,
          issn: form.issn,
          editorial: form.editorial,
          pais_id: Number(form.pais_id),
        });
      } else if (mode === "edit") {
        await updateRevista(Number(form.id), {
          nombre: form.nombre,
          issn: form.issn,
          editorial: form.editorial,
          pais_id: Number(form.pais_id),
        });
      }

      setPaginationModel({ page: 0, pageSize: pageSize });
      resetForm();
      setMode("list");
      onConfirm?.();
    } catch (error) {
      console.error("Error guardando revista:", error);
      alert("Error guardando revista");
    } finally {
      setLoading(false);
    }
  }

  const resetForm = () => {
    setForm({ id: "", nombre: "", issn: "", editorial: "", pais_id: "" });
  };

  const columns: GridColDef[] = [
    { field: "nombre", headerName: "Nombre", flex: 2, minWidth: 250 },
    { field: "issn", headerName: "ISSN", flex: 1, minWidth: 150 },
    { field: "editorial", headerName: "Editorial", flex: 1.5, minWidth: 200 },
    {
      field: "acciones",
      headerName: "Acciones",
      flex: 1,
      minWidth: 120,
      sortable: false,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          <IconButton
            size="small"
            color="primary"
            onClick={() => handleEdit(params.row)}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => handleDelete(params.row.id)}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: 2, borderBottom: "1px solid #e0e0e0" }}>
        <DialogTitle sx={{ p: 0 }}>
          {mode === "list"
            ? "Gestión de Revistas"
            : mode === "create"
            ? "Crear Nueva Revista"
            : "Editar Revista"}
        </DialogTitle>
        <div style={{ display: "flex", gap: "22px" }}>
            {mode === "list" ? (
                <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => {
                    resetForm();
                    setMode("create");
                }}
                >
                Crear
                </Button>
             ): null
            }
            
            <IconButton
            onClick={onClose}
            sx={{ color: "inherit" }}
            >
            <CloseIcon />
            </IconButton>
        </div>
      </Box>

      <DialogContent>
        {mode === "list" ? (
          <Box sx={{ height: 400, width: "100%", mb: 2 }}>
            <Paper elevation={0} sx={{ height: "100%", width: "100%" }}>
              <DataGrid
                rows={revistas}
                columns={columns}
                rowCount={count}
                disableColumnMenu
                disableColumnResize
                pagination
                pageSizeOptions={[5]}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                paginationMode="server"
                loading={loading}
                sx={{
                  "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: "#f3f3f3 !important",
                  },
                  "& .MuiDataGrid-columnHeaderTitle": {
                    fontWeight: 600,
                  },
                }}
              />
            </Paper>
          </Box>
        ) : (
          <Stack spacing={3}>
            <TextField
              label="Nombre"
              value={form.nombre}
              onChange={handleChange("nombre")}
              fullWidth
              disabled={loading}
            />
            <TextField
              label="ISSN"
              value={form.issn}
              onChange={handleChange("issn")}
              fullWidth
              disabled={loading}
            />
            <TextField
              label="Editorial"
              value={form.editorial}
              onChange={handleChange("editorial")}
              fullWidth
              disabled={loading}
            />
            <TextField
              label="País"
              select
              value={form.pais_id}
              onChange={(e) => setForm({ ...form, pais_id: e.target.value })}
              fullWidth
              disabled={loading}
            >
              {paises.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {p.nombre}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", p: 2, gap: 2 }}>
        {mode === "list" ? (
          <>
          </>
        ) : (
          <>
            <Button
              variant="outlined"
              onClick={() => {
                resetForm();
                setMode("list");
              }}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={loading}
            >
              Guardar
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}
