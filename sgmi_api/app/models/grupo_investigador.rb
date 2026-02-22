class GrupoInvestigador < ApplicationRecord
  belongs_to :grupo_de_investigacion
  belongs_to :investigador

  validates :grupo_de_investigacion_id, uniqueness: { scope: :investigador_id }
  validate :investigador_no_es_director_ni_vicedirector

  private

  def investigador_no_es_director_ni_vicedirector
    return if grupo_de_investigacion.blank? || investigador_id.blank?

    if investigador_id == grupo_de_investigacion.director_id
      errors.add(:investigador_id, "no puede ser el director del grupo")
    end

    if investigador_id == grupo_de_investigacion.vicedirector_id
      errors.add(:investigador_id, "no puede ser el vicedirector del grupo")
    end
  end

end
