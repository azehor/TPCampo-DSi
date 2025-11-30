import { api } from "./api";

export async function getPatentes(page = 0, limit = 10) {
  const response = await api.get("/api/patentes", {
    params: {
      page,
      limit
    }
  });
  
  return response.data;
}


export async function deletePatente({ id }: { id: number; }): Promise<void> {
  await api.delete(`/api/patentes/${id}`)
}

export async function crearPatente(data: {
  identificador: string;
  titulo: string;
  tipo: string;
  grupo_de_investigacion_id: number;
}) {
  const body = {
    patente: {
      identificador: data.identificador,
      titulo: data.titulo,
      tipo: data.tipo,
      grupo_de_investigacion_id: data.grupo_de_investigacion_id,
    }
  };

  const res = await api.post("/api/patentes", body);
  return res.data;
}

export async function updatePatente(id: number, data: {
  identificador: string;
  titulo: string;
  tipo: string;
  grupo_de_investigacion_id: number;
}) {
  const body = {
    patente: data
  };

  const res = await api.put(`/api/patentes/${id}`, body);
  return res.data;
}