import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Grid,
} from "@mui/material";

interface Trabajo {
  id: number;
  codigo: string;
  titulo: string;
  revista?: { nombre: string };
  libro?: string;
  nombre?: string; // para divulgación
}

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (trabajoId: number) => void;
  tipo: "revista" | "libro" | "divulgacion";
  trabajos: Trabajo[];
}

export default function AsociarTrabajoDialog({
  open,
  onClose,
  onConfirm,
  tipo,
  trabajos,
}: Props) {
  const [selectedId, setSelectedId] = useState<number | "">("");
  const [titulo, setTitulo] = useState("");
  const [extra, setExtra] = useState("");

  useEffect(() => {
    if (!selectedId) {
      setTitulo("");
      setExtra("");
      return;
    }

    const t = trabajos.find((tr) => tr.id === selectedId);
    if (!t) return;

    setTitulo(t.titulo);

    if (tipo === "revista") setExtra(t.revista?.nombre ?? "");
    if (tipo === "libro") setExtra(t.libro ?? "");
    if (tipo === "divulgacion") setExtra(t.nombre ?? "");
  }, [selectedId]);

  const handleConfirm = () => {
    if (!selectedId) return;
    onConfirm(Number(selectedId));
  };

  const labelExtra =
    tipo === "revista"
      ? "Revista"
      : tipo === "libro"
      ? "Libro"
      : "Nombre del Artículo";

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ textAlign: "center", pt: 3 }}>
        Asociar Trabajo a Memoria
      </DialogTitle>

      <DialogContent sx={{ pb: 2, mt: 1 }}>
        <Grid container spacing={2}>
          {/* Tipo (solo lectura, estilo screenshot) */}
          <Grid item xs={12}>
            <TextField
              label="Tipo de Trabajo:"
              fullWidth
              value={
                tipo === "revista"
                  ? "Trabajo en Revista"
                  : tipo === "libro"
                  ? "Publicación en Libro"
                  : "Artículo de Divulgación"
              }
              InputProps={{ readOnly: true }}
            />
          </Grid>

          {/* Código del trabajo */}
          <Grid item xs={12}>
            <TextField
              select
              label="Código del Trabajo:"
              fullWidth
              value={selectedId}
              onChange={(e) => setSelectedId(Number(e.target.value))}
            >
              {trabajos.map((t) => (
                <MenuItem key={t.id} value={t.id}>
                  {t.codigo}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Título */}
          <Grid item xs={12}>
            <TextField
              label="Título:"
              fullWidth
              value={titulo}
              InputProps={{ readOnly: true }}
            />
          </Grid>

          {/* Extra (Revista, Libro, Nombre) */}
          <Grid item xs={12}>
            <TextField
              label={labelExtra + ":"}
              fullWidth
              value={extra}
              InputProps={{ readOnly: true }}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            minWidth: 120,
            textTransform: "none",
            background: "#e0e0e0",
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          sx={{ minWidth: 120, textTransform: "none" }}
          disabled={!selectedId}
        >
          Agregar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
