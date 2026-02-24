import React, { useEffect } from "react";
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
import { getAllInvestigadores } from "../../services/investigadorService";
import { getFacultadesRegionales } from "../../services/facultadRegionalService";
import { crearGrupo } from "../../services/gruposService";
import { addInvestigadorToGrupo } from "../../services/grupoInvestigadorService";
import type { Investigador } from "../../models/investigador.model";
import type { FacultadRegional } from "../../models/facultad-regional.model";
import { manejadorDeMensajes } from "../common/ManejadorDeMensajes";

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
  const [intentoEnvio, setIntentoEnvio] = React.useState(false);

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

  const investigadoresDisponibles = investigadores.filter(
    (i) => i.id !== form.director_id && i.id !== form.vicedirector_id
  );

  useEffect(() => {
    setSelectedInvestigadores((prev) =>
      prev.filter((id) => id !== form.director_id && id !== form.vicedirector_id)
    );
  }, [form.director_id, form.vicedirector_id]);

  const handleConfirm = async () => {
    setIntentoEnvio(true);
    const {
      nombre,
      sigla,
      correo_electronico,
      facultad_id,
      director_id,
      vicedirector_id,
      objetivo,
    } = form;

    if (!nombre.trim() || !correo_electronico.trim() || !facultad_id || !director_id || !vicedirector_id || !objetivo.trim()) {
      return;
    }

    try {
      const created = await crearGrupo({
        correo_electronico,
        nombre,
        objetivos: objetivo,
        sigla,
        facultad_regional_id: Number(facultad_id),
        director_id: Number(director_id),
        vicedirector_id: Number(vicedirector_id),
      });

      const groupId = created?.id;
      // Guardar los investigadores seleccionados
      if (groupId && selectedInvestigadores.length > 0) {
        await Promise.all(selectedInvestigadores.map((invId) => addInvestigadorToGrupo(groupId, invId)));
      }

      manejadorDeMensajes({ tipo: "exito", mensaje: "Grupo creado correctamente." });

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

      setIntentoEnvio(false);
      onClose();
    }catch (err) {
      console.error("Error creando grupo", err);
      manejadorDeMensajes({ tipo: "error", mensaje: "Ocurrió un error al guardar el grupo." });
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
            label="Nombre del Grupo"
            required
            value={form.nombre}
            onChange={handleChange("nombre")}
            error={intentoEnvio && !form.nombre.trim()}
            helperText={intentoEnvio && !form.nombre.trim() ? "Campo obligatorio" : ""}
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
              label="Correo electrónico"
              required
              value={form.correo_electronico}
              onChange={handleChange("correo_electronico")}
              error={intentoEnvio && !form.correo_electronico.trim()}
              helperText={intentoEnvio && !form.correo_electronico.trim() ? "Campo obligatorio" : ""}
              fullWidth
              type="email"
            />
          </Box>

          {/* Fila 3*/}
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2 }}>
            <Autocomplete
              options={facultades}
              getOptionLabel={(option) => option.nombre}
              value={facultades.find((f) => f.id === form.facultad_id) ?? null}
              onChange={(_, value) => {
                setForm({ ...form, facultad_id: value?.id });
              }}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Facultad Regional"
                  required
                  fullWidth
                  error={intentoEnvio && !form.facultad_id}
                  helperText={intentoEnvio && !form.facultad_id ? "Campo obligatorio" : ""}
                />
              )}
            />

            <Autocomplete
              options={investigadores}
              getOptionLabel={(option: any) => `${option.personal?.nombre ?? ""} ${option.personal?.apellido ?? ""}`.trim()}
              value={investigadores.find((i) => i.id === form.director_id) ?? null}
              onChange={(_, value) => {
                setForm({ ...form, director_id: value?.id });
              }}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Director/a"
                  required
                  fullWidth
                  error={intentoEnvio && !form.director_id}
                  helperText={intentoEnvio && !form.director_id ? "Campo obligatorio" : ""}
                />
              )}
            />

            <Autocomplete
              options={investigadores}
              getOptionLabel={(option: any) => `${option.personal?.nombre ?? ""} ${option.personal?.apellido ?? ""}`.trim()}
              value={investigadores.find((i) => i.id === form.vicedirector_id) ?? null}
              onChange={(_, value) => {
                setForm({ ...form, vicedirector_id: value?.id });
              }}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Vicedirector/a"
                  required
                  fullWidth
                  error={intentoEnvio && !form.vicedirector_id}
                  helperText={intentoEnvio && !form.vicedirector_id ? "Campo obligatorio" : ""}
                />
              )}
            />
          </Box>

          {/* Fila 4*/}
          <TextField
            label="Objetivo"
            required
            value={form.objetivo}
            onChange={handleChange("objetivo")}
            fullWidth
            multiline
            rows={3}
            inputProps={{ maxLength: 200 }}
            error={intentoEnvio && !form.objetivo.trim()}
            helperText={intentoEnvio && !form.objetivo.trim() ? "Campo obligatorio" : ""}
          />

          {/* Fila 5*/}
          <Autocomplete
            multiple
            options={investigadoresDisponibles}
            getOptionLabel={(option: any) => `${option.personal?.nombre ?? ""} ${option.personal?.apellido ?? ""}`.trim()}
            value={investigadoresDisponibles.filter((i) => i.id !== undefined && selectedInvestigadores.includes(i.id))}
            onChange={(_, value) => setSelectedInvestigadores(value.flatMap((i) => (i.id ? [i.id] : [])))}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField {...params} label="Investigadores" fullWidth />
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
