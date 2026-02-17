import { api } from "./api";

export interface UserProfile {
  id: number;
  email: string;
  role: string;
  investigador?: {
    id: number;
  };
  personal?: {
    id: number;
    nombre: string;
    apellido: string;
  };
}

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
