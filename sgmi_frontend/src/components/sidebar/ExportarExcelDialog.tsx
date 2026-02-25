import React, { useEffect } from "react";
import { getExcel } from "../../services/excelService";
import { getGruposList } from "../../services/gruposService";
import { getMemorias } from "../../services/memoriasService";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Autocomplete,
  Box,
  Stack,
} from "@mui/material";

interface ExportarExcelData {
  grupo_id: number;
  anio: number;
}

interface Grupo {
  id: number;
  nombre: string;
}

interface Memoria {
  id: number;
  anio: number | string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: ExportarExcelData) => void;
}

export default function ExportarExcelDialog({
  open,
  onClose,
  onConfirm,
}: Props) {
  const [grupos, setGrupos] = React.useState<Grupo[]>([])
  const [memorias, setMemorias] = React.useState<Memoria[]>([])
  const [intentoEnvio, setIntentoEnvio] = React.useState(false)
  const [form, setForm] = React.useState<ExportarExcelData>({
    grupo_id: 0,
    anio: 0,
  });
  useEffect(() => {
    if (!open) return;
    async function cargarGrupos() {
      try {
        const res = await getGruposList();
        setGrupos(res)
        if (res.length > 0) {
          setForm((prev) => ({...prev, grupo_id: res[0].id}));
          return res[0].id
        }
      } catch (e) {
        console.log("Error cargando grupos", e)
      }
    }

    cargarGrupos().then((res) => cargarMemorias(res))
  }, [open])

  const cargarMemorias = async (grupo_id: number) => {
    try {
      const res = await getMemorias(grupo_id);
      setMemorias(res)
      if (res.length > 0) {
        setForm((prev) => ({...prev, anio: Number(res[0].anio)}))
      }
      console.log(form)
    } catch (e) {
      console.log("Error cargando memorias", e)
    }
  }

  const handleConfirm = async () => {
    const { grupo_id, anio } = form;
    if (grupo_id && anio) {
      getExcel(grupo_id, anio).then((res) => {
        const href = URL.createObjectURL(res.data)
        console.log(res.headers)
        let filename = "report.xlsx"
        const disposition = res.headers['content-disposition'];
        if (disposition) {
          filename = disposition.match(/filename="([^"]+)"/)[1]
        }

        const link = document.createElement("a");
        link.href = href;
        link.setAttribute('download', filename);
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(href)
      })
      onConfirm(form);
    } else {
      alert("Por favor completá todos los campos.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          fontWeight: 600,
          color: "primary.main",
          textAlign: "center",
          pt: 3,
        }}
      >
        Exportar Excel
      </DialogTitle>

      <DialogContent dividers sx={{ px: 4, pt: 2 }}>
        <Stack spacing={3}>
          <Autocomplete
            options={grupos}
            getOptionLabel={(option) => option.nombre}
            value={grupos.find((g) => g.id === form.grupo_id) ?? null}
            onChange={(_, value) => {
              const grupoId = value?.id ?? 0;
              setForm({ ...form, grupo_id: grupoId, anio: 0 });
              if (grupoId) {
                void cargarMemorias(grupoId);
              } else {
                setMemorias([]);
              }
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Grupo *"
                required
                fullWidth
                error={intentoEnvio && !form.grupo_id}
                helperText={intentoEnvio && !form.grupo_id ? "Campo obligatorio" : ""}
              />
            )}
          />

          <Autocomplete
            options={memorias}
            getOptionLabel={(option) => String(option.anio)}
            value={memorias.find((m) => Number(m.anio) === form.anio) ?? null}
            onChange={(_, value) => {
              setForm({ ...form, anio: value ? Number(value.anio) : 0 });
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Memoria *"
                required
                fullWidth
                error={intentoEnvio && !form.anio}
                helperText={intentoEnvio && !form.anio ? "Campo obligatorio" : ""}
              />
            )}
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
        <Box display="flex" gap={2}>
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{
              color: "#666",
              borderColor: "#ccc",
              backgroundColor: "#f5f5f5",
              textTransform: "none",
              minWidth: 120,
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            variant="contained"
            sx={{
              backgroundColor: "#1976d2",
              textTransform: "none",
              minWidth: 120,
            }}
          >
            Confirmar
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
