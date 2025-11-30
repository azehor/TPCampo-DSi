import { api } from "./api";

export async function getTrabajosEnRevista(page = 0, limit = 10) {
  const response = await api.get("/api/trabajo_en_revista", {
    params: { page, limit }
  });

  return response.data;
}

export async function deleteTrabajoEnRevista({ id }: { id: number; }): Promise<void> {
  await api.delete(`/api/trabajo_en_revista/${id}`)
}

export async function crearTrabajoEnRevista(data: {
  codigo: string;
  titulo: string;
  grupo_de_investigacion_id: number;
  revista_id: number
}) {
  const body = {
    trabajo_en_revista: {
      codigo: data.codigo,
      titulo: data.titulo,
      grupo_de_investigacion_id: data.grupo_de_investigacion_id,
      revista_id: data.revista_id,
      
    }
  };

  const res = await api.post("/api/trabajo_en_revista", body);
  return res.data;
}

export async function updateTrabajoEnRevista(id: number, data: {
  codigo: string;
  titulo: string;
  grupo_de_investigacion_id: number;
  revista_id: number;
}) {
  const body = {
    trabajo_en_revista: data
  };

  const res = await api.put(`/api/trabajo_en_revista/${id}`, body);
  return res.data;
}