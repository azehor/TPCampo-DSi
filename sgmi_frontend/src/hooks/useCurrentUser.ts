import { useEffect, useState } from "react";
import { api } from "../services/api";

interface User {
  id: number;
  email: string;
  role: string;
}

export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/api/profile");
        setUser(response.data);
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError("Error al obtener perfil de usuario");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading, error };
}

export function isAdmin(user: User | null): boolean {
  return user?.role === "admin";
}
