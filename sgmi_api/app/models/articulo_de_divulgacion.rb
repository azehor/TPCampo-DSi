class ArticuloDeDivulgacion < ApplicationRecord
  belongs_to :grupo_de_investigacion, class_name: "GrupoDeInvestigacion"
  has_and_belongs_to_many :memorias, join_table: :memorias_articulo_de_divulgacions

  validates :nombre, presence: true
  validates :titulo, presence: true
  validates :codigo, presence: true

  validates :grupo_de_investigacion, presence: true

  scope :query_tables, ->(query) {
    columns = %w[articulo_de_divulgacions.nombre titulo codigo grupo_de_investigacions.nombre]
    where(
      columns
      .map { |e| "lower(#{e}) LIKE :search" }
      .join(" OR "),
    search: "%" + ArticuloDeDivulgacion.sanitize_sql_like(query).downcase + "%"
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
      where("extract(year from articulo_de_divulgacions.created_at) = ?", anio).where(grupo_de_investigacion_id: grupo_id)
    end
  }
end
