import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SeccionActividad from "./SeccionActividad";

export default function SeccionAccordion({
  titulo,
  memoriaId,
}: {
  titulo: string;
  memoriaId: number;
}) {
  const esActividades = titulo.startsWith("II.");

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>{titulo}</Typography>
      </AccordionSummary>

      <AccordionDetails>
        {esActividades ? (
          <SeccionActividad memoriaId={memoriaId} />
        ) : (
          <Typography variant="body2" color="text.secondary">
            Contenido no disponible aún.
          </Typography>
        )}
      </AccordionDetails>
    </Accordion>
  );
}
