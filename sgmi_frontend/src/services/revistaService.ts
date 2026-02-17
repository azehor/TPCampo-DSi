import { api } from "./api";

export async function getRevistas(page: number, amount: number, filterModel: any, sortModel: any) {
  const res = await api.get("api/revista", {params: {limit: amount, page}})
  
  return res.data
}

export async function getRevista(id: number) {
  const res = await api.get(`api/revista/${id}`)
  return res.data
}

export async function createRevista(data: {nombre: string; issn: string; editorial: string; pais_id: number}) {
  const res = await api.post("api/revista", {revista: data})
  return res.data
}

export async function updateRevista(id: number, data: {nombre: string; issn: string; editorial: string; pais_id: number}) {
  const res = await api.put(`api/revista/${id}`, {revista: data})
  return res.data
}

export async function deleteRevista(id: number) {
  const res = await api.delete(`api/revista/${id}`)
  return res.data
}
