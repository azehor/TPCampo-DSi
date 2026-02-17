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

    console.error("API ERROR:", status, message);

    // Token expirado o inválido
    if (status === 401) {
      clearToken();
      // Redirigir al login
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);
