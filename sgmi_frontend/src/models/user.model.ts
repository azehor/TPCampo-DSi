export interface User {
  id: number;
  email: string;
  role: string;
  investigador?: {
    id: number;
  };
  created_at?: string;
  updated_at?: string;
}

export interface UserProfile extends User {
  personal?: {
    id: number;
    nombre: string;
    apellido: string;
  };
}

