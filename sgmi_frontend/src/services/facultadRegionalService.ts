import { api } from "./api";

export async function getFacultadesRegionales(page = 0, limit = 10) {
  const response = await api.get("/api/facultad_regionales", {
    params: {
      page,
      limit
    }
  });
  
  return response.data;
}
