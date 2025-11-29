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

interface ExportarExcelData {
  grupo: string;
  memoria: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: ExportarExcelData) => void;
}

export default function ExportarExcelDialog({
  open,
  onClose,
  onConfirm,
}: Props) {
  const [form, setForm] = React.useState<ExportarExcelData>({
    grupo: "",
    memoria: "",
  });

  const handleChange =
    (field: keyof ExportarExcelData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm({ ...form, [field]: e.target.value });
    };

  const handleConfirm = () => {
    const { grupo, memoria } = form;
    if (grupo && memoria) {
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
        Exportar Excel
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
            label="Memoria"
            value={form.memoria}
            onChange={handleChange("memoria")}
            fullWidth
            select
          >
            <MenuItem value="2023">2023</MenuItem>
            <MenuItem value="2024">2024</MenuItem>
            <MenuItem value="2025">2025</MenuItem>
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
