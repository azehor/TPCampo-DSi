import { type FacultadRegional } from "./facultad-regional.model";
import { type Investigador } from "./investigador.model";

export interface GrupoDeInvestigacion {
  id: number;
  correo_electronico: string;
  integrantes: number;
  nombre: string;
  objetivos?: string;
  sigla: string;

  facultad_regional: FacultadRegional;
  director: Investigador;
  vicedirector: Investigador;

  created_at?: string;
  updated_at?: string;
}
