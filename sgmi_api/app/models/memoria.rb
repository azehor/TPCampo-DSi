class Memoria < ApplicationRecord
  belongs_to :grupo_de_investigacion, class_name: "GrupoDeInvestigacion"

  has_and_belongs_to_many :patentes

  has_and_belongs_to_many :trabajo_en_revistas,
                          class_name: "TrabajoEnRevista",
                          join_table: "memorias_trabajo_en_revistas"

  has_and_belongs_to_many :publicacion_en_libros,
                          class_name: "PublicacionEnLibro",
                          join_table: "memorias_publicacion_en_libros"

  has_and_belongs_to_many :articulo_de_divulgacions,
                          class_name: "ArticuloDeDivulgacion",
                          join_table: "memorias_articulo_de_divulgacions"

  # Soft Delete
  default_scope { where(deleted_at: nil) }
  scope :with_deleted, -> { unscope(where: :deleted_at) }
  scope :only_deleted, -> { unscope(where: :deleted_at).where.not(deleted_at: nil) }

  validates :grupo_de_investigacion, presence: true

  # Evitar edicion de memoria si ya fue creada
  validate :cannot_update_if_persisted, on: :update

  def cannot_update_if_persisted
    if persisted? && changed?
      errors.add(:base, "La memoria no puede ser editada una vez creada")
    end
  end

  def soft_delete
    update_column(:deleted_at, Time.current)
  end

  # Restaurar memoria
  def restore
    update_column(:deleted_at, nil)
  end

  def deleted?
    deleted_at.present?
  end
end
