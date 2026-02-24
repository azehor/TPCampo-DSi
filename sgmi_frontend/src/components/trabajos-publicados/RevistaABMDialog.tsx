import React, { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Autocomplete,
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
import { mostrarConfirmacion, manejadorDeMensajes } from "../common/ManejadorDeMensajes";

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
  const [intentoEnvio, setIntentoEnvio] = React.useState(false);

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
      manejadorDeMensajes({ tipo: "error", mensaje: "Error al cargar las revistas." });
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
    setIntentoEnvio(false);
    setMode("edit");
  };

  const handleDelete = async (id: number) => {
    const conf = await mostrarConfirmacion({
      mensaje: "¿Está seguro de que desea eliminar esta revista?",
    });
    if (!conf) return;

    try {
      setLoading(true);
      await deleteRevista(id);
      setPaginationModel({ page: 0, pageSize: pageSize });
      await cargarRevistas();
      manejadorDeMensajes({ tipo: "exito", mensaje: "Revista eliminada correctamente." });
    } catch (error) {
      console.error("Error eliminando revista:", error);
      manejadorDeMensajes({ tipo: "error", mensaje: "Error al eliminar la revista." });
    } finally {
      setLoading(false);
    }
  };

  async function handleSave() {
    setIntentoEnvio(true);
    try {
      if (!form.nombre.trim() || !form.issn.trim() || !form.editorial.trim() || !form.pais_id) {
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
        manejadorDeMensajes({ tipo: "exito", mensaje: "Revista creada correctamente." });
      } else if (mode === "edit") {
        await updateRevista(Number(form.id), {
          nombre: form.nombre,
          issn: form.issn,
          editorial: form.editorial,
          pais_id: Number(form.pais_id),
        });
        manejadorDeMensajes({ tipo: "exito", mensaje: "Revista modificada correctamente." });
      }

      setPaginationModel({ page: 0, pageSize: pageSize });
      resetForm();
      setIntentoEnvio(false);
      setMode("list");
      onConfirm?.();
    } catch (error) {
      console.error("Error guardando revista:", error);
      manejadorDeMensajes({ tipo: "error", mensaje: "Error al guardar la revista." });
    } finally {
      setLoading(false);
    }
  }

  const resetForm = () => {
    setForm({ id: "", nombre: "", issn: "", editorial: "", pais_id: "" });
    setIntentoEnvio(false);
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
              required
              value={form.nombre}
              onChange={handleChange("nombre")}
              error={intentoEnvio && !form.nombre.trim()}
              helperText={intentoEnvio && !form.nombre.trim() ? "Campo obligatorio" : ""}
              fullWidth
              disabled={loading}
            />
            <TextField
              label="ISSN"
              required
              value={form.issn}
              onChange={handleChange("issn")}
              error={intentoEnvio && !form.issn.trim()}
              helperText={intentoEnvio && !form.issn.trim() ? "Campo obligatorio" : ""}
              fullWidth
              disabled={loading}
            />
            <TextField
              label="Editorial"
              required
              value={form.editorial}
              onChange={handleChange("editorial")}
              error={intentoEnvio && !form.editorial.trim()}
              helperText={intentoEnvio && !form.editorial.trim() ? "Campo obligatorio" : ""}
              fullWidth
              disabled={loading}
            />
            <Autocomplete
              options={paises}
              getOptionLabel={(option) => option.nombre}
              value={paises.find((p) => p.id === Number(form.pais_id)) ?? null}
              onChange={(_, value) =>
                {
                  setForm({ ...form, pais_id: value ? String(value.id) : "" });
                }
              }
              isOptionEqualToValue={(option, value) => option.id === value.id}
              disabled={loading}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="País"
                  required
                  fullWidth
                  error={intentoEnvio && !form.pais_id}
                  helperText={intentoEnvio && !form.pais_id ? "Campo obligatorio" : ""}
                />
              )}
            />
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
