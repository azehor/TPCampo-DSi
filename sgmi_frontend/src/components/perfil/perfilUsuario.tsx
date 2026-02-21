import { useEffect, useState } from "react";
import { Card, CardContent, Typography, Box, CircularProgress, Button } from "@mui/material";
import { getPerfilUsuario } from "../../services/userService";
import type { UserProfile } from "../../models/user.model";
import CambiarContraseniaDialog from "./cambiarContraseniaDialog";
import "./perfilUsuario.css";

const PerfilUsuario = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openChangePassword, setOpenChangePassword] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await getPerfilUsuario();
      setProfile(data);
    } catch (err) {
      setError("Error al cargar el perfil");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!profile) {
    return <Typography>No se encontró el perfil</Typography>;
  }

  return (
    <>
      <Box sx={{ display: "flex", gap: 3, padding: 2 }}>
        {/* Información del usuario a la izquierda */}
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Mi Perfil
            </Typography>
            <Typography variant="body2" color="textSecondary">
              <strong>Email:</strong> {profile.email}
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              <strong>Rol:</strong> {profile.role}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="small"
              sx={{ mt: 2 }}
              onClick={() => setOpenChangePassword(true)}
            >
              Cambiar Contraseña
            </Button>
          </CardContent>
        </Card>

        {/* Información del personal a la derecha si es investigador */}
        {profile.investigador && profile.personal && (
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Datos del Investigador
              </Typography>
              <Typography variant="body2" color="textSecondary">
                <strong>Nombre:</strong> {profile.personal.nombre}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                <strong>Apellido:</strong> {profile.personal.apellido}
              </Typography>
            </CardContent>
          </Card>
        )}

        {/* Mensaje si no es investigador */}
        {!profile.investigador && (
          <Card sx={{ flex: 1, backgroundColor: "#f5f5f5" }}>
            <CardContent>
              <Typography variant="body2" color="textSecondary">
                No tienes un perfil de investigador asociado.
              </Typography>
            </CardContent>
          </Card>
        )}
      </Box>

      {/* Abrir dialog para cambiar contraseña */}
      <CambiarContraseniaDialog
        open={openChangePassword}
        onClose={() => setOpenChangePassword(false)}
      />
    </>
  );
};

export default PerfilUsuario;
