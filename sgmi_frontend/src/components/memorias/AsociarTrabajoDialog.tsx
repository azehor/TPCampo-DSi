import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Stack,
  Box,
} from "@mui/material";

interface Trabajo {
  id: number;
  codigo?: string;
  titulo: string;
  revista?: { nombre: string };
  libro?: string;
  nombre?: string; // para divulgación
  identificador?: string; // para patente
  tipo?: string // para patente
}

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (trabajoId: number) => void;
  tipo: "revista" | "libro" | "divulgacion" | "patente";
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
    if (!open) return;
    console.log(trabajos)
  }, [open])
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
    if (tipo === "patente") setExtra(t.tipo ?? "")
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
      : tipo === "divulgacion"
      ? "Nombre del Artículo"
      : "Tipo de Patente";

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ textAlign: "center", pt: 3 }}>
        Asociar Trabajo a Memoria
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3}>
          <TextField
            label="Tipo de Trabajo:"
            fullWidth
            value={
              tipo === "revista"
                ? "Trabajo en Revista"
                : tipo === "libro"
                ? "Publicación en Libro"
                : tipo === "divulgacion"
                ? "Artículo de Divulgación"
                : "Patente"
            }
            InputProps={{ disabled: true }}

          />

          {tipo !== "patente" && (
            <TextField
              label="Codigo"
              value={selectedId}
              select
              fullWidth
              onChange={(e) => { console.log("selected"); setSelectedId(Number(e.target.value))}}
              >
                {trabajos.map((t) => (
                  <MenuItem key={t.id} value={t.id}>
                    {t.codigo}
                  </MenuItem>
                ))}
            </TextField>
          )}

          { tipo === "patente" && (
            <TextField
              label="Identificador"
              value={selectedId}
              select
              fullWidth
              onChange={(e) => { console.log("selected"); setSelectedId(Number(e.target.value))}}
              >
                {trabajos.map((t) => (
                  <MenuItem key={t.id} value={t.id}>
                    {t.identificador}
                  </MenuItem>
                ))}
            </TextField>

          )}

          <TextField
            label="Título:"
            fullWidth
            value={titulo}
            InputProps={{ disabled: true }}
          />

          <TextField
            label={labelExtra + ":"}
            fullWidth
            value={extra}
            InputProps={{ disabled: true }}
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
            disabled={!selectedId}
          >
            Confirmar
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
