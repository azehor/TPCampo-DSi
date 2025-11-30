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

import { getTrabajosEnRevista } from "../../services/trabajoEnRevistaService";
import { getGruposList } from "../../services/gruposService";
import { updatePatente } from "../../services/patenteService";

interface RegistroData {
  id: number;
  grupo_id: number;
  codigoTrabajo: string;
  identificador: string;
  tipo: string;
}

interface Grupo {
  id: number;
  nombre: string;
}

interface Trabajo {
  id: number;
  codigo: string;
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
  const [trabajos, setTrabajos] = React.useState<Trabajo[]>([]);
  const [form, setForm] = React.useState<RegistroData>(initialData);

  // Reset cuando cambia el registro seleccionado
  useEffect(() => {
    setForm(initialData);
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

  // Cargar trabajos
  useEffect(() => {
    if (!open) return;

    async function cargarTrabajos() {
      try {
        const res = await getTrabajosEnRevista(0, 100);
        const lista = res.content || [];

        const trabajosMap = lista.map((t: any) => ({
          id: t.id,
          codigo: t.codigo,
        }));

        setTrabajos(trabajosMap);
      } catch (err) {
        console.error("Error cargando trabajos", err);
      }
    }
    cargarTrabajos();
  }, [open]);

  const handleChange =
    (field: keyof RegistroData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm({ ...form, [field]: e.target.value });
    };

  const handleConfirm = async () => {
    const { id, grupo_id, codigoTrabajo, identificador, tipo } = form;

    if (!grupo_id || !codigoTrabajo || !identificador || !tipo) {
      alert("Por favor completá todos los campos.");
      return;
    }

    try {
      await updatePatente(id, {
        identificador,
        titulo: codigoTrabajo,
        tipo: tipo,
        grupo_de_investigacion_id: grupo_id,
      });

      onConfirm();
      onClose();
    } catch (err) {
      console.error("Error modificando patente", err);
      alert("Ocurrió un error al modificar la patente.");
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

          {/* CÓDIGO DE TRABAJO */}
          <TextField
            label="Código de Trabajo Asociado"
            value={form.codigoTrabajo || ""}
            onChange={(e) =>
              setForm({ ...form, codigoTrabajo: String(e.target.value) })
            }
            fullWidth
            select
          >
            {trabajos.map((t) => (
              <MenuItem key={t.id} value={t.codigo}>
                {t.codigo}
              </MenuItem>
            ))}
          </TextField>


          {/* IDENTIFICADOR */}
          <TextField
            label="Número Identificador"
            value={form.identificador}
            onChange={handleChange("identificador")}
            fullWidth
          />

          {/* TIPO */}
          <TextField
            label="Tipo de Registro"
            value={form.tipo}
            onChange={handleChange("tipo")}
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
