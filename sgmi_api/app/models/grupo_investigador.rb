class GrupoInvestigador < ApplicationRecord
  belongs_to :grupo_de_investigacion
  belongs_to :investigador

  validates :grupo_de_investigacion_id, uniqueness: { scope: :investigador_id }

end
