import { api } from "./api";

export async function getGrupoInvestigadores(grupoId: number) {
  const res = await api.get(`/api/grupo_de_investigacions/${grupoId}/investigadores`);
  return res.data?.content ?? res.data ?? [];
}

export async function addInvestigadorToGrupo(grupoId: number, investigadorId: number) {
  const res = await api.post(`/api/grupo_de_investigacions/${grupoId}/investigadores/${investigadorId}`);
  return res.data;
}

export async function removeInvestigadorFromGrupo(grupoId: number, investigadorId: number) {
  const res = await api.delete(`/api/grupo_de_investigacions/${grupoId}/investigadores/${investigadorId}`);
  return res.data;
}
