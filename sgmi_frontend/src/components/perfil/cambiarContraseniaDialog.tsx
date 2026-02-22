import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
import { cambiarContrasenia } from "../../services/userService";
import { manejadorDeMensajes } from "../common/ManejadorDeMensajes";

interface CambiarContraseniaDialogProps {
  open: boolean;
  onClose: () => void;
}

const CambiarContraseniaDialog = ({ open, onClose }: CambiarContraseniaDialogProps) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChangePassword = async () => {
    // Validaciones
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Todos los campos son requeridos");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Las nuevas contraseñas no coinciden");
      return;
    }

    if (newPassword.length < 6) {
      setError("La nueva contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (currentPassword === newPassword) {
      setError("La nueva contraseña debe ser diferente a la actual");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await cambiarContrasenia(currentPassword, newPassword);
      manejadorDeMensajes({ tipo: "exito", mensaje: result.message });
      
      // Limpiar fields después de 2 segundos
      setTimeout(() => {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        onClose();
      }, 1500);
    } catch (err: any) {
      manejadorDeMensajes({
        tipo: "error",
        mensaje: err.response?.data?.error || "Error al cambiar la contraseña.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Cambiar Contraseña</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
        {error && <Alert severity="error">{error}</Alert>}

        <TextField
          label="Contraseña Actual"
          type="password"
          fullWidth
          sx={{ mt: 1 }}
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          disabled={loading}
          variant="outlined"
        />

        <TextField
          label="Nueva Contraseña"
          type="password"
          fullWidth
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          disabled={loading}
          variant="outlined"
        />

        <TextField
          label="Confirmar Nueva Contraseña"
          type="password"
          fullWidth
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={loading}
          variant="outlined"
        />
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button onClick={handleClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          onClick={handleChangePassword}
          variant="contained"
          disabled={loading}
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          {loading && <CircularProgress size={20} />}
          {loading ? "Cambiando..." : "Cambiar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CambiarContraseniaDialog;
