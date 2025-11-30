class ArticuloDeDivulgacion < ApplicationRecord
  belongs_to :grupo_de_investigacion, class_name: "GrupoDeInvestigacion"
  has_and_belongs_to_many :memorias, join_table: :memorias_articulo_de_divulgacions

  validates :nombre, presence: true
  validates :titulo, presence: true
  validates :codigo, presence: true

  validates :grupo_de_investigacion, presence: true
end
