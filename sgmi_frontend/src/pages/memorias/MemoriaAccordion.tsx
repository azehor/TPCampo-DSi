import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SeccionAccordion from "./SeccionAccordion";

const secciones = [
  "I. Administración",
  "II. Actividades de I+D+i",
  "III. Actividades Docencia",
  "IV. Vinculación con el Medio Socio Productivo",
  "V. Informe sobre Rendición General de Cuentas",
  "VI. Programa de actividades para 2025",
];

export default function MemoriaAccordion({ memoria }: { memoria: any }) {
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>
          {memoria.año} {memoria.estado === "borrador" ? "(borrador)" : ""}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {secciones.map((titulo, index) => (
          <SeccionAccordion key={index} titulo={titulo} />
        ))}
      </AccordionDetails>
    </Accordion>
  );
}
