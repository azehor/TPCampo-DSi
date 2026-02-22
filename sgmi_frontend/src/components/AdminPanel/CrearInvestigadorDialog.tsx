import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stepper,
  Step,
  StepLabel,
  TextField,
  MenuItem,
  Box,
  Alert,
} from "@mui/material";
import type { User } from "../../models/user.model";
import * as userService from "../../services/userService";
import * as personalService from "../../services/personalService";
import * as investigadorService from "../../services/investigadorService";
import type { Personal } from "../../models/personal.model";
import { manejadorDeMensajes } from "../common/ManejadorDeMensajes";

interface CreateInvestigadorDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const DEDICACION_OPTIONS = ["Simple", "Exclusiva", "Semiexclusiva"];

export function CreateInvestigadorDialog({
  open,
  onClose,
  onSuccess,
}: CreateInvestigadorDialogProps) {
  const [pasoActivo, setPasoActivo] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Usuario
  const [userForm, setUserForm] = useState({ email: "", password: "" });
  const [userCreated, setUserCreated] = useState<User | null>(null);

  // Personal
  const [personalForm, setPersonalForm] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    horas_semanales: 40,
    object_type: "Investigador",
  });
  const [personalCreated, setPersonalCreated] = useState<Personal | null>(null);

  // Investigador
  const [investigadorForm, setInvestigadorForm] = useState({
    categoria: "",
    dedicacion: "Simple",
  });

  const pasos = ["Usuario", "Personal", "Investigador"];

  const handleCreateUser = async () => {
    if (!userForm.email || !userForm.password) {
      setError("Email y contraseña son requeridos");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await userService.crearUsuario(userForm.email, userForm.password);
      const user = response.user || response;
      setUserCreated(user);
      setPasoActivo(1);
    } catch (err: any) {
      // Capturar errores del servidor
      let errorMessage = err.message;
      if (err.response?.data?.email) {
        errorMessage = `Email: ${err.response.data.email.join(", ")}`;
      } else if (err.response?.data) {
        // Extraer primer error disponible
        const firstError = Object.values(err.response.data)[0];
        if (Array.isArray(firstError)) {
          errorMessage = firstError.join(", ");
        }
      }
      manejadorDeMensajes({ tipo: "error", mensaje: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePersonal = async () => {
    if (!personalForm.nombre || !personalForm.apellido) {
      setError("Nombre y apellido son requeridos");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await personalService.createPersonal({
        nombre: personalForm.nombre,
        apellido: personalForm.apellido,
        dni: personalForm.dni,
        horas_semanales: personalForm.horas_semanales,
        object_type: personalForm.object_type,
      });
      const personal = response.personal || response;
      setPersonalCreated(personal);
      setPasoActivo(2);
    } catch (err: any) {
      let errorMessage = err.message;
      if (err.response?.data) {
        // Extraer primeros errores de validación
        const errors = Object.entries(err.response.data)
          .map(([key, value]) => {
            if (Array.isArray(value)) {
              return `${key}: ${value.join(", ")}`;
            }
            return `${key}: ${value}`;
          })
          .slice(0, 2);
        errorMessage = errors.join("\n");
      }
      manejadorDeMensajes({ tipo: "error", mensaje: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInvestigador = async () => {
    if (!investigadorForm.categoria) {
      setError("Categoría es requerida");
      return;
    }

    if (!personalCreated?.id || !userCreated?.id) {
      setError("Debe crear Usuario y Personal primero");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await investigadorService.createInvestigador({
        personal_id: personalCreated.id,
        user_id: userCreated.id,
        categoria: investigadorForm.categoria,
        dedicacion: investigadorForm.dedicacion,
      });

      // Reset y cerrar
      resetForm();
      onClose();
      onSuccess?.();
    } catch (err: any) {
      let errorMessage = err.message;
      if (err.response?.data) {
        // Extraer primeros errores de validación
        const errors = Object.entries(err.response.data)
          .map(([key, value]) => {
            if (Array.isArray(value)) {
              return `${key}: ${value.join(", ")}`;
            }
            return `${key}: ${value}`;
          })
          .slice(0, 2);
        errorMessage = errors.join("\n");
      }
      manejadorDeMensajes({ tipo: "error", mensaje: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setPasoActivo(0);
    setError(null);
    setUserForm({ email: "", password: "" });
    setPersonalForm({ nombre: "", apellido: "", dni: "", horas_semanales: 40, object_type: "Investigador" });
    setInvestigadorForm({ categoria: "", dedicacion: "Simple" });
    setUserCreated(null);
    setPersonalCreated(null);
  };

  useEffect(() => {
    if (open) {
      resetForm();
    }
  }, [open]);

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Crear Investigador</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }} component="form" autoComplete="off">
          <Stepper activeStep={pasoActivo} sx={{ mb: 3 }}>
            {pasos.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          {/* USUARIO */}
          {pasoActivo === 0 && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="Email"
                type="email"
                name="new-user-email"
                autoComplete="new-email"
                value={userForm.email}
                onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                fullWidth
              />
              <TextField
                label="Contraseña"
                type="password"
                name="new-user-password"
                autoComplete="new-password"
                value={userForm.password}
                onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                fullWidth
                placeholder="••••••••"
              />
            </Box>
          )}

          {/* PERSONAL */}
          {pasoActivo === 1 && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="Nombre"
                value={personalForm.nombre}
                onChange={(e) => setPersonalForm({ ...personalForm, nombre: e.target.value })}
                fullWidth
                placeholder="Juan"
              />
              <TextField
                label="Apellido"
                value={personalForm.apellido}
                onChange={(e) => setPersonalForm({ ...personalForm, apellido: e.target.value })}
                fullWidth
                placeholder="Pérez"
              />
              <TextField
                label="DNI"
                value={personalForm.dni}
                onChange={(e) =>
                  setPersonalForm({
                    ...personalForm,
                    dni: e.target.value.replace(/\D/g, "").slice(0, 10),
                  })
                }
                inputProps={{ maxLength: 8, inputMode: "numeric", pattern: "[0-9]*" }}
                fullWidth
              />
              <TextField
                label="Horas Semanales"
                type="number"
                value={personalForm.horas_semanales}
                onChange={(e) =>
                  setPersonalForm({
                    ...personalForm,
                    horas_semanales: parseInt(e.target.value),
                  })
                }
                fullWidth
              />
            </Box>
          )}

          {/* INVESTIGADOR */}
          {pasoActivo === 2 && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="Categoría"
                value={investigadorForm.categoria}
                onChange={(e) =>
                  setInvestigadorForm({ ...investigadorForm, categoria: e.target.value })
                }
                fullWidth
              />
              <TextField
                label="Dedicación"
                select
                value={investigadorForm.dedicacion}
                onChange={(e) =>
                  setInvestigadorForm({ ...investigadorForm, dedicacion: e.target.value })
                }
                fullWidth
              >
                {DEDICACION_OPTIONS.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        {pasoActivo > 0 && (
          <Button onClick={() => setPasoActivo(pasoActivo - 1)} disabled={loading}>
            Atrás
          </Button>
        )}
        <Button
          onClick={
            pasoActivo === 0
              ? handleCreateUser
              : pasoActivo === 1
                ? handleCreatePersonal
                : handleCreateInvestigador
          }
          variant="contained"
          disabled={loading}
        >
          {loading ? "Creando..." : pasoActivo === 2 ? "Finalizar" : "Siguiente"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
