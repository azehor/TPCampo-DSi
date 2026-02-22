import axios from "axios";
import { getToken, clearToken } from "./auth";

export const api = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json"
  }
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Manejo unificado de errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data || error.message;
    // URL original de la request (puede venir relativa o absoluta)
    const requestUrl = String(error.config?.url || "");
    // Normaliza para evitar falsos positivos con endpoints parecidos
    let normalizedPath = "";
    try {
      const base = error.config?.baseURL || api.defaults.baseURL || window.location.origin;
      const pathname = new URL(requestUrl, base).pathname;
      normalizedPath = pathname.replace(/\/+$/, "") || "/";
    } catch {
      normalizedPath = requestUrl.replace(/[?#].*$/, "").replace(/\/+$/, "") || "/";
    }
    // Coincidencia exacta únicamente con el endpoint de login
    const isLoginRequest = normalizedPath === "/login";

    console.error("API ERROR:", status, message);

    // Redirige solo cuando el 401 ocurre en endpoints protegidos
    if (status === 401 && !isLoginRequest) {
      clearToken();
      // Redirigir al login
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);
