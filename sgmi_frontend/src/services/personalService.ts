import { api } from "./api";
import type { Personal } from "../models/personal.model";

export async function createPersonal(data: Personal): Promise<{ personal: Personal }> {
  const response = await api.post("/api/personals", {
    nombre: data.nombre,
    apellido: data.apellido,
    horas_semanales: data.horas_semanales || 40,
    object_type: data.object_type || "Docente",
  });
  return response.data;
}

export async function getAllPersonals(): Promise<Personal[]> {
  const response = await api.get("/api/personals");
  return response.data;
}

export async function getPersonalById(id: number): Promise<Personal> {
  const response = await api.get(`/api/personals/${id}`);
  return response.data;
}

export async function updatePersonal(
  id: number,
  data: Partial<Personal>
): Promise<Personal> {
  const response = await api.patch(`/api/personals/${id}`, data);
  return response.data;
}

export async function deletePersonal(id: number): Promise<{ message: string }> {
  const response = await api.delete(`/api/personals/${id}`);
  return response.data;
}
