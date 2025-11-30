import { api } from "./api";

export async function getGrupos(page: number, amount: number, filterModel: any, sortModel: any) {
  const res = await api.get("api/grupo_de_investigacions", {params: {limit: amount, page}})
  
  return res.data
}


export async function getGruposList() {
  const res = await api.get("/api/grupo_de_investigacions");
  return res.data?.content ?? res.data ?? [];
}


export async function deleteGrupo({ id }: { id: number; }): Promise<void> {
  await api.delete(`/api/grupo_de_investigacions/${id}`)
}

export async function crearGrupo(data: {
  correo_electronico: string;
  integrantes:number;
  nombre: string;
  objetivos: string;
  sigla: string;
  facultad_regional_id: number;
  director_id: number;
  vicedirector_id: number;
}) {
  const body = {
    grupo_de_investigacion: {
      correo_electronico: data.correo_electronico,
      integrantes: data.integrantes,
      nombre: data.nombre,
      objetivos: data.objetivos,
      sigla: data.sigla,
      facultad_regional_id: data.facultad_regional_id,
      director_id: data.director_id,
      vicedirector_id: data.vicedirector_id,

    }
  };

  const res = await api.post("/api/grupo_de_investigacions", body);
  return res.data;
}

export async function updateGrupo(id: number, data: {
  correo_electronico: string;
  integrantes:number;
  nombre: string;
  objetivos: string;
  sigla: string;
  facultad_regional_id: number;
  director_id: number;
  vicedirector_id: number;
}) {
  const body = {
    grupo_de_investigacion: data
  };

  const res = await api.put(`/api/grupo_de_investigacions/${id}`, body);
  return res.data;
}