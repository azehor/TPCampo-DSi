import React, { useEffect } from "react";
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
import { getGruposList } from "../../services/gruposService";
import { crearPatente } from "../../services/patenteService";

interface RegistroData {
  grupo_id?: number;
  titulo: string;
  identificador: string;
  tipo: string;
}

interface Grupo {
  id: number;
  nombre: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function NuevoRegistroDialog({
  open,
  onClose,
  onConfirm,
}: Props) {
  const [grupos, setGrupos] = React.useState<Grupo[]>([]);

  const [form, setForm] = React.useState<RegistroData>({
    grupo_id: undefined,
    titulo: "",
    identificador: "",
    tipo: "",
  });

  // Cargar grupos
  useEffect(() => {
    if (!open) return;

    async function cargarGrupos() {
      try {
        const res = await getGruposList();
        setGrupos(res);

        if (res.length > 0) {
          setForm((prev) => ({ ...prev, grupo_id: res[0].id }));
        }
      } catch (e) {
        console.error("Error cargando grupos", e);
      }
    }

    cargarGrupos();
  }, [open]);

  const handleChange =
    (field: keyof RegistroData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm({ ...form, [field]: e.target.value });
    };

  const handleConfirm = async () => {
    const { grupo_id, titulo, identificador, tipo } = form;

    if (!grupo_id || !titulo || !identificador || !tipo) {
      alert("Por favor completá todos los campos.");
      return;
    }

    try {
      await crearPatente({
        identificador,
        titulo,
        tipo: tipo,
        grupo_de_investigacion_id: grupo_id,
      });

      onConfirm();
      setForm({
        grupo_id: undefined,
        titulo: "",
        identificador: "",
        tipo: "",
      });
      onClose();
    } catch (err) {
      console.error("Error creando patente", err);
      alert("Ocurrió un error al guardar la patente.");
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
        Nueva Patente / Registro
      </DialogTitle>

      <DialogContent dividers sx={{ px: 4, pt: 2 }}>
        <Stack spacing={3}>
          {/* GRUPO */}
          <TextField
            label="Grupo"
            value={form.grupo_id}
            onChange={(e) =>
              setForm({ ...form, grupo_id: Number(e.target.value) })
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
            label="Título"
            value={form.titulo}
            onChange={handleChange("titulo")}
            fullWidth
          />

          <TextField
            label="Número Identificador"
            value={form.identificador}
            onChange={handleChange("identificador")}
            fullWidth
          />

          <TextField
            label="Tipo de Registro"
            value={form.tipo}
            onChange={handleChange("tipo")}
            fullWidth
            select
          >
            <MenuItem value="Propiedad Intelectual">
              Propiedad Intelectual
            </MenuItem>
            <MenuItem value="Propiedad Industrial">
              Propiedad Industrial
            </MenuItem>
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
