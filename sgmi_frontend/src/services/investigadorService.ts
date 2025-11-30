import { api } from "./api";

export async function getInvestigadores(page = 0, limit = 10) {
  const response = await api.get("/api/investigadors", {
    params: {
      page,
      limit
    }
  });
  
  return response.data;
}
