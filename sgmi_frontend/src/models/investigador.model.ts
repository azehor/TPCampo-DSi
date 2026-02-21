import { type Personal } from "./personal.model";
import { type User } from "./user.model";

export interface Investigador {
  id?: number;
  personal_id: number;
  user_id?: number;
  categoria: string;
  dedicacion: string;
  programa_incentivo?: number;

  personal?: Personal;
  user?: User;

  created_at?: string;
  updated_at?: string;
}
