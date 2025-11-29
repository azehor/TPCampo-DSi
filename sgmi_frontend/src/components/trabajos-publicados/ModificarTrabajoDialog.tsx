import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  MenuItem,
  Box,
  Stack,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";

type TipoTrabajo = "revista" | "libro" | "divulgacion";

interface TrabajoData {
  tipo: TipoTrabajo;
  codigo: string;
  titulo: string;
  grupo: string;
  revista?: string;
  capitulo?: string;
  nombreArticulo?: string;
  libro?: string;
  articulo?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: TrabajoData) => void;
  initialData: TrabajoData;
}

export default function ModificarTrabajoDialog({
  open,
  onClose,
  onConfirm,
  initialData,
}: Props) {
  const [form, setForm] = React.useState<TrabajoData>({
    ...initialData,
    revista:
      initialData.tipo === "libro"
        ? initialData.libro ?? ""
        : initialData.tipo === "revista"
        ? initialData.revista ?? ""
        : "",
    nombreArticulo:
      initialData.tipo === "divulgacion"
        ? initialData.articulo ?? ""
        : initialData.nombreArticulo ?? "",
  });

  React.useEffect(() => {
    setForm({
      ...initialData,
      revista:
        initialData.tipo === "libro"
          ? initialData.libro ?? ""
          : initialData.tipo === "revista"
          ? initialData.revista ?? ""
          : "",
      nombreArticulo:
        initialData.tipo === "divulgacion"
          ? initialData.articulo ?? ""
          : initialData.nombreArticulo ?? "",
    });
  }, [initialData]);

  const handleChange =
    (field: keyof TrabajoData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm({ ...form, [field]: e.target.value });
    };

  const handleConfirm = () => {
    const camposBase = form.codigo && form.titulo && form.grupo;
    const camposRevista = form.tipo === "revista" && form.revista;
    const camposLibro = form.tipo === "libro" && form.revista && form.capitulo;
    const camposDivulgacion =
      form.tipo === "divulgacion" && form.nombreArticulo;

    if (camposBase && (camposRevista || camposLibro || camposDivulgacion)) {
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
        Modificar Trabajo
      </DialogTitle>

      <DialogContent dividers sx={{ px: 4, pt: 2 }}>
        <Stack spacing={3}>
          <TextField
            label="Tipo de Trabajo"
            value={form.tipo}
            onChange={handleChange("tipo")}
            fullWidth
            select
          >
            <MenuItem value="revista">Trabajo en Revista</MenuItem>
            <MenuItem value="libro">Publicación en Libro o Capítulo</MenuItem>
            <MenuItem value="divulgacion">Artículo de Divulgación</MenuItem>
          </TextField>

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
            label="Código del Trabajo"
            value={form.codigo}
            onChange={handleChange("codigo")}
            fullWidth
          />

          <TextField
            label="Título del Trabajo"
            value={form.titulo}
            onChange={handleChange("titulo")}
            fullWidth
          />

          {form.tipo === "revista" && (
            <TextField
              label="Revista"
              value={form.revista ?? ""}
              onChange={handleChange("revista")}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" title="Buscar revista">
                      <SearchIcon />
                    </IconButton>
                    <IconButton size="small" title="Añadir revista">
                      <AddIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}

          {form.tipo === "libro" && (
            <>
              <TextField
                label="Título del Libro"
                value={form.revista ?? ""}
                onChange={handleChange("revista")}
                fullWidth
              />
              <TextField
                label="Capítulo"
                value={form.capitulo ?? ""}
                onChange={handleChange("capitulo")}
                fullWidth
              />
            </>
          )}

          {form.tipo === "divulgacion" && (
            <TextField
              label="Nombre del Artículo"
              value={form.nombreArticulo ?? ""}
              onChange={handleChange("nombreArticulo")}
              fullWidth
            />
          )}
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
