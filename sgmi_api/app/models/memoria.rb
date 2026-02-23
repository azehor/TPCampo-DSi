class Memoria < ApplicationRecord
  belongs_to :grupo_de_investigacion, class_name: "GrupoDeInvestigacion"

  belongs_to :deleted_by, class_name: "User", optional: true
  belongs_to :finalized_by, class_name: "User", optional: true

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

  def finalize(user_id)
    update_column(:finalized, true)
    update_column(:finalized_by_id, user_id)
  end

  def soft_delete(user_id)
    update_column(:deleted_at, Time.current)
    update_column(:deleted_by_id, user_id)
  end

  # Restaurar memoria
  def restore
    update_column(:deleted_at, nil)
    update_column(:deleted_by_id, nil)
  end

  def deleted?
    deleted_at.present?
  end
end
