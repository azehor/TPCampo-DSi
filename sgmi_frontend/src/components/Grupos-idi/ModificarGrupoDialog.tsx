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

interface GrupoData {
  nombre: string;
  sigla: string;
  correo: string;
  facultad: string;
  director: string;
  vicedirector: string;
  objetivo: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: GrupoData) => void;
  initialData: GrupoData;
}

export default function ModificarGrupoDialog({
  open,
  onClose,
  onConfirm,
  initialData,
}: Props) {
  const [form, setForm] = React.useState<GrupoData>(initialData);

  React.useEffect(() => {
    setForm(initialData);
  }, [initialData]);

  const handleChange =
    (field: keyof GrupoData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm({ ...form, [field]: e.target.value });
    };

  const handleConfirm = () => {
    const { nombre, correo, director, objetivo, facultad, vicedirector } = form;
    if (nombre && correo && director && objetivo && facultad && vicedirector) {
      onConfirm(form);
    } else {
      alert("Por favor completá todos los campos obligatorios.");
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
        Modificar Grupo
      </DialogTitle>

      <DialogContent dividers sx={{ px: 4, pt: 2 }}>
        <Stack spacing={3}>
          <TextField
            label="Nombre del Grupo*"
            value={form.nombre}
            onChange={handleChange("nombre")}
            fullWidth
          />

          <TextField
            label="Sigla"
            value={form.sigla}
            onChange={handleChange("sigla")}
            fullWidth
          />

          <TextField
            label="Correo electrónico*"
            value={form.correo}
            onChange={handleChange("correo")}
            fullWidth
            type="email"
          />

          <TextField
            label="Facultad Regional*"
            value={form.facultad}
            onChange={handleChange("facultad")}
            fullWidth
          />

          <TextField
            label="Director*"
            value={form.director}
            onChange={handleChange("director")}
            fullWidth
            select
          >
            <MenuItem value="director1">Director 1</MenuItem>
            <MenuItem value="director2">Director 2</MenuItem>
            <MenuItem value="director3">Director 3</MenuItem>
          </TextField>

          <TextField
            label="Vicedirector/a*"
            value={form.vicedirector}
            onChange={handleChange("vicedirector")}
            fullWidth
            select
          >
            <MenuItem value="vicedirector1">Vicedirector 1</MenuItem>
            <MenuItem value="vicedirector2">Vicedirector 2</MenuItem>
            <MenuItem value="vicedirector3">Vicedirector 3</MenuItem>
          </TextField>

          <TextField
            label="Objetivo*"
            value={form.objetivo}
            onChange={handleChange("objetivo")}
            fullWidth
            multiline
            rows={3}
            inputProps={{ maxLength: 200 }}
            helperText={`${form.objetivo.length}/200 caracteres`}
            FormHelperTextProps={{ sx: { textAlign: "right", mt: 0.5 } }}
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
          >
            Confirmar
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
