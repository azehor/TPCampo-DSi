class TrabajoEnRevista < ApplicationRecord
  belongs_to :revista, class_name: "Revista"
  belongs_to :grupo_de_investigacion, class_name: "GrupoDeInvestigacion"
  has_and_belongs_to_many :memorias,
      join_table: "memorias_trabajo_en_revista"
      
  validates :titulo, presence: true
  validates :codigo, presence: true

  validates :revista, presence: true
  validates :grupo_de_investigacion, presence: true
end
