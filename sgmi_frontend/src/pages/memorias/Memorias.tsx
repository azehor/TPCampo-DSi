import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { getMemorias, createMemoria } from "../../services/memoriasService";
import MemoriaAccordion from "../../components/memorias/MemoriaAcordion";
import { Button, Box, Alert, Tooltip } from "@mui/material";
import NuevaMemoriaDialog from "../../components/memorias/NuevaMemoriaDialog";
import MemoriasEliminadasDialog from "../../components/memorias/MemoriasEliminadasDialog";
import RestoreIcon from "@mui/icons-material/Restore";
import { useCurrentUser, isAdmin } from "../../hooks/useCurrentUser";

interface Memoria {
  id: number;
  anio: number;
}

export default function Memorias() {
  const state = useLocation().state || {};
  const grupoId = state.grupo.id;
  const { user } = useCurrentUser();

  const [memorias, setMemorias] = useState<Memoria[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeletedDialog, setOpenDeletedDialog] = useState(false);

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

  // ELIMINAR MEMORIA
  async function handleEliminarMemoria() {
    await cargarMemorias();
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

      <Box sx={{ display: "flex", gap: 2 }}>
        {isAdmin(user) && (
          <Tooltip title="Ver memorias eliminadas">
            <Button
              variant="outlined"
              startIcon={<RestoreIcon />}
              onClick={() => setOpenDeletedDialog(true)}
              sx={{ textTransform: "none" }}
            >
              Eliminadas
            </Button>
          </Tooltip>
        )}
        <Button
          variant="contained"
          onClick={() => setOpenDialog(true)}
          sx={{ textTransform: "none" }}
        >
          Añadir memoria
        </Button>
      </Box>
    </div>

    {memorias.length === 0 && (
      <Alert severity="info">
        No hay memorias creadas. Haga clic en "Añadir memoria" para crear una nueva.
      </Alert>
    )}

    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {memorias.map((memoria) => (
        <MemoriaAccordion 
          key={memoria.id} 
          memoria={memoria} 
          onDelete={handleEliminarMemoria}
        />
      ))}
    </Box>

      <NuevaMemoriaDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={handleCrearMemoria}
      />

      {isAdmin(user) && (
        <MemoriasEliminadasDialog
          open={openDeletedDialog}
          onClose={() => setOpenDeletedDialog(false)}
          grupoId={grupoId}
          onRestore={cargarMemorias}
        />
      )}
    </div>
  );
}
