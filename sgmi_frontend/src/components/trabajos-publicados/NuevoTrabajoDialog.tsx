import React, { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Stack,
} from "@mui/material";
import { crearTrabajoEnRevista } from "../../services/trabajoEnRevistaService";
import { crearPublicacionEnLibro } from "../../services/publicacionEnLibroService";
import { crearArticuloDeDivulgacion } from "../../services/articuloDeDivulgacionService";
import { getRevistas } from "../../services/revistaService.ts";
import { getGruposList } from "../../services/gruposService";


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

interface Revista {
  id: number;
  nombre: string;
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
    try {
      if (!form.codigo || !form.titulo) {
        alert("Completá código y título.");
        return;
      }

      if (form.tipo === "revista") {
        if (!form.revista_id) {
          alert("Debe ingresar una revista.");
          return;
        }

        await crearTrabajoEnRevista({
          codigo: form.codigo,
          titulo: form.titulo,
          grupo_de_investigacion_id: Number(form.grupo_id),
          revista_id:form.revista_id 
        });
      }

      if (form.tipo === "libro") {
        if (!form.libro || !form.capitulo) {
          alert("Debe completar libro y capítulo.");
          return;
        }

        await crearPublicacionEnLibro({
          codigo: form.codigo,
          titulo: form.titulo,
          libro: form.libro,
          capitulo: form.capitulo,
          grupo_de_investigacion_id: Number(form.grupo_id),
        });
      }

      if (form.tipo === "divulgacion") {
        if (!form.nombreArticulo) {
          alert("Debe ingresar el nombre del artículo.");
          return;
        }

        await crearArticuloDeDivulgacion({
          codigo: form.codigo,
          titulo: form.titulo,
          nombre: form.nombreArticulo,
          grupo_de_investigacion_id: Number(form.grupo_id),
        });
      }

      onConfirm();
      onClose();

    } catch (err) {
      console.error(err);
      alert("Error guardando el registro.");
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Nueva Publicación</DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3}>
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

          {/* SELECT GRUPO */}
          <TextField
            label="Grupo de Investigación"
            value={form.grupo_id}
            select
            fullWidth
            onChange={(e) =>
              setForm({ ...form, grupo_id: Number(e.target.value) })
            }
          >
            {(grupos ?? []).map((g) => (
              <MenuItem key={g.id} value={g.id}>
                {g.nombre}
              </MenuItem>
            ))}
          </TextField>

          {/* -------- REVISTA -------- */}
          {form.tipo === "revista" && (
            <TextField
              label="Revista"
              value={form.revista_id ?? ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  revista_id: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              fullWidth
              select
            >
              {revistas.map((r) => (
                <MenuItem key={r.id} value={r.id}>
                  {r.nombre}
                </MenuItem>
              ))}
            </TextField>
          )}

           {/* -------- LIBRO -------- */}
          {form.tipo === "libro" && (
            <>
              <TextField
                label="Título del Libro"
                value={form.libro}
                onChange={handleChange("libro")}
                fullWidth
              />
              <TextField
                label="Capítulo"
                value={form.capitulo}
                onChange={handleChange("capitulo")}
                fullWidth
              />
            </>
          )}

          {/* -------- DIVULGACION -------- */}
          {form.tipo === "divulgacion" && (
            <TextField
              label="Nombre del Artículo"
              value={form.nombreArticulo}
              onChange={handleChange("nombreArticulo")}
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

