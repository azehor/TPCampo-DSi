import React, { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Autocomplete,
  Box,
  Stack,
} from "@mui/material";

import { getGruposList } from "../../services/gruposService";
import { updatePatente } from "../../services/patenteService";
import { manejadorDeMensajes } from "../common/ManejadorDeMensajes";

interface RegistroData {
  id: number;
  grupo_id: number;
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
  initialData: RegistroData;
}

export default function ModificarRegistroDialog({
  open,
  onClose,
  onConfirm,
  initialData,
}: Props) {

  const [grupos, setGrupos] = React.useState<Grupo[]>([]);
  const [form, setForm] = React.useState<RegistroData>(initialData);
  const [intentoEnvio, setIntentoEnvio] = React.useState(false);

  // Reset cuando cambia el registro seleccionado
  useEffect(() => {
    setForm(initialData);
    setIntentoEnvio(false);
  }, [initialData]);

  // Cargar grupos
  useEffect(() => {
    if (!open) return;

    async function cargarGrupos() {
      try {
        const res = await getGruposList();
        setGrupos(res);
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
    setIntentoEnvio(true);
    const { id, grupo_id, titulo, identificador, tipo } = form;

    if (!grupo_id || !titulo.trim() || !identificador.trim() || !tipo) {
      return;
    }

    try {
      await updatePatente(id, {
        identificador,
        titulo: titulo,
        tipo: tipo,
        grupo_de_investigacion_id: grupo_id,
      });

      manejadorDeMensajes({ tipo: "exito", mensaje: "Patente modificada correctamente." });
      onConfirm();
      setIntentoEnvio(false);
      onClose();
    } catch (err) {
      console.error("Error modificando patente", err);
      manejadorDeMensajes({ tipo: "error", mensaje: "Ocurrió un error al modificar la patente." });
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
        Modificar Registro
      </DialogTitle>

      <DialogContent dividers sx={{ px: 4, pt: 2 }}>
        <Stack spacing={3}>

          {/* GRUPO */}
          <Autocomplete
            options={grupos}
            getOptionLabel={(option) => option.nombre}
            value={grupos.find((g) => g.id === form.grupo_id) ?? null}
            onChange={(_, value) => {
              setForm({ ...form, grupo_id: value?.id ?? 0 });
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Grupo"
                required
                fullWidth
                error={intentoEnvio && !form.grupo_id}
                helperText={intentoEnvio && !form.grupo_id ? "Campo obligatorio" : ""}
              />
            )}
          />

          <TextField
              label="Título"
              required
              value={form.titulo}
              onChange={handleChange("titulo")}
                error={intentoEnvio && !form.titulo.trim()}
              helperText={intentoEnvio && !form.titulo.trim() ? "Campo obligatorio" : ""}
              fullWidth
          />


          {/* IDENTIFICADOR */}
          <TextField
            label="Número Identificador"
              required
            value={form.identificador}
            onChange={handleChange("identificador")}
              error={intentoEnvio && !form.identificador.trim()}
              helperText={intentoEnvio && !form.identificador.trim() ? "Campo obligatorio" : ""}
            fullWidth
          />

          {/* TIPO */}
          <TextField
            label="Tipo de Registro"
              required
            value={form.tipo}
            onChange={handleChange("tipo")}
              error={intentoEnvio && !form.tipo}
              helperText={intentoEnvio && !form.tipo ? "Campo obligatorio" : ""}
            fullWidth
            select
          >
            <MenuItem value="Propiedad Intelectual">Propiedad Intelectual</MenuItem>
            <MenuItem value="Propiedad Industrial">Propiedad Industrial</MenuItem>
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
