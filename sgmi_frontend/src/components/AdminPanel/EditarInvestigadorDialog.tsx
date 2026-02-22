import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Stepper,
  Step,
  StepLabel,
  Alert,
  CircularProgress,
  MenuItem,
} from "@mui/material";
import type { User } from "../../models/user.model";
import type { Personal } from "../../models/personal.model";
import type { Investigador } from "../../models/investigador.model";
import * as userService from "../../services/userService";
import * as personalService from "../../services/personalService";
import * as investigadorService from "../../services/investigadorService";
import { manejadorDeMensajes } from "../common/ManejadorDeMensajes";

interface EditInvestigadorDialogProps {
  open: boolean;
  investigador: (Investigador & { user?: User; personal?: Personal }) | null;
  onClose: () => void;
  onSuccess: () => void;
}

const pasos = ["Usuario", "Personal", "Investigador"];
const TIPOS_DEDICACION = ["Simple", "Exclusiva", "Semiexclusiva"];

export function EditInvestigadorDialog({
  open,
  investigador,
  onClose,
  onSuccess,
}: EditInvestigadorDialogProps) {
  const [pasoActivo, setPasoActivo] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [userForm, setUserForm] = useState({
    email: "",
  });

  const [personalForm, setPersonalForm] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    horas_semanales: "",
  });

  const [investigadorForm, setInvestigadorForm] = useState({
    categoria: "",
    dedicacion: "",
  });

  useEffect(() => {
    if (investigador && open) {
      setUserForm({
        email: investigador.user?.email || "",
      });
      setPersonalForm({
        nombre: investigador.personal?.nombre || "",
        apellido: investigador.personal?.apellido || "",
        dni: investigador.personal?.dni || "",
        horas_semanales: investigador.personal?.horas_semanales?.toString() || "",
      });
      setInvestigadorForm({
        categoria: investigador.categoria || "",
        dedicacion: investigador.dedicacion,
      });
      setPasoActivo(0);
      setError(null);
    }
  }, [investigador, open]);

  const handleNext = async () => {
    setError(null);

    if (pasoActivo === 0) {
      // Validar Usuario
      if (!userForm.email.trim()) {
        setError("El email es obligatorio");
        return;
      }
      // Actualizar Usuario
      if (investigador?.user?.id) {
        try {
          setLoading(true);
          await userService.editarUsuario(investigador.user.id, {
            email: userForm.email,
          });
        } catch (err: any) {
          let errorMessage = err.message;
          if (err.response?.data?.email) {
            errorMessage = `Email: ${err.response.data.email.join(", ")}`;
          } else if (err.response?.data) {
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
          setLoading(false);
          return;
        }
      }
    } else if (pasoActivo === 1) {
      // Validar Personal
      if (!personalForm.nombre.trim() || !personalForm.apellido.trim()) {
        setError("Nombre y Apellido son obligatorios");
        return;
      }
      // Actualizar Personal
      if (investigador?.personal?.id) {
        try {
          setLoading(true);
          await personalService.updatePersonal(investigador.personal.id, {
            nombre: personalForm.nombre,
            apellido: personalForm.apellido,
            dni: personalForm.dni,
            horas_semanales: personalForm.horas_semanales
              ? parseInt(personalForm.horas_semanales)
              : undefined,
            object_type: "Investigador",
          });
        } catch (err: any) {
          let errorMessage = err.message;
          if (err.response?.data) {
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
          setLoading(false);
          return;
        }
      }
    } else if (pasoActivo === 2) {
      // Validar Investigador
      if (!investigadorForm.categoria.trim() || !investigadorForm.dedicacion.trim()) {
        setError("Categoría y Dedicación son obligatorias");
        return;
      }
      // Actualizar Investigador
      if (investigador?.id) {
        try {
          setLoading(true);
          await investigadorService.updateInvestigador(investigador.id, {
            categoria: investigadorForm.categoria,
            dedicacion: investigadorForm.dedicacion,
            personal_id: investigador.personal_id,
            user_id: investigador.user_id,
          });
          setLoading(false);
          onSuccess();
          onClose();
          return;
        } catch (err: any) {
          let errorMessage = err.message;
          if (err.response?.data) {
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
          setLoading(false);
          return;
        }
      }
    }

    setLoading(false);
    setPasoActivo((prev) => prev + 1);
  };

  const handleBack = () => {
    setPasoActivo((prev) => prev - 1);
    setError(null);
  };

  const handleClose = () => {
    if (!loading) {
      setPasoActivo(0);
      setError(null);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Editar Investigador</DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Box sx={{ mb: 3 }}>
          <Stepper activeStep={pasoActivo}>
            {pasos.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        )}

        {/* USUARIO */}
        {!loading && pasoActivo === 0 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Email"
              type="email"
              value={userForm.email}
              onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
              fullWidth
            />
          </Box>
        )}

        {/* PERSONAL */}
        {!loading && pasoActivo === 1 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Nombre"
              value={personalForm.nombre}
              onChange={(e) => setPersonalForm({ ...personalForm, nombre: e.target.value })}
              fullWidth
            />
            <TextField
              label="Apellido"
              value={personalForm.apellido}
              onChange={(e) => setPersonalForm({ ...personalForm, apellido: e.target.value })}
              fullWidth
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
              onChange={(e) => setPersonalForm({ ...personalForm, horas_semanales: e.target.value })}
              fullWidth
            />
          </Box>
        )}

        {/* INVESTIGADOR */}
        {!loading && pasoActivo === 2 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Categoría"
              value={investigadorForm.categoria}
              onChange={(e) => setInvestigadorForm({ ...investigadorForm, categoria: e.target.value })}
              fullWidth
            />
            <TextField
              label="Dedicación"
              select
              value={investigadorForm.dedicacion}
              onChange={(e) => setInvestigadorForm({ ...investigadorForm, dedicacion: e.target.value })}
              fullWidth
            >
              {TIPOS_DEDICACION.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        )}
      </DialogContent>

      {/* ACCIONES */}
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancelar
        </Button>
        {pasoActivo > 0 && (
          <Button onClick={handleBack} disabled={loading}>
            Atrás
          </Button>
        )}
        <Button
          onClick={handleNext}
          variant="contained"
          disabled={loading}
        >
          {pasoActivo === pasos.length - 1 ? "Guardar" : "Siguiente"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
