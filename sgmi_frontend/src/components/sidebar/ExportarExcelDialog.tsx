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
  MenuItem,
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
  anio: number;
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

  const cargarMemorias = async (grupo_id) => {
    try {
      const res = await getMemorias(grupo_id);
      setMemorias(res)
      if (res.length > 0) {
        setForm((prev) => ({...prev, anio: res[0].id}))
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
          <TextField
            label="Grupo"
            value={form.grupo_id}
            onChange={(e) => {
              setForm({ ...form, grupo_id: Number(e.target.value) })
              cargarMemorias(e.target.value)
            }
            }
            fullWidth
            select
          >
            {grupos.map((g) => (
              <MenuItem key={g.id} value={g.id}>
                {g.nombre}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Memoria"
            value={form.anio}
            onChange={(e) =>
              setForm({ ...form, anio: Number(e.target.value)})
            }
            fullWidth
            select
          >
            {memorias.map((m) => (
              <MenuItem key={m.anio} value={m.anio}>
                {m.anio}
              </MenuItem>
            ))}
          </TextField>
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
