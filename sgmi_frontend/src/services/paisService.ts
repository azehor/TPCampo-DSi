import { api } from "./api";

export async function getPaises() {
  const res = await api.get("api/pais")
  return res.data
}