import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  CircularProgress,
  IconButton,
  TablePagination,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import type { User } from "../models/user.model";
import type { Personal } from "../models/personal.model";
import type { Investigador } from "../models/investigador.model";
import * as investigadorService from "../services/investigadorService";
import { CreateInvestigadorDialog } from "../components/AdminPanel/CrearInvestigadorDialog";
import { EditInvestigadorDialog } from "../components/AdminPanel/EditarInvestigadorDialog";
import { mostrarConfirmacion, manejadorDeMensajes } from "../components/common/ManejadorDeMensajes";

export function AdminPanel() {
  const [investigadores, setInvestigadores] = useState<
    (Investigador & { user?: User; personal?: Personal })[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalInvestigadores, setTotalInvestigadores] = useState(0);
  const [selectedInvestigador, setSelectedInvestigador] = useState<
    (Investigador & { user?: User; personal?: Personal }) | null
  >(null);

  useEffect(() => {
    fetchInvestigadores();
  }, [page, rowsPerPage]);

  const fetchInvestigadores = async () => {
    setLoading(true);
    try {
      const response = await investigadorService.getInvestigadores(page, rowsPerPage);
      setInvestigadores(response.content || []);
      setTotalInvestigadores(response.metadata?.total_count || 0);
    } catch (err: any) {
      manejadorDeMensajes({ tipo: "error", mensaje: `Error al cargar investigadores: ${err.message}` });
    } finally {
      setLoading(false);
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };


  const handleDeleteClick = async (investigador: Investigador & { user?: User; personal?: Personal }) => {
    setSelectedInvestigador(investigador);

    const confirmado = await mostrarConfirmacion({
      mensaje: `¿Está seguro de que desea eliminar a ${investigador.personal?.nombre ?? ""} ${investigador.personal?.apellido ?? ""}?`,
      textoConfirmar: "Eliminar",
    });

    if (!confirmado) {
      setSelectedInvestigador(null);
      return;
    }

    await handleDeleteConfirm(investigador.id);
  };

  const handleEditClick = (investigador: Investigador & { user?: User; personal?: Personal }) => {
    setSelectedInvestigador(investigador);
    setOpenEditDialog(true);
  };

  const handleDeleteConfirm = async (investigadorId?: number) => {
    const id = investigadorId ?? selectedInvestigador?.id;
    if (!id) return;

    try {
      await investigadorService.deleteInvestigador(id);
      setSelectedInvestigador(null);
      fetchInvestigadores();
      manejadorDeMensajes({ tipo: "exito", mensaje: "Investigador eliminado correctamente." });
    } catch (err: any) {
      manejadorDeMensajes({ tipo: "error", mensaje: `Error al eliminar el investigador: ${err.message}` });
    }
  };

  const handleCreateSuccess = () => {
    setPage(0);
    fetchInvestigadores();
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <h1>Panel de Administración - Gestion de Usuarios</h1>
        <Button
          variant="contained"
          color="success"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Crear Investigador
        </Button>
      </Box>

      {loading ? (
        <Paper>
          <Box
            sx={{
              minHeight: "320px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress size={56} />
          </Box>
        </Paper>
      ) : investigadores.length === 0 ? (
        <Alert severity="info">No hay investigadores registrados aún.</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table
            size="small"
            sx={{
              "& .MuiTableCell-root": {
                py: 0.75,
                px: 1.25,
                fontSize: "0.875rem",
              },
            }}
          >
            <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
              <TableRow>
                <TableCell><strong>Email (Usuario)</strong></TableCell>
                <TableCell><strong>Nombre</strong></TableCell>
                <TableCell><strong>Apellido</strong></TableCell>
                <TableCell><strong>DNI</strong></TableCell>
                <TableCell><strong>Categoría</strong></TableCell>
                <TableCell><strong>Dedicación</strong></TableCell>
                <TableCell><strong>Horas Semanales</strong></TableCell>
                <TableCell><strong>Acciones</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {investigadores.map((investigador) => (
                <TableRow key={investigador.id} hover>
                  <TableCell>{investigador.user?.email || "-"}</TableCell>
                  <TableCell>{investigador.personal?.nombre || "-"}</TableCell>
                  <TableCell>{investigador.personal?.apellido || "-"}</TableCell>
                  <TableCell>{investigador.personal?.dni || "-"}</TableCell>
                  <TableCell>{investigador.categoria}</TableCell>
                  <TableCell>{investigador.dedicacion}</TableCell>
                  <TableCell>{investigador.personal?.horas_semanales || "-"}</TableCell>
                  <TableCell>
                    <IconButton 
                      size="small" 
                      color="primary" 
                      title="Editar"
                      onClick={() => handleEditClick(investigador)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteClick(investigador)}
                      title="Eliminar"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <TablePagination
        component="div"
        count={totalInvestigadores}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50]}
        labelRowsPerPage="Filas por página"
      />

      {/* Dialog de edición */}
      <EditInvestigadorDialog
        open={openEditDialog}
        investigador={selectedInvestigador}
        onClose={() => {
          setOpenEditDialog(false);
          setSelectedInvestigador(null);
        }}
        onSuccess={() => {
          fetchInvestigadores();
          manejadorDeMensajes({ tipo: "exito", mensaje: "Investigador modificado correctamente." });
        }}
      />

      <CreateInvestigadorDialog
        open={openDialog}
        onClose={handleDialogClose}
        onSuccess={() => {
          handleCreateSuccess();
          manejadorDeMensajes({ tipo: "exito", mensaje: "Investigador creado correctamente." });
        }}
      />
    </Box>
  );
}
