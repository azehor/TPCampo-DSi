import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Alert,
} from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";

interface ConfirmarEliminacionProps {
  open: boolean;
  anio: string | number;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ConfirmarEliminacionMemoriaDialog({
  open,
  anio,
  onConfirm,
  onCancel,
  isLoading = false,
}: ConfirmarEliminacionProps) {
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <WarningIcon sx={{ color: "warning.main" }} />
        Confirmar Eliminación
      </DialogTitle>
      <DialogContent>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Esta acción marcará la memoria como eliminada, solo podrá ser
          recuperada por un administrador.
        </Alert>
        <Typography>
          ¿Está seguro de que desea eliminar la memoria del año <strong>{anio}</strong>?
        </Typography>
      </DialogContent>
      <DialogActions sx={{ padding: 2, gap: 1 }}>
        <Button onClick={onCancel} disabled={isLoading}>
          Cancelar
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          disabled={isLoading}
        >
          {isLoading ? "Eliminando..." : "Eliminar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
