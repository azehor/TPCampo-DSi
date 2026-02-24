class Patente < ApplicationRecord
  belongs_to :grupo_de_investigacion, class_name: "GrupoDeInvestigacion"
  has_and_belongs_to_many :memorias

  validates :titulo, presence: true, length: { minimum: 3 }
  validates :tipo, presence: true
  validates :identificador, presence: true

  validates :grupo_de_investigacion, presence: true

  scope :query_tables, ->(query) {
    columns = %w[identificador grupo_de_investigacions.nombre titulo tipo]
    where(
      columns
      .map { |e| "lower(#{e}) LIKE :search" }
      .join(" OR "),
    search: "%" + PublicacionEnLibro.sanitize_sql_like(query).downcase + "%"
    )
  }

  scope :user_visibility, ->(grupo_id) {
    where(grupo_de_investigacion_id: grupo_id) if grupo_id.present?
  }

  scope :memoria_visibility, ->(memoria_id) {
    if memoria_id.present?
      memoria = Memoria.find(memoria_id)
      anio = memoria.anio
      grupo_id = memoria.grupo_de_investigacion_id
      where("extract(year from patentes.created_at) = ?", anio).where(grupo_de_investigacion_id: grupo_id)
    end
  }
end
