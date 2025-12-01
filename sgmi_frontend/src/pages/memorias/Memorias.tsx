import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { getMemorias, createMemoria } from "../../services/memoriasService";
import MemoriaAccordion from "../../components/memorias/MemoriaAcordion";
import { Button } from "@mui/material";
import NuevaMemoriaDialog from "../../components/memorias/NuevaMemoriaDialog";

interface Memoria {
  id: number;
  anio: number;
}

export default function Memorias() {
  const state = useLocation().state || {};
  const grupoId = state.grupo.id;
  console.log(state)

  const [memorias, setMemorias] = useState<Memoria[]>([]);
  const [openDialog, setOpenDialog] = useState(false);

  async function cargarMemorias() {
    if (!grupoId) return;

    const res = await getMemorias(grupoId);
    setMemorias(res);
  }

  // CREAR NUEVA MEMORIA
  async function handleCrearMemoria(anio: number) {
    try {
      await createMemoria(grupoId, anio);
      await cargarMemorias();
      setOpenDialog(false);
    } catch (err) {
      console.error("Error creando memoria:", err);
      alert("Error creando memoria");
    }
  }

  useEffect(() => {
    cargarMemorias();
  }, []);

  return (
    <div style={{ padding: 24 }}>
       <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
      }}
    >
      <h2 style={{ margin: 0 }}>
        Gestión de Memorias - Grupo {state.grupo.sigla}
      </h2>

      <Button
        variant="contained"
        onClick={() => setOpenDialog(true)}
        sx={{ textTransform: "none" }}
      >
        Añadir memoria
      </Button>
    </div>


      {memorias.map((memoria) => (
        <MemoriaAccordion key={memoria.id} memoria={memoria} />
      ))}

      <NuevaMemoriaDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={handleCrearMemoria}
      />
    </div>
  );
}
