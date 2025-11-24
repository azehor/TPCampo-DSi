class TrabajoEnRevista < ApplicationRecord
  belongs_to :revista, class_name: "Revista"
  belongs_to :grupo_de_investigacion, class_name: "GrupoDeInvestigacion"

  validates :titulo, presence: true
  validates :codigo, presence: true

  validates :revista, presence: true
  validates :grupo_de_investigacion, presence: true
end
