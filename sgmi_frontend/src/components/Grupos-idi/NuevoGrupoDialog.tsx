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
import { getInvestigadores } from "../../services/investigadorService";
import { getFacultadesRegionales } from "../../services/facultadRegionalService";
import { crearGrupo } from "../../services/gruposService";

interface GrupoData {
  nombre: string;
  sigla: string;
  correo_electronico: string;
  facultad_id?: number;
  director_id?: number;
  vicedirector_id?: number;
  objetivo: string;
}

interface Investigador {
  id: number;
  personal: {
    nombre: string,
    apellido: string
  }
}

interface Facultad {
  id: number;
  nombre: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: GrupoData) => void;
}

export default function NuevoGrupoDialog({
  open,
  onClose,
  onConfirm,
}: Props) {

  const [investigadores, setInvestigadores] = React.useState<Investigador[]>([]);
  const [facultades, setFacultades] = React.useState<Facultad[]>([]);

  const [form, setForm] = React.useState<GrupoData>({
    nombre: "",
    sigla: "",
    correo_electronico: "",
    facultad_id: undefined,
    director_id: undefined,
    vicedirector_id: undefined,
    objetivo: "",
  });

  // Cargar investigadores
  useEffect(() => {
    if (!open) return;

    async function cargarInvestigadores() {
      try {
        const res = await getInvestigadores();
        setInvestigadores(res.content);

        if (res.length > 0) {
          setForm((prev) => ({ ...prev, director_id: res[0].id, vicedirector_id: res[0].id }));
        }
      } catch (e) {
        console.error("Error cargando investigadores", e);
      }
    }

    cargarInvestigadores();
  }, [open]);

  // Cargar facultades
  useEffect(() => {
    if (!open) return;

    async function cargarFacultades() {
      try {
        const res = await getFacultadesRegionales();
        setFacultades(res);

        if (res.length > 0) {
          setForm((prev) => ({ ...prev, facultad_id: res[0].id }));
        }
      } catch (e) {
        console.error("Error cargando facultades", e);
      }
    }

    cargarFacultades();
  }, [open]);

  const handleChange =
    (field: keyof GrupoData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm({ ...form, [field]: e.target.value });
    };

  const handleConfirm = async () => {
    const {
      nombre,
      sigla,
      correo_electronico,
      facultad_id,
      director_id,
      vicedirector_id,
      objetivo,
    } = form;

    if (!nombre || !correo_electronico || !director_id || !objetivo || !facultad_id || !vicedirector_id) {
      alert("Por favor completá todos los campos obligatorios.");
      return;
    }

    try {
      await crearGrupo({
        correo_electronico,
        integrantes: 1,
        nombre,
        objetivos: objetivo,
        sigla,
        facultad_regional_id: facultad_id,
        director_id,
        vicedirector_id,
      });

      onConfirm(form);

      setForm({
          nombre: "",
          sigla: "",
          correo_electronico: "",
          facultad_id: undefined,
          director_id: undefined,
          vicedirector_id: undefined,
          objetivo: "",
        });

      onClose();
    }catch (err) {
      console.error("Error creando grupo", err);
      alert("Ocurrió un error al guardar el grupo.");
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
        Nuevo Grupo
      </DialogTitle>

      <DialogContent dividers sx={{ px: 4, pt: 2 }}>
        <Stack spacing={3}>
          <TextField
            label="Nombre del Grupo*"
            value={form.nombre}
            onChange={handleChange("nombre")}
            fullWidth
          />

          <TextField
            label="Sigla"
            value={form.sigla}
            onChange={handleChange("sigla")}
            fullWidth
          />

          <TextField
            label="Correo electrónico*"
            value={form.correo_electronico}
            onChange={handleChange("correo_electronico")}
            fullWidth
            type="email"
          />

          <TextField
            label="Facultad Regional*"
            value={form.facultad_id}
            onChange={(e) =>
              setForm({ ...form, facultad_id: Number(e.target.value) })
            }
            fullWidth
            select
          >
            {facultades.map((f) => (
              <MenuItem key={f.id} value={f.id}>
                {f.nombre}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Director/a*"
            value={form.director_id}
            onChange={(e) =>
              setForm({ ...form, director_id: Number(e.target.value) })
            }
            fullWidth
            select
          >
            {investigadores.map((i:any) => (
              <MenuItem key={i.id} value={i.id}>
                {i.personal.nombre} {i.personal.apellido}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Vicedirector/a*"
            value={form.vicedirector_id}
            onChange={(e) =>
              setForm({ ...form, vicedirector_id: Number(e.target.value) })
            }
            fullWidth
            select
          >
            {investigadores.map((i:any) => (
              <MenuItem key={i.id} value={i.id}>
                {i.personal.nombre} {i.personal.apellido}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Objetivo*"
            value={form.objetivo}
            onChange={handleChange("objetivo")}
            fullWidth
            multiline
            rows={3}
            inputProps={{ maxLength: 200 }}
            helperText={`${form.objetivo.length}/200 caracteres`}
            FormHelperTextProps={{ sx: { textAlign: "right", mt: 0.5 } }}
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
