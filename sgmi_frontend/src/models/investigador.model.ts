import { type Personal } from "./personal.model";

export interface Investigador {
  id: number;
  categoria: string;
  dedicacion: string;
  programa_incentivo?: number;

  personal: Personal;

  created_at?: string;
  updated_at?: string;
}
