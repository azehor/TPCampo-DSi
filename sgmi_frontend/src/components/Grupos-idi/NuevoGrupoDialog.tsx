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
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  Checkbox,
  ListItemText,
} from "@mui/material";
import { getAllInvestigadores } from "../../services/investigadorService";
import { getFacultadesRegionales } from "../../services/facultadRegionalService";
import { crearGrupo } from "../../services/gruposService";
import { addInvestigadorToGrupo } from "../../services/grupoInvestigadorService";
import type { Investigador } from "../../models/investigador.model";
import type { FacultadRegional } from "../../models/facultad-regional.model";

type GrupoFormData = {
  nombre: string;
  sigla: string;
  correo_electronico: string;
  facultad_id?: number;
  director_id?: number;
  vicedirector_id?: number;
  objetivo: string;
};

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: GrupoFormData) => void;
}

export default function NuevoGrupoDialog({
  open,
  onClose,
  onConfirm,
}: Props) {

  const [investigadores, setInvestigadores] = React.useState<Investigador[]>([]);
  const [facultades, setFacultades] = React.useState<FacultadRegional[]>([]);
  const [selectedInvestigadores, setSelectedInvestigadores] = React.useState<number[]>([]);

  const [form, setForm] = React.useState<GrupoFormData>(
    {
      nombre: "",
      sigla: "",
      correo_electronico: "",
      facultad_id: undefined,
      director_id: undefined,
      vicedirector_id: undefined,
      objetivo: "",
    }
  );

  // Cargar investigadores
  useEffect(() => {
    if (!open) return;

    async function cargarInvestigadores() {
      try {
        const res = await getAllInvestigadores();
        setInvestigadores(res);

        if (res.length > 0) {
          const firstId = res[0].id;
          setForm((prev) => ({ ...prev, director_id: firstId, vicedirector_id: firstId }));
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
    (field: keyof GrupoFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
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
      const created = await crearGrupo({
        correo_electronico,
        integrantes: 1,
        nombre,
        objetivos: objetivo,
        sigla,
        facultad_regional_id: facultad_id,
        director_id,
        vicedirector_id,
      });

      const groupId = created?.id;
      // Guardar los investigadores seleccionados
      if (groupId && selectedInvestigadores.length > 0) {
        await Promise.all(selectedInvestigadores.map((invId) => addInvestigadorToGrupo(groupId, invId)));
      }

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

      setSelectedInvestigadores([]);

      onClose();
    }catch (err) {
      console.error("Error creando grupo", err);
      alert("Ocurrió un error al guardar el grupo.");
    }
  };


  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
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
          {/* Fila 1*/}
          <TextField
            label="Nombre del Grupo*"
            value={form.nombre}
            onChange={handleChange("nombre")}
            fullWidth
          />

          {/* Fila 2*/}
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
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
          </Box>

          {/* Fila 3*/}
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2 }}>
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
          </Box>

          {/* Fila 4*/}
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

          {/* Fila 5*/}
          <FormControl fullWidth>
            <InputLabel id="select-investigadores-label">Investigadores</InputLabel>
            <Select
              labelId="select-investigadores-label"
              multiple
              value={selectedInvestigadores}
              onChange={(e) => setSelectedInvestigadores(typeof e.target.value === 'string' ? e.target.value.split(',').map(Number) : e.target.value as number[])}
              input={<OutlinedInput label="Investigadores" />}
              renderValue={(selected) => {
                const names = (selected as number[]).map(s => {
                  const inv = investigadores.find(i => i.id === s);
                  return inv && inv.personal ? `${inv.personal.nombre} ${inv.personal.apellido}` : '';
                }).filter(Boolean);
                return names.join(', ');
              }}
            >
              {investigadores.map((i) => (
                <MenuItem key={i.id} value={i.id}>
                  <Checkbox checked={i.id !== undefined && selectedInvestigadores.indexOf(i.id) > -1} />
                  <ListItemText primary={`${i.personal?.nombre ?? ''} ${i.personal?.apellido ?? ''}`} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
