import { api } from "./api";
import type { Investigador } from "../models/investigador.model";

export interface InvestigadoresPaginatedResponse {
  content: Investigador[];
  metadata: {
    page: number;
    per_page: number;
    total_count: number;
  };
}

export async function getInvestigadores(page = 0, perPage = 10): Promise<InvestigadoresPaginatedResponse> {
  const response = await api.get("/api/investigadors", {
    params: {
      page,
      limit: perPage,
    }
  });
  
  return response.data;
}

export async function getInvestigadorById(id: number): Promise<Investigador> {
  const response = await api.get(`/api/investigadors/${id}`);
  return response.data;
}

export async function createInvestigador(data: Investigador): Promise<Investigador> {
  const response = await api.post("/api/investigadors", {
    personal_id: data.personal_id,
    user_id: data.user_id,
    categoria: data.categoria,
    dedicacion: data.dedicacion,
  });
  return response.data;
}

export async function updateInvestigador(
  id: number,
  data: Partial<Investigador>
): Promise<Investigador> {
  const response = await api.patch(`/api/investigadors/${id}`, data);
  return response.data;
}

export async function deleteInvestigador(id: number): Promise<{ message: string }> {
  const response = await api.delete(`/api/investigadors/${id}`);
  return response.data;
}
