import { api } from "./api";

export async function getPublicaciones(page = 0, limit = 10) {
  const response = await api.get("/api/publicacion_en_libros", {
    params: {
      page,
      limit
    }
  });

  return response.data;
}


export async function deletePublicacionEnLibro({ id }: { id: number; }): Promise<void> {
  await api.delete(`/api/publicacion_en_libros/${id}`)
}

export async function crearPublicacionEnLibro(data: {
  codigo: string;
  titulo: string;
  libro: string;
  capitulo: string;
  grupo_de_investigacion_id: number;
}) {
  const body = {
    publicacion_en_libro: {
      codigo: data.codigo,
      titulo: data.titulo,
      libro: data.libro,
      capitulo: data.capitulo,
      grupo_de_investigacion_id: data.grupo_de_investigacion_id,
    }
  };

  const res = await api.post("/api/publicacion_en_libros", body);
  return res.data;
}

export async function updatePublicacionEnLibro(id: number, data: {
  codigo: string;
  titulo: string;
  libro: string;
  capitulo: string;
  grupo_de_investigacion_id: number;
}) {
  const body = {
    publicacion_en_libro: data
  };

  const res = await api.put(`/api/publicacion_en_libros/${id}`, body);
  return res.data;
}