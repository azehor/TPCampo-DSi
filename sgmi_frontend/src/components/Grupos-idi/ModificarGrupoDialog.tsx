import React, { useEffect, useState } from "react";
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
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

import { getAllInvestigadores } from "../../services/investigadorService";
import { getFacultadesRegionales } from "../../services/facultadRegionalService";
import { updateGrupo, getGrupo } from "../../services/gruposService";
import { getGrupoInvestigadores, addInvestigadorToGrupo, removeInvestigadorFromGrupo } from "../../services/grupoInvestigadorService";
import type { Investigador } from "../../models/investigador.model";
import type { FacultadRegional } from "../../models/facultad-regional.model";
import { mostrarConfirmacion, manejadorDeMensajes } from "../common/ManejadorDeMensajes";

type GrupoFormData = {
  id?: number;
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
  initialData: any;
}

export default function ModificarGrupoDialog({
  open,
  onClose,
  onConfirm,
  initialData,
}: Props) {
  
  const [investigadores, setInvestigadores] = useState<Investigador[]>([]);
  const [facultades, setFacultades] = useState<FacultadRegional[]>([]);
  const [grupoInvestigadores, setGrupoInvestigadores] = useState<Investigador[]>([]);
  const [nuevoInvestigadorId, setNuevoInvestigadorId] = useState<number | "">("");

  const [form, setForm] = useState<GrupoFormData>({
    id: undefined,
    nombre: "",
    sigla: "",
    correo_electronico: "",
    facultad_id: undefined,
    director_id: undefined,
    vicedirector_id: undefined,
    objetivo: "",
  });

  const investigadoresDisponibles = investigadores.filter(
    (inv) => inv.id !== form.director_id && inv.id !== form.vicedirector_id
  );

  const integrantesVisibles = grupoInvestigadores.filter(
    (inv) => inv.id !== form.director_id && inv.id !== form.vicedirector_id
  );

  /** Cargar datos iniciales del grupo a editar */
  useEffect(() => {
    if (initialData && open) {
      async function loadFullGrupoData() {
        try {
          // Obtener datos completos del grupo desde la API
          const fullData = await getGrupo(initialData.id);
          setForm({
            id: fullData.id,
            nombre: fullData.nombre,
            sigla: fullData.sigla,
            correo_electronico: fullData.correo_electronico,
            facultad_id: fullData.facultad_regional?.id,
            director_id: fullData.director?.id,
            vicedirector_id: fullData.vicedirector?.id,
            objetivo: fullData.objetivos,
          });
        } catch (err) {
          console.error("Error cargando datos del grupo", err);
          // usar los datos de initialData que vienen del listado
          setForm({
            id: initialData.id,
            nombre: initialData.nombre,
            sigla: initialData.sigla,
            correo_electronico: initialData.correo_electronico || "",
            facultad_id: initialData.facultad_regional?.id,
            director_id: initialData.director?.id,
            vicedirector_id: initialData.vicedirector?.id,
            objetivo: initialData.objetivos || "",
          });
        }
      }
      loadFullGrupoData();
    }
  }, [initialData, open]);

  /** Cargar investigadores asociados al grupo */
  useEffect(() => {
    if (!open) return;
    async function loadGrupoInvestigadores() {
      if (!initialData?.id) return;
      try {
        const res = await getGrupoInvestigadores(initialData.id);
        setGrupoInvestigadores(res);
      } catch (err) {
        console.error("Error cargando investigadores del grupo", err);
      }
    }
    loadGrupoInvestigadores();
  }, [initialData, open]);

  /** Cargar investigadores */
  useEffect(() => {
    if (!open) return;

    async function loadInvestigadores() {
      try {
        const res = await getAllInvestigadores();
        setInvestigadores(res);
      } catch (error) {
        console.error("Error cargando investigadores", error);
      }
    }
    loadInvestigadores();
  }, [open]);

  useEffect(() => {
    if (nuevoInvestigadorId === form.director_id || nuevoInvestigadorId === form.vicedirector_id) {
      setNuevoInvestigadorId("");
    }
  }, [form.director_id, form.vicedirector_id, nuevoInvestigadorId]);

  /** Cargar facultades */
  useEffect(() => {
    if (!open) return;

    async function loadFacultades() {
      try {
        const res = await getFacultadesRegionales();
        setFacultades(res.content ?? res);
      } catch (error) {
        console.error("Error cargando facultades", error);
      }
    }
    loadFacultades();
  }, [open]);

  const handleChange =
    (field: keyof GrupoFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm({ ...form, [field]: e.target.value });
    };

  const confirmarYQuitarDeIntegrantesSiCorresponde = async (
    investigadorId?: number,
    cargo?: "director" | "vicedirector"
  ): Promise<boolean> => {
    if (!form.id || !investigadorId) return true;

    const integrante = grupoInvestigadores.find((inv) => inv.id === investigadorId);
    if (!integrante) return true;

    const nombreCompleto = `${integrante.personal?.nombre ?? ""} ${integrante.personal?.apellido ?? ""}`.trim();
    const confirmado = await mostrarConfirmacion({
      mensaje: `${nombreCompleto || "El investigador seleccionado"} ya figura como integrante. ¿Querés quitarlo de integrantes y asignarlo como ${cargo}?`,
    });

    if (!confirmado) {
      return false;
    }

    try {
      await removeInvestigadorFromGrupo(form.id, investigadorId);
      const res = await getGrupoInvestigadores(form.id);
      setGrupoInvestigadores(res);
      return true;
    } catch (err) {
      console.error(err);
      manejadorDeMensajes({ tipo: "error", mensaje: `No se pudo quitar de integrantes al ${cargo}.` });
      return false;
    }
  };

  const handleDirectorChange = async (directorId: number) => {
    const ok = await confirmarYQuitarDeIntegrantesSiCorresponde(directorId, "director");
    if (!ok) return;

    setForm((prev) => ({ ...prev, director_id: directorId }));
  };

  const handleVicedirectorChange = async (vicedirectorId: number) => {
    const ok = await confirmarYQuitarDeIntegrantesSiCorresponde(vicedirectorId, "vicedirector");
    if (!ok) return;

    setForm((prev) => ({ ...prev, vicedirector_id: vicedirectorId }));
  };

  const handleConfirm = async () => {
  const {
    nombre,
    correo_electronico,
    director_id,
    objetivo,
    facultad_id,
    vicedirector_id,
    sigla,
  } = form;

  if (
    !nombre ||
    !correo_electronico ||
    !director_id ||
    !objetivo ||
    !facultad_id ||
    !vicedirector_id
  ) {
    manejadorDeMensajes({ tipo: "alerta", mensaje: "Por favor completá todos los campos obligatorios." });
    return;
  }

  if (!form.id) {
    manejadorDeMensajes({ tipo: "error", mensaje: "No se encontró el ID del grupo a actualizar." });
    return;
  }

  try {
    await updateGrupo(form.id, {
      correo_electronico,
      nombre,
      objetivos: objetivo,
      sigla,
      facultad_regional_id: facultad_id,
      director_id: director_id,
      vicedirector_id
    });

    onConfirm(form);
  } catch (err) {
    console.error(err);
    manejadorDeMensajes({ tipo: "error", mensaje: "Error al actualizar el grupo." });
  }
};

  const handleAddInvestigador = async () => {
    if (!form.id || !nuevoInvestigadorId) return;

    try {
      await addInvestigadorToGrupo(form.id, Number(nuevoInvestigadorId));
      const res = await getGrupoInvestigadores(form.id);
      setGrupoInvestigadores(res);
      setNuevoInvestigadorId("");
    } catch (err) {
      console.error(err);
      const message =
        (err as any)?.response?.data?.error?.join?.(" ") ||
        (err as any)?.response?.data?.error ||
        "Error al asignar investigador";
      manejadorDeMensajes({ tipo: "error", mensaje: message });
    }
  };

  const handleRemoveInvestigador = async (investigadorId: number) => {
    if (!form.id) return;

    const investigador = grupoInvestigadores.find((inv) => inv.id === investigadorId);
    const nombreCompleto = `${investigador?.personal?.nombre ?? ""} ${investigador?.personal?.apellido ?? ""}`.trim();
    const confirmado = await mostrarConfirmacion({
      mensaje: `¿Está seguro de que desea quitar al investigador ${nombreCompleto || "seleccionado"}?`,
    });

    if (!confirmado) return;

    try {
      await removeInvestigadorFromGrupo(form.id, investigadorId);
      const res = await getGrupoInvestigadores(form.id);
      setGrupoInvestigadores(res);
    } catch (err) {
      console.error(err);
      manejadorDeMensajes({ tipo: "error", mensaje: "Error al quitar al investigador." });
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
        Editar Grupo
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
            <Autocomplete
              options={facultades}
              getOptionLabel={(option) => option.nombre}
              value={facultades.find((f) => f.id === form.facultad_id) ?? null}
              onChange={(_, value) =>
                setForm({ ...form, facultad_id: value?.id })
              }
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => (
                <TextField {...params} label="Facultad Regional*" fullWidth />
              )}
            />

            <Autocomplete
              options={investigadores}
              getOptionLabel={(option) => `${option?.personal?.nombre ?? ""} ${option?.personal?.apellido ?? ""}`.trim()}
              value={investigadores.find((i) => i.id === form.director_id) ?? null}
              onChange={(_, value) => {
                if (value?.id) {
                  void handleDirectorChange(value.id);
                }
              }}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => (
                <TextField {...params} label="Director/a*" fullWidth />
              )}
            />

            <Autocomplete
              options={investigadores}
              getOptionLabel={(option) => `${option?.personal?.nombre ?? ""} ${option?.personal?.apellido ?? ""}`.trim()}
              value={investigadores.find((i) => i.id === form.vicedirector_id) ?? null}
              onChange={(_, value) => {
                if (value?.id) {
                  void handleVicedirectorChange(value.id);
                }
              }}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => (
                <TextField {...params} label="Vicedirector/a*" fullWidth />
              )}
            />
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
            helperText={`${form.objetivo?.length}/200 caracteres`}
            FormHelperTextProps={{ sx: { textAlign: "right", mt: 0.5 } }}
          />

          {/* Fila 5*/}
          <Box>
            <Box mb={1}>
              <strong>Investigadores del grupo ({integrantesVisibles.length})</strong>
            </Box>
            <List>
              {integrantesVisibles.map((inv) => (
                <ListItem key={inv.id} secondaryAction={
                  <IconButton edge="end" aria-label="delete" onClick={() => inv.id && handleRemoveInvestigador(inv.id)}>
                    <DeleteIcon />
                  </IconButton>
                }>
                  <ListItemText primary={`${inv?.personal?.nombre} ${inv?.personal?.apellido}`} />
                </ListItem>
              ))}
              {integrantesVisibles.length === 0 && <ListItem><ListItemText primary="No hay investigadores asignados." /></ListItem>}
            </List>

            <Box display="flex" gap={2} mt={2} alignItems="center">
              <Autocomplete
                sx={{ flex: 1 }}
                options={investigadoresDisponibles}
                getOptionLabel={(option) => `${option.personal?.nombre ?? ""} ${option.personal?.apellido ?? ""}`.trim()}
                value={investigadoresDisponibles.find((i) => i.id === nuevoInvestigadorId) ?? null}
                onChange={(_, value) => setNuevoInvestigadorId(value?.id ?? "")}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                  <TextField {...params} label="Agregar investigador" />
                )}
              />

              <Button variant="contained" onClick={handleAddInvestigador} disabled={!nuevoInvestigadorId}>
                Agregar
              </Button>
            </Box>
          </Box>
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
            Guardar Cambios
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
