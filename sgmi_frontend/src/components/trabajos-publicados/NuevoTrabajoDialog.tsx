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
import { crearTrabajoEnRevista } from "../../services/trabajoEnRevistaService";
import { crearPublicacionEnLibro } from "../../services/publicacionEnLibroService";
import { crearArticuloDeDivulgacion } from "../../services/articuloDeDivulgacionService";
import { getRevistas } from "../../services/revistaService.ts";
import { getGruposList } from "../../services/gruposService";
import type { Revista } from "../../models/revista.model";
import { manejadorDeMensajes } from "../common/ManejadorDeMensajes";


type TipoTrabajo = "revista" | "libro" | "divulgacion";

interface TrabajoData {
  tipo: TipoTrabajo;
  codigo: string;
  titulo: string;
  grupo_id?: number;
  libro: string;
  revista_id?: number; 
  capitulo?: string;
  nombreArticulo?: string;
}

interface Grupo {
  id: number;
  nombre: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  tipo: TipoTrabajo;
}

export default function NuevoTrabajoDialog({
  open,
  onClose,
  onConfirm,
  tipo,
}: Props) {
  const [form, setForm] = React.useState<TrabajoData>({
    tipo,
    codigo: "",
    titulo: "",
    grupo_id: undefined,
    libro: "",
    revista_id: undefined,
    capitulo: "",
    nombreArticulo: "",
  });
  const [intentoEnvio, setIntentoEnvio] = React.useState(false);

  const [revistas, setRevistas] = React.useState<Revista[]>([]);
  const [grupos, setGrupos] = React.useState<Grupo[]>([]);


  // si cambia el tipo desde fuera, reseteo form
  useEffect(() => {
    setForm({
      tipo,
      codigo: "",
      titulo: "",
      grupo_id: undefined,
      libro: "",
      revista_id: undefined,
      capitulo: "",
      nombreArticulo: "",
    });
  }, [tipo]);

    useEffect(() => {
    async function cargarRevistas() {
      try {
        const res = await getRevistas(0, 100, null, null);
        const lista = res.content || res; 
        setRevistas(lista);
      } catch (e) {
        console.error("Error cargando revistas", e);
      }
    }

    if (tipo === "revista" && open) {
      cargarRevistas();
    }
  }, [tipo, open]);

  useEffect(() => {
    async function cargarGrupos() {
      try {
        const res = await getGruposList();
        setGrupos(res);
      } catch (e) {
        console.error("Error cargando grupos", e);
      }
    }

    if (open) cargarGrupos();
  }, [open]);

  const handleChange =
    (field: keyof TrabajoData) => (e: React.ChangeEvent<HTMLInputElement>) => {
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

      if (form.tipo === "libro" && (!form.libro.trim() || !form.capitulo?.trim())) {
        return;
      }

      if (form.tipo === "divulgacion" && !form.nombreArticulo?.trim()) {
        return;
      }

      if (form.tipo === "revista") {
        await crearTrabajoEnRevista({
          codigo: form.codigo,
          titulo: form.titulo,
          grupo_de_investigacion_id: Number(form.grupo_id),
          revista_id: Number(form.revista_id),
        });
        manejadorDeMensajes({ tipo: "exito", mensaje: "Trabajo en revista creado correctamente." });
      }

      if (form.tipo === "libro") {
        await crearPublicacionEnLibro({
          codigo: form.codigo,
          titulo: form.titulo,
          libro: form.libro,
          capitulo: form.capitulo || "",
          grupo_de_investigacion_id: Number(form.grupo_id),
        });
        manejadorDeMensajes({ tipo: "exito", mensaje: "Publicación en libro creada correctamente." });
      }

      if (form.tipo === "divulgacion") {
        await crearArticuloDeDivulgacion({
          codigo: form.codigo,
          titulo: form.titulo,
          nombre: form.nombreArticulo || "",
          grupo_de_investigacion_id: Number(form.grupo_id),
        });
        manejadorDeMensajes({ tipo: "exito", mensaje: "Artículo de divulgación creado correctamente." });
      }

      onConfirm();
      setIntentoEnvio(false);
      onClose();

    } catch (err) {
      console.error(err);
      manejadorDeMensajes({ tipo: "error", mensaje: "Error guardando el registro." });
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Nueva Publicación</DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3}>
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

          {/* SELECT GRUPO */}
          <Autocomplete
            options={grupos}
            getOptionLabel={(option) => option.nombre}
            value={grupos.find((g) => g.id === form.grupo_id) ?? null}
            onChange={(_, value) => {
              setForm({ ...form, grupo_id: value?.id });
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Grupo de Investigación"
                required
                fullWidth
                error={intentoEnvio && !form.grupo_id}
                helperText={intentoEnvio && !form.grupo_id ? "Campo obligatorio" : ""}
              />
            )}
          />

          {/* -------- REVISTA -------- */}
          {form.tipo === "revista" && (
            <Autocomplete
              options={revistas}
              getOptionLabel={(option) => option.nombre}
              value={revistas.find((r) => r.id === form.revista_id) ?? null}
              onChange={(_, value) => {
                setForm({
                  ...form,
                  revista_id: value?.id,
                });
              }}
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

           {/* -------- LIBRO -------- */}
          {form.tipo === "libro" && (
            <>
              <TextField
                label="Título del Libro"
                required
                value={form.libro}
                onChange={handleChange("libro")}
                error={intentoEnvio && !form.libro.trim()}
                helperText={intentoEnvio && !form.libro.trim() ? "Campo obligatorio" : ""}
                fullWidth
              />
              <TextField
                label="Capítulo"
                required
                value={form.capitulo}
                onChange={handleChange("capitulo")}
                error={intentoEnvio && !form.capitulo?.trim()}
                helperText={intentoEnvio && !form.capitulo?.trim() ? "Campo obligatorio" : ""}
                fullWidth
              />
            </>
          )}

          {/* -------- DIVULGACION -------- */}
          {form.tipo === "divulgacion" && (
            <TextField
              label="Nombre del Artículo"
              required
              value={form.nombreArticulo}
              onChange={handleChange("nombreArticulo")}
              error={intentoEnvio && !form.nombreArticulo?.trim()}
              helperText={intentoEnvio && !form.nombreArticulo?.trim() ? "Campo obligatorio" : ""}
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

