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
  codigoTrabajo: string;
  identificador: string;
  tipoRegistro: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: RegistroData) => void;
  initialData: RegistroData;
}

export default function ModificarRegistroDialog({
  open,
  onClose,
  onConfirm,
  initialData,
}: Props) {
  const [form, setForm] = React.useState<RegistroData>(initialData);

  React.useEffect(() => {
    setForm(initialData);
  }, [initialData]);

  const handleChange =
    (field: keyof RegistroData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm({ ...form, [field]: e.target.value });
    };

  const handleConfirm = () => {
    const { grupo, codigoTrabajo, identificador, tipoRegistro } = form;
    if (grupo && codigoTrabajo && identificador && tipoRegistro) {
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
        Modificar Registro
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
            <MenuItem value="CODAPLI">CODAPLI</MenuItem>
            <MenuItem value="LINES">LINES</MenuItem>
            <MenuItem value="GIDAS">GIDAS</MenuItem>
          </TextField>

          <TextField
            label="Código de Trabajo Asociado"
            value={form.codigoTrabajo}
            onChange={handleChange("codigoTrabajo")}
            fullWidth
            select
          >
            <MenuItem value="2025-12345">2025-12345</MenuItem>
            <MenuItem value="2025-15625">2025-15625</MenuItem>
            <MenuItem value="2025-15657">2025-15657</MenuItem>
          </TextField>

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
