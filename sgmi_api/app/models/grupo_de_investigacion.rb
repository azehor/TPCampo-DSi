class GrupoDeInvestigacion < ApplicationRecord
  belongs_to :director, class_name: "Investigador"
  belongs_to :vicedirector, class_name: "Investigador"
  belongs_to :facultad_regional

  # Validaciones
  validates :nombre, presence: true, length: { minimum: 3 }
  validates :sigla, presence: true, length: { maximum: 10 }
  validates :integrantes, presence: true, numericality: { only_integer: true, greater_than: 0 }

  # Validación del correo
  validates :correo_electronico,
            presence: true,
            format: { with: URI::MailTo::EMAIL_REGEXP }

  # Validación de relaciones
  validates :director, presence: true
  validates :vicedirector, presence: true
  validates :facultad_regional, presence: true

  # Director y vicedirector no pueden ser la misma persona
  validate :director_y_vicedirector_distintos

  # Sigla debe ser unica
  validates :sigla, uniqueness: true

  # El nombre debe ser unico
  validates :nombre, uniqueness: true

  private

  def director_y_vicedirector_distintos
    return if director_id.blank? || vicedirector_id.blank?

    if director_id == vicedirector_id
      errors.add(:vicedirector_id, "no puede ser igual al director")
    end
  end
end
