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
  finalizada,
}: {
  titulo: string;
  memoriaId: number;
  finalizada: boolean
}) {
  const esActividades = titulo.startsWith("II.");

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>{titulo}</Typography>
      </AccordionSummary>

      <AccordionDetails>
        {esActividades ? (
          <SeccionActividad memoriaId={memoriaId} finalizada={finalizada}/>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Contenido no disponible aún.
          </Typography>
        )}
      </AccordionDetails>
    </Accordion>
  );
}
