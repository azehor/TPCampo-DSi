import { api } from "./api";

export async function getArticulosDivulgacion(page = 0, limit = 10) {
  const response = await api.get("/api/articulo_de_divulgacions", {
    params: {
      page,
      limit
    }
  });

  return response.data;
}

export async function deleteArticulosDivulgacion(id:number) {
  await api.delete(`/api/articulo_de_divulgacions/${id}`)
}

export async function crearArticuloDeDivulgacion(data: {
  codigo: string;
  titulo: string;
  nombre: string; // nombre del artículo
  grupo_de_investigacion_id: number;
}) {
  const body = {
    articulo_de_divulgacion: {
      codigo: data.codigo,
      titulo: data.titulo,
      nombre: data.nombre,
      grupo_de_investigacion_id: data.grupo_de_investigacion_id,
    }
  };

  const res = await api.post("/api/articulo_de_divulgacions", body);
  return res.data;
}

export async function updateArticuloDeDivulgacion(id: number, data: {
  codigo: string;
  titulo: string;
  nombre: string;
  grupo_de_investigacion_id: number;
}) {
  const body = {
    articulo_de_divulgacion: data
  };

  const res = await api.put(`/api/articulo_de_divulgacions/${id}`, body);
  return res.data;
}