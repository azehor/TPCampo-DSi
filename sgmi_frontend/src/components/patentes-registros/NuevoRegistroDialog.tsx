import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Box,
  Stack,
} from "@mui/material";

interface RegistroData {
  grupo: string;
  titulo: string;
  identificador: string;
  tipoRegistro: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: RegistroData) => void;
}

export default function NuevoRegistroDialog({
  open,
  onClose,
  onConfirm,
}: Props) {
  const [form, setForm] = React.useState<RegistroData>({
    grupo: "Grupo 1",
    titulo: "",
    identificador: "",
    tipoRegistro: "",
  });

  const handleChange =
    (field: keyof RegistroData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm({ ...form, [field]: e.target.value });
    };

  const handleConfirm = () => {
    const { grupo, titulo, identificador, tipoRegistro } = form;
    if (grupo && titulo && identificador && tipoRegistro) {
      onConfirm(form);
    } else {
      alert("Por favor completá todos los campos.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          fontWeight: 600,
          color: "primary.main",
          textAlign: "center",
          pt: 3,
        }}
      >
        Nueva Patente
      </DialogTitle>

      <DialogContent dividers sx={{ px: 4, pt: 2 }}>
        <Stack spacing={3}>
          <TextField
            label="Grupo"
            value={form.grupo}
            onChange={handleChange("grupo")}
            fullWidth
            select
          >
            <MenuItem value="Grupo 1">Grupo 1</MenuItem>
            <MenuItem value="Grupo 2">Grupo 2</MenuItem>
            <MenuItem value="Grupo 3">Grupo 3</MenuItem>
          </TextField>

          <TextField
            label="Título"
            value={form.titulo}
            onChange={handleChange("titulo")}
            fullWidth
          />

          <TextField
            label="Número Identificador"
            value={form.identificador}
            onChange={handleChange("identificador")}
            fullWidth
          />

          <TextField
            label="Tipo de Registro"
            value={form.tipoRegistro}
            onChange={handleChange("tipoRegistro")}
            fullWidth
            select
          >
            <MenuItem value="Propiedad Intelectual">Propiedad Intelectual</MenuItem>
            <MenuItem value="Propiedad Industrial">Propiedad Industrial</MenuItem>
          </TextField>
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
