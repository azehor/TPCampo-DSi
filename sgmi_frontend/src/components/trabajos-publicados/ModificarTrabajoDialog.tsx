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
} from "@mui/material";

import { getRevistas } from "../../services/revistaService.ts";
import { getGruposList } from "../../services/gruposService";
import { updateTrabajoEnRevista } from "../../services/trabajoEnRevistaService";
import { updatePublicacionEnLibro } from "../../services/publicacionEnLibroService";
import { updateArticuloDeDivulgacion } from "../../services/articuloDeDivulgacionService";
import type { Revista } from "../../models/revista.model";
import { manejadorDeMensajes } from "../common/ManejadorDeMensajes";

interface Grupo {
  id: number;
  nombre: string;
}

interface TrabajoData {
  id: number;
  tipo: "revista" | "libro" | "divulgacion";
  codigo: string;
  titulo: string;
  grupo_id: number;

  revista_id?: number;
  libro?: string;
  capitulo?: string;
  nombre?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  initialData: TrabajoData;
}

export default function ModificarTrabajoDialog({
  open,
  onClose,
  onConfirm,
  initialData,
}: Props) {
  const [revistas, setRevistas] = React.useState<Revista[]>([]);
  const [grupos, setGrupos] = React.useState<Grupo[]>([]);
  const [form, setForm] = React.useState<TrabajoData>(initialData);

  useEffect(() => {
    setForm(initialData);
  }, [initialData]);

  // cargar revistas
  useEffect(() => {
    if (open && initialData.tipo === "revista") {
      getRevistas(0, 200, null, null).then((res: { content: any; }) => {
        setRevistas(res.content || res);
      });
    }
  }, [open, initialData.tipo]);

  useEffect(() => {
    if (open) {
      getGruposList().then((res) => setGrupos(res));
    }
  }, [open]);

  const handleChange =
    (field: keyof TrabajoData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm({ ...form, [field]: e.target.value });
    };

  async function handleSave() {
    try {
      if (!form.codigo || !form.titulo) {
        manejadorDeMensajes({ tipo: "alerta", mensaje: "Código y título son obligatorios." });
        return;
      }

      if (!form.grupo_id) {
        manejadorDeMensajes({ tipo: "alerta", mensaje: "Debe seleccionar un grupo." });
        return;
      }

      if (form.tipo === "revista") {
        await updateTrabajoEnRevista(form.id, {
          codigo: form.codigo,
          titulo: form.titulo,
          grupo_de_investigacion_id: form.grupo_id,
          revista_id: Number(form.revista_id),
        });
      }

      if (form.tipo === "libro") {
        if (!form.libro || !form.capitulo) {
          manejadorDeMensajes({ tipo: "alerta", mensaje: "Faltan datos del libro." });
          return;
        }

        await updatePublicacionEnLibro(form.id, {
          codigo: form.codigo,
          titulo: form.titulo,
          grupo_de_investigacion_id: form.grupo_id,
          libro: form.libro,
          capitulo: form.capitulo,
        });
      }

      if (form.tipo === "divulgacion") {
        if (!form.nombre) {
          manejadorDeMensajes({ tipo: "alerta", mensaje: "Falta el nombre del artículo." });
          return;
        }

        await updateArticuloDeDivulgacion(form.id, {
          codigo: form.codigo,
          titulo: form.titulo,
          grupo_de_investigacion_id: form.grupo_id,
          nombre: form.nombre,
        });
      }

      onConfirm();
      onClose();
    } catch (err) {
      console.error(err);
      manejadorDeMensajes({ tipo: "error", mensaje: "Error al modificar el trabajo." });
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Modificar Trabajo</DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3}>
          {/* GRUPO */}
          <Autocomplete
            options={grupos}
            getOptionLabel={(option) => option.nombre}
            value={grupos.find((g) => g.id === form.grupo_id) ?? null}
            onChange={(_, value) =>
              setForm({ ...form, grupo_id: value?.id ?? 0 })
            }
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
              <TextField {...params} label="Grupo" fullWidth />
            )}
          />

          <TextField
            label="Código"
            value={form.codigo}
            onChange={handleChange("codigo")}
            fullWidth
          />

          <TextField
            label="Título"
            value={form.titulo}
            onChange={handleChange("titulo")}
            fullWidth
          />

          {/* REVISTA */}
          {form.tipo === "revista" && (
            <Autocomplete
              options={revistas}
              getOptionLabel={(option) => option.nombre}
              value={revistas.find((r) => r.id === form.revista_id) ?? null}
              onChange={(_, value) =>
                setForm({ ...form, revista_id: value?.id })
              }
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => (
                <TextField {...params} label="Revista" fullWidth />
              )}
            />
          )}

          {/* LIBRO */}
          {form.tipo === "libro" && (
            <>
              <TextField
                label="Título del Libro"
                value={form.libro ?? ""}
                onChange={handleChange("libro")}
                fullWidth
              />

              <TextField
                label="Capítulo"
                value={form.capitulo ?? ""}
                onChange={handleChange("capitulo")}
                fullWidth
              />
            </>
          )}

          {/* DIVULGACIÓN */}
          {form.tipo === "divulgacion" && (
            <TextField
              label="Nombre del Artículo"
              value={form.nombre ?? ""}
              onChange={handleChange("nombre")}
              fullWidth
            />
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", p: 2 }}>
        <Button variant="outlined" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="contained" onClick={handleSave}>
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
