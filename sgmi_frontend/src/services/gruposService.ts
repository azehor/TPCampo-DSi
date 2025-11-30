import { api } from "./api";

export async function getGrupos(page: number, amount: number, filterModel: any, sortModel: any) {
  const res = await api.get("api/grupo_de_investigacions", {params: {limit: amount, page}})
  return res.data
}
