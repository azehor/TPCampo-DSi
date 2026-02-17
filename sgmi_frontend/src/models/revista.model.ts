import type { Pais } from "./pais.model";

export interface Revista {
  id: number;
  nombre: string;
  issn: string;
  editorial: string;
  pais?: Pais;
  pais_id?: number;
  created_at?: string;
  updated_at?: string;
}
