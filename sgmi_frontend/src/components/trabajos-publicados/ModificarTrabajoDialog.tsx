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
  const [intentoEnvio, setIntentoEnvio] = React.useState(false);

  useEffect(() => {
    setForm(initialData);
    setIntentoEnvio(false);
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
    setIntentoEnvio(true);
    try {
      if (!form.codigo.trim() || !form.titulo.trim() || !form.grupo_id) {
        return;
      }

      if (form.tipo === "revista" && !form.revista_id) {
        return;
      }

      if (form.tipo === "libro" && (!form.libro?.trim() || !form.capitulo?.trim())) {
        return;
      }

      if (form.tipo === "divulgacion" && !form.nombre?.trim()) {
        return;
      }

      if (form.tipo === "revista") {
        await updateTrabajoEnRevista(form.id, {
          codigo: form.codigo,
          titulo: form.titulo,
          grupo_de_investigacion_id: form.grupo_id,
          revista_id: Number(form.revista_id),
        });
        manejadorDeMensajes({ tipo: "exito", mensaje: "Trabajo en revista modificado correctamente." });
      }

      if (form.tipo === "libro") {
        await updatePublicacionEnLibro(form.id, {
          codigo: form.codigo,
          titulo: form.titulo,
          grupo_de_investigacion_id: form.grupo_id,
          libro: form.libro || "",
          capitulo: form.capitulo || "",
        });
        manejadorDeMensajes({ tipo: "exito", mensaje: "Publicación en libro modificada correctamente." });
      }

      if (form.tipo === "divulgacion") {
        await updateArticuloDeDivulgacion(form.id, {
          codigo: form.codigo,
          titulo: form.titulo,
          grupo_de_investigacion_id: form.grupo_id,
          nombre: form.nombre || "",
        });
        manejadorDeMensajes({ tipo: "exito", mensaje: "Artículo de divulgación modificado correctamente." });
      }

      onConfirm();
      setIntentoEnvio(false);
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
            label="Código"
            required
            value={form.codigo}
            onChange={handleChange("codigo")}
            error={intentoEnvio && !form.codigo.trim()}
            helperText={intentoEnvio && !form.codigo.trim() ? "Campo obligatorio" : ""}
            fullWidth
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

          {/* REVISTA */}
          {form.tipo === "revista" && (
            <Autocomplete
              options={revistas}
              getOptionLabel={(option) => option.nombre}
              value={revistas.find((r) => r.id === form.revista_id) ?? null}
              onChange={(_, value) =>
                {
                  setForm({ ...form, revista_id: value?.id });
                }
              }
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Revista"
                  required
                  fullWidth
                  error={intentoEnvio && !form.revista_id}
                  helperText={intentoEnvio && !form.revista_id ? "Campo obligatorio" : ""}
                />
              )}
            />
          )}

          {/* LIBRO */}
          {form.tipo === "libro" && (
            <>
              <TextField
                label="Título del Libro"
                required
                value={form.libro ?? ""}
                onChange={handleChange("libro")}
                error={intentoEnvio && !form.libro?.trim()}
                helperText={intentoEnvio && !form.libro?.trim() ? "Campo obligatorio" : ""}
                fullWidth
              />

              <TextField
                label="Capítulo"
                required
                value={form.capitulo ?? ""}
                onChange={handleChange("capitulo")}
                error={intentoEnvio && !form.capitulo?.trim()}
                helperText={intentoEnvio && !form.capitulo?.trim() ? "Campo obligatorio" : ""}
                fullWidth
              />
            </>
          )}

          {/* DIVULGACIÓN */}
          {form.tipo === "divulgacion" && (
            <TextField
              label="Nombre del Artículo"
              required
              value={form.nombre ?? ""}
              onChange={handleChange("nombre")}
              error={intentoEnvio && !form.nombre?.trim()}
              helperText={intentoEnvio && !form.nombre?.trim() ? "Campo obligatorio" : ""}
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
