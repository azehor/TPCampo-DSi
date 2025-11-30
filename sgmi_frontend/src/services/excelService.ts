import { api } from "./api";

export async function getExcel(grupo_id: number, anio: number) {
  const res = await api.get("/api/exportar", {params: { grupo: grupo_id, anio: anio}, responseType: "blob"})
  return res;
}
