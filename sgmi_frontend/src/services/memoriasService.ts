import { api } from "./api";


export async function createMemoria(grupoId: number, anio: number) {
  const res = await api.post("/api/memorias", {
    memoria: {
      anio,
      grupo_de_investigacion_id: grupoId,
    },
  });
  return res.data;
}

// GET
export async function getMemorias(grupo_id?: number) {
  const res = await api.get("/api/memorias", {
    params: grupo_id ? { grupo: grupo_id } : {},
  });
  return res.data;
}

export async function getMemoria(id: number) {
  const res = await api.get(`/api/memorias/${id}`);
  return res.data;
}

export async function getPatentesPorMemoria(id: number) {
  const res = await api.get(`/api/memorias/${id}/patentes`);
  return res.data;
}

export async function getTrabajosEnRevistaPorMemoria(id: number) {
  const res = await api.get(`/api/memorias/${id}/trabajos_en_revista`);
  return res.data;
}

export async function getPublicacionesEnLibroPorMemoria(id: number) {
  const res = await api.get(`/api/memorias/${id}/publicaciones_en_libro`);
  return res.data;
}

export async function getArticulosDivulgacionPorMemoria(id: number) {
  const res = await api.get(`/api/memorias/${id}/articulos_de_divulgacion`);
  return res.data;
}

// ADD
export async function addPatenteToMemoria(memoriaId: number, patenteId: number) {
  const res = await api.post(`/api/memorias/${memoriaId}/patentes/${patenteId}`);
  return res.data;
}

export async function addTrabajoRevistaToMemoria(memoriaId: number, trabajoId: number) {
  const res = await api.post(`/api/memorias/${memoriaId}/trabajo_en_revista/${trabajoId}`);
  return res.data;
}

export async function addPublicacionLibroToMemoria(memoriaId: number, publicacionId: number) {
  const res = await api.post(`/api/memorias/${memoriaId}/publicacion_en_libros/${publicacionId}`);
  return res.data;
}

export async function addArticuloDivulgacionToMemoria(memoriaId: number, articuloId: number) {
  const res = await api.post(`/api/memorias/${memoriaId}/articulo_de_divulgacions/${articuloId}`);
  return res.data;
}


// REMOVE
export async function removePatenteFromMemoria(memoriaId: number, patenteId: number) {
  await api.delete(`/api/memorias/${memoriaId}/patentes/${patenteId}`);
}

export async function removeTrabajoRevistaFromMemoria(memoriaId: number, trabajoId: number) {
  await api.delete(`/api/memorias/${memoriaId}/trabajo_en_revista/${trabajoId}`);
}

export async function removePublicacionLibroFromMemoria(memoriaId: number, publicacionId: number) {
  await api.delete(`/api/memorias/${memoriaId}/publicacion_en_libros/${publicacionId}`);
}

export async function removeArticuloDivulgacionFromMemoria(memoriaId: number, articuloId: number) {
  await api.delete(`/api/memorias/${memoriaId}/articulo_de_divulgacions/${articuloId}`);
}
