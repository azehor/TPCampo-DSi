import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
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
  const [intentoEnvio, setIntentoEnvio] = useState(false);

  const handleChangePassword = async () => {
    setIntentoEnvio(true);
    if (!currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      return;
    }

    if (newPassword.length < 6) {
      manejadorDeMensajes({ tipo: "alerta", mensaje: "La nueva contraseña debe tener al menos 6 caracteres." });
      return;
    }

    if (currentPassword === newPassword) {
      manejadorDeMensajes({ tipo: "alerta", mensaje: "La nueva contraseña debe ser diferente a la actual." });
      return;
    }

    if (newPassword !== confirmPassword) {
      manejadorDeMensajes({ tipo: "alerta", mensaje: "Las nuevas contraseñas no coinciden." });
      return;
    }

    setLoading(true);

    try {
      const result = await cambiarContrasenia(currentPassword, newPassword);
      manejadorDeMensajes({ tipo: "exito", mensaje: result.message });
      
      // Limpiar fields después de 2 segundos
      setTimeout(() => {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setIntentoEnvio(false);
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
    setIntentoEnvio(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Cambiar Contraseña</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
        <TextField
          label="Contraseña Actual"
          required
          type="password"
          fullWidth
          sx={{ mt: 1 }}
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          error={intentoEnvio && !currentPassword.trim()}
          helperText={intentoEnvio && !currentPassword.trim() ? "Campo obligatorio" : ""}
          disabled={loading}
          variant="outlined"
        />

        <TextField
          label="Nueva Contraseña"
          required
          type="password"
          fullWidth
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          error={intentoEnvio && !newPassword.trim()}
          helperText={intentoEnvio && !newPassword.trim() ? "Campo obligatorio" : ""}
          disabled={loading}
          variant="outlined"
        />

        <TextField
          label="Confirmar Nueva Contraseña"
          required
          type="password"
          fullWidth
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={intentoEnvio && !confirmPassword.trim()}
          helperText={intentoEnvio && !confirmPassword.trim() ? "Campo obligatorio" : ""}
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
