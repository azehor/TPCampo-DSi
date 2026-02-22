import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Alert,
  CircularProgress,
  Box,
  Tooltip,
} from "@mui/material";
import RestoreIcon from "@mui/icons-material/Restore";
import { getMemoriasEliminadas, restaurarMemoria } from "../../services/memoriasService";
import { manejadorDeMensajes } from "../common/ManejadorDeMensajes";

interface MemoriasEliminadasDialogProps {
  open: boolean;
  onClose: () => void;
  grupoId: number;
  onRestore?: () => void;
}

interface MemoriaEliminada {
  id: number;
  anio: string;
  deleted_at: string;
}

export default function MemoriasEliminadasDialog({
  open,
  onClose,
  grupoId,
  onRestore,
}: MemoriasEliminadasDialogProps) {
  const [memorias, setMemorias] = useState<MemoriaEliminada[]>([]);
  const [loading, setLoading] = useState(false);
  const [restoringId, setRestoringId] = useState<number | null>(null);

  useEffect(() => {
    if (open) {
      cargarMemoriasEliminadas();
    }
  }, [open]);

  const cargarMemoriasEliminadas = async () => {
    setLoading(true);
    try {
      const res = await getMemoriasEliminadas(grupoId);
      setMemorias(res);
    } catch (err) {
      console.error("Error cargando memorias eliminadas:", err);
      manejadorDeMensajes({ tipo: "error", mensaje: "Error al cargar las memorias eliminadas" });
    } finally {
      setLoading(false);
    }
  };

  const handleRestaurarMemoria = async (memoriaId: number) => {
    setRestoringId(memoriaId);
    try {
      await restaurarMemoria(memoriaId);
      setMemorias(memorias.filter((m) => m.id !== memoriaId));
      onRestore?.();
    } catch (err) {
      console.error("Error recuperando memoria:", err);
      manejadorDeMensajes({ tipo: "error", mensaje: "Error al recuperar la memoria" });
    } finally {
      setRestoringId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Memorias Eliminadas</DialogTitle>
      <DialogContent>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
            <CircularProgress />
          </Box>
        ) : memorias.length === 0 ? (
          <Alert severity="info">
            No hay memorias eliminadas para este grupo.
          </Alert>
        ) : (
          <List>
            {memorias.map((memoria) => (
              <ListItem key={memoria.id}>
                <ListItemText
                  primary={`Año ${memoria.anio}`}
                  secondary={`Eliminada: ${formatDate(memoria.deleted_at)}`}
                />
                <ListItemSecondaryAction>
                  <Tooltip title="Recuperar memoria">
                    <IconButton
                      edge="end"
                      color="primary"
                      onClick={() => handleRestaurarMemoria(memoria.id)}
                      disabled={restoringId === memoria.id}
                    >
                      {restoringId === memoria.id ? (
                        <CircularProgress size={24} />
                      ) : (
                        <RestoreIcon />
                      )}
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
}
