class PublicacionEnLibro < ApplicationRecord
  belongs_to :grupo_de_investigacion, class_name: "GrupoDeInvestigacion"
  has_and_belongs_to_many :memorias

  validates :titulo, presence: true
  validates :libro, presence: true
  validates :capitulo, presence: true
  validates :codigo, presence: true
end
