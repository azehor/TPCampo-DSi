import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import { deleteMemoria } from "../../services/memoriasService";
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

export default function MemoriaAccordion({ memoria, onDelete }: MemoriaAcordionProps) {
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
      onDelete?.();
    } catch (err) {
      console.error("Error eliminando memoria:", err);
      manejadorDeMensajes({ tipo: "error", mensaje: "Error al eliminar la memoria" });
    } finally {
      setIsDeleting(false);
    }
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
          </Box>
        </AccordionSummary>
        <AccordionDetails>
        {secciones.map((titulo, index) => (
          <SeccionAccordion key={index} titulo={titulo}  memoriaId={memoria.id} />
        ))}
      </AccordionDetails>
      </Accordion>
    </>
  );
}