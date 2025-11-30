import { api } from "./api";

export async function getMemorias(grupo_id: number) {
  const res = await api.get("api/memorias", {params: {grupo: grupo_id}})
  return res.data
}
