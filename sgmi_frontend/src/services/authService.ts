import { api } from "./api";
import { setToken, clearToken } from "./auth";

export async function login(email: string, password: string) {
  const response = await api.post("/login", { email, password });

  const token = response.data.token;
  if (!token) throw new Error("El servidor no devolvió un token");

  setToken(token);

  return response.data;
}

export function logout() {
  clearToken();
}
