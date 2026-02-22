import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  MenuItem,
  Typography,
} from "@mui/material";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (anio: number) => void;
}

export default function NuevaMemoriaDialog({ open, onClose, onConfirm }: Props) {
  const anioActual = new Date().getFullYear();
  const [anio, setAnio] = useState(String(anioActual));
  const anios = Array.from({ length: anioActual - 1990 }, (_, index) => anioActual - index);

  const handleConfirm = () => {
    const valor = parseInt(anio);
    if (isNaN(valor) || valor < 1900) return;

    onConfirm(valor);
    setAnio(String(anioActual));
  };

  const handleClose = () => {
    setAnio(String(anioActual));
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ textAlign: "center", pt: 3 }}>Nueva Memoria</DialogTitle>

      <DialogContent sx={{ pb: 2}}>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Año
        </Typography>
        <TextField
          select
          fullWidth
          value={anio}
          onChange={(e) => setAnio(e.target.value)}
          SelectProps={{
            MenuProps: {
              anchorOrigin: {
                vertical: "center",
                horizontal: "left",
              },
              transformOrigin: {
                vertical: "center",
                horizontal: "left",
              },
              PaperProps: {
                sx: {
                  maxHeight: 200,
                },
              },
            },
          }}
          autoFocus
        >
          {anios.map((anio) => (
            <MenuItem key={anio} value={String(anio)}>
              {anio}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", pb: 3}}>
        <Box display="flex" gap={2}>
          <Button
            onClick={handleClose}
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
