import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

interface Props {
  open: boolean;
  onClose: () => void;
  mensaje: string;
}

export default function ErrorDialog({ open, onClose, mensaje }: Props) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ textAlign: "center", pt: 3 }}>
        <ErrorOutlineIcon sx={{ fontSize: 48, color: "#d32f2f" }} />
      </DialogTitle>

      <DialogContent sx={{ textAlign: "center", pb: 1 }}>
        <Typography variant="h6" color="error" fontWeight={600}>
          {mensaje}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
        <Box>
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
            Confirmar
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
