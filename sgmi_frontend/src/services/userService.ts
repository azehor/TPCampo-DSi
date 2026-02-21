import { api } from "./api";
import type { User, UserProfile } from "../models/user.model";

export async function getPerfilUsuario(): Promise<UserProfile> {
  const response = await api.get("/api/profile");
  return response.data;
}

export async function cambiarContrasenia(
  currentPassword: string,
  newPassword: string
): Promise<{ message: string }> {
  const response = await api.patch("/api/change_password", {
    current_password: currentPassword,
    new_password: newPassword,
  });
  return response.data;
}

export async function crearUsuario(
  email: string,
  password: string
): Promise<{ message: string; user: User }> {
  const response = await api.post("/api/users", {
    email,
    password,
  });
  return response.data;
}

export async function getUsuarios(): Promise<{ content: User[] }> {
  const response = await api.get("/api/users");
  return response.data;
}

export async function editarUsuario(
  id: number,
  data: Partial<{ email: string; password: string; role: string }>
): Promise<{ message: string; user: User }> {
  const response = await api.patch(`/api/users/${id}`, data);
  return response.data;
}

export async function eliminarUsuario(id: number): Promise<{ message: string }> {
  const response = await api.delete(`/api/users/${id}`);
  return response.data;
}
