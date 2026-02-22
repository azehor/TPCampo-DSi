import { useEffect, useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, Typography } from "@mui/material";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";

export type TipoFeedback = "alerta" | "error" | "exito";

export interface FeedbackPayload {
  tipo: TipoFeedback;
  mensaje: string;
  titulo?: string;
  textoConfirmar?: string;
  textoCancelar?: string;
  mostrarCancelar?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
}

const FEEDBACK_EVENT = "sgmi-feedback-event";

export function manejadorDeMensajes(payload: FeedbackPayload) {
  window.dispatchEvent(new CustomEvent<FeedbackPayload>(FEEDBACK_EVENT, { detail: payload }));
}

interface ConfirmacionOpciones {
  mensaje: string;
  titulo?: string;
  textoConfirmar?: string;
  textoCancelar?: string;
}

export function mostrarConfirmacion({
  mensaje,
  titulo,
  textoConfirmar = "Confirmar",
  textoCancelar = "Cancelar",
}: ConfirmacionOpciones) {
  return new Promise<boolean>((resolve) => {
    manejadorDeMensajes({
      tipo: "alerta",
      mensaje,
      titulo,
      textoConfirmar,
      textoCancelar,
      mostrarCancelar: true,
      onConfirm: () => resolve(true),
      onCancel: () => resolve(false),
    });
  });
}

export default function ManejadorDeMensajes() {
  const [feedback, setFeedback] = useState<FeedbackPayload | null>(null);

  useEffect(() => {
    const handler = (event: Event) => {
      const customEvent = event as CustomEvent<FeedbackPayload>;
      setFeedback(customEvent.detail);
    };

    window.addEventListener(FEEDBACK_EVENT, handler as EventListener);
    return () => window.removeEventListener(FEEDBACK_EVENT, handler as EventListener);
  }, []);

  if (!feedback) return null;

  const iconoPorTipo = {
    error: <CloseRoundedIcon sx={{ fontSize: 36, color: "#fff" }} />,
    exito: <CheckRoundedIcon sx={{ fontSize: 36, color: "#fff" }} />,
    alerta: <WarningAmberRoundedIcon sx={{ fontSize: 52, color: "#e0b400" }} />,
  };

  const fondoIconoPorTipo = {
    error: "#f44336",
    exito: "#31c62a",
    alerta: "transparent",
  };

  const tipo = feedback.tipo;

  const tituloMostrado = feedback?.titulo;
  const mensajeMostrado = feedback.mensaje;

  const cerrar = (accion: "confirmar" | "cancelar") => {
    if (accion === "confirmar") {
      feedback?.onConfirm?.();
    } else {
      feedback?.onCancel?.();
    }
    setFeedback(null);
  };

  const manejarCerrarDialog = (_event: object, reason: "backdropClick" | "escapeKeyDown") => {
    if (reason === "backdropClick" || reason === "escapeKeyDown") {
      cerrar("cancelar");
    }
  };

  return (
    <Dialog
      open
      onClose={manejarCerrarDialog}
      fullWidth
      maxWidth="sm"
      slotProps={{
        paper: {
          sx: {
            borderRadius: "14px",
            px: 2,
            py: 1,
          },
        },
      }}
    >
      <DialogContent sx={{ textAlign: "center", pt: 2.5, pb: 1.5 }}>
        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            backgroundColor: fondoIconoPorTipo[tipo],
            margin: "0 auto 14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {iconoPorTipo[tipo]}
        </Box>

        {tituloMostrado && (
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
            {tituloMostrado}
          </Typography>
        )}

        <Typography variant="h5" sx={{ fontSize: 26 }}>
          {mensajeMostrado}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", pb: 2.5, gap: 2 }}>
        {feedback?.mostrarCancelar && (
          <Button
            onClick={() => cerrar("cancelar")}
            variant="contained"
            sx={{
              backgroundColor: "#b8b8b8",
              color: "#fff",
              textTransform: "none",
              borderRadius: "14px",
              minWidth: 150,
              py: 0.8,
              fontSize: 24,
              "&:hover": {
                backgroundColor: "#a8a8a8",
              },
            }}
          >
            {feedback.textoCancelar || "Cancelar"}
          </Button>
        )}

        <Button
          onClick={() => cerrar("confirmar")}
          variant="contained"
          sx={{
            backgroundColor: "#005ecb",
            color: "#fff",
            textTransform: "none",
            borderRadius: "14px",
            minWidth: 150,
            py: 0.8,
            fontSize: 24,
            "&:hover": {
              backgroundColor: "#0a56b2",
            },
          }}
        >
          {feedback?.textoConfirmar || "Confirmar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
