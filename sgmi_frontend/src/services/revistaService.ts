import { api } from "./api";

export async function getRevistas(page: number, amount: number, filterModel: any, sortModel: any) {
  const res = await api.get("api/revista", {params: {limit: amount, page}})
  
  return res.data
}
