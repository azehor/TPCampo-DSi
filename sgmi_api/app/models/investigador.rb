class Investigador < ApplicationRecord
  belongs_to :personal

  # Un investigador puede ser director o vicedirector de muchos grupos
  has_many :grupos_dirigidos,
           class_name: "GrupoDeInvestigacion",
           foreign_key: "director"

  has_many :grupos_vicedirigidos,
           class_name: "GrupoDeInvestigacion",
           foreign_key: "vicedirector"
end
