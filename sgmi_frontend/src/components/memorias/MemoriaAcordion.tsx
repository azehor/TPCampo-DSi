import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  IconButton,
  Tooltip,
  Button
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import { deleteMemoria, finalizeMemoria } from "../../services/memoriasService";
import SeccionAccordion from "./SeccionAcordion";
import { manejadorDeMensajes, mostrarConfirmacion } from "../common/ManejadorDeMensajes";

const secciones = [
  "I. Administración",
  "II. Actividades de I+D+i",
  "III. Actividades Docencia",
  "IV. Vinculación con el Medio Socio Productivo",
  "V. Informe sobre Rendición General de Cuentas",
  "VI. Programa de actividades para 2025",
];

interface MemoriaAcordionProps {
  memoria: any;
  onDelete?: () => void;
}

export default function MemoriaAccordion({ memoria, onDelete, onFinalize }: MemoriaAcordionProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = async () => {
    const confirmado = await mostrarConfirmacion({
      mensaje: `¿Está seguro de que desea eliminar la memoria del año ${memoria.anio}?`,
      textoConfirmar: "Eliminar",
    });

    if (!confirmado) return;

    setIsDeleting(true);
    try {
      await deleteMemoria(memoria.id);
      manejadorDeMensajes({ tipo: "exito", mensaje: "Memoria eliminada correctamente." });
      onDelete?.();
    } catch (err) {
      console.error("Error eliminando memoria:", err);
      manejadorDeMensajes({ tipo: "error", mensaje: "Error al eliminar la memoria" });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFinalizeClick = async () => {
    try {
      await finalizeMemoria(memoria.id);
      onFinalize?.();
    } catch (err) {
      console.error("Error finalizando memoria:", err)
      manejadorDeMensajes({ tipo: "error", mensaje: "Error al finalizar la memoria" })
    }
  }

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
    <>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              pr: 2,
            }}
          >
            <Typography>{memoria.anio}</Typography>
            {memoria.finalized ? (
              <Typography>Memoria finalizada el {formatDate(memoria.updated_at)}, por {
                  (memoria.finalized_by?.investigador?.personal?.nombre || 'Administrador') + ' ' +
                  (memoria.finalized_by?.investigador?.personal?.apellido || '')}</Typography>
            ) : (
            <div>
              <Button
                variant="contained"
                onClick={(e) => {
                  e.stopPropagation();
                  handleFinalizeClick();
                }}
                sx={{ textTransform: "none" }}
              >
                Finalizar memoria
              </Button>
            <Tooltip title="Eliminar memoria">
              <IconButton
                size="small"
                color="error"
                disabled={isDeleting}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteClick();
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
            </div>
            )}
          </Box>
        </AccordionSummary>
        <AccordionDetails>
        {secciones.map((titulo, index) => (
          <SeccionAccordion key={index} titulo={titulo}  memoriaId={memoria.id} finalizada={memoria.finalized}/>
        ))}
      </AccordionDetails>
      </Accordion>
    </>
  );
}
