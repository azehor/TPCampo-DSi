class GrupoDeInvestigacion < ApplicationRecord
  belongs_to :director, class_name: "Investigador"
  belongs_to :vicedirector, class_name: "Investigador"
  belongs_to :facultad_regional
end
