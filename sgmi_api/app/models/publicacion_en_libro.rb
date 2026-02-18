class PublicacionEnLibro < ApplicationRecord
  belongs_to :grupo_de_investigacion, class_name: "GrupoDeInvestigacion"
  has_and_belongs_to_many :memorias

  validates :titulo, presence: true
  validates :libro, presence: true
  validates :capitulo, presence: true
  validates :codigo, presence: true

  scope :query_tables, ->(query) {
    columns = %w[titulo codigo libro capitulo grupo_de_investigacions.nombre]
    where(
      columns
      .map { |e| "lower(#{e}) LIKE :search" }
      .join(" OR "),
    search: "%" + PublicacionEnLibro.sanitize_sql_like(query).downcase + "%"
    )
  }

  scope :user_visibility, ->(grupo_id) {
    where(id: grupo_id) if grupo_id.present?
  }
end
