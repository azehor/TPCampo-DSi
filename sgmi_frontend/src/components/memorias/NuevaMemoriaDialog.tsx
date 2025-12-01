import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from "@mui/material";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (anio: number) => void;
}

export default function NuevaMemoriaDialog({ open, onClose, onConfirm }: Props) {
  const [anio, setAnio] = useState("");

  const handleConfirm = () => {
    const valor = parseInt(anio);
    if (isNaN(valor) || valor < 1900) return;

    onConfirm(valor);
    setAnio("");
  };

  const handleClose = () => {
    setAnio("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ textAlign: "center", pt: 3 }}>Nueva Memoria</DialogTitle>

      <DialogContent sx={{ pb: 2 }}>
        <TextField
          label="Año"
          fullWidth
          value={anio}
          onChange={(e) => setAnio(e.target.value)}
          autoFocus
        />
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
        <Box display="flex" gap={2}>
          <Button variant="outlined" onClick={handleClose}>Cancelar</Button>
          <Button variant="contained" onClick={handleConfirm}>Confirmar</Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
