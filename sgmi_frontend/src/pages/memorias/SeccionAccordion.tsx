import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SeccionActividades from "./SeccionActividades";

export default function SeccionAccordion({ titulo }: { titulo: string }) {
  const esActividades = titulo.startsWith("II");

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>{titulo}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {esActividades ? (
          <SeccionActividades />
        ) : (
          <Typography variant="body2" color="text.secondary">
            Contenido no disponible aún.
          </Typography>
        )}
      </AccordionDetails>
    </Accordion>
  );
}
