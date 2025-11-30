import React from "react";
import MemoriaAccordion from "./MemoriaAccordion";

const memorias = [
  { año: 2024, estado: "final" },
  { año: 2023, estado: "final" },
  { año: 2022, estado: "borrador" },
  { año: 2021, estado: "final" },
];

export default function GestionMemoriasPage() {
  return (
    <div style={{ padding: 24 }}>
      <h2>Gestión de Memorias - Grupo 1</h2>
      {memorias.map((memoria) => (
        <MemoriaAccordion key={memoria.año} memoria={memoria} />
      ))}
    </div>
  );
}
