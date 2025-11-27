class Patente < ApplicationRecord
  belongs_to :grupo_de_investigacion, class_name: "GrupoDeInvestigacion"
  has_and_belongs_to_many :memorias

  validates :titulo, presence: true, length: { minimum: 3 }
  validates :tipo, presence: true
  validates :identificador, presence: true

  validates :grupo_de_investigacion, presence: true
end
