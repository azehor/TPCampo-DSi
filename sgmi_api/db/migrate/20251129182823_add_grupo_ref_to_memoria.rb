class AddGrupoRefToMemoria < ActiveRecord::Migration[8.1]
  def change
    add_reference :memorias, :grupo_de_investigacion, null: false, foreign_key: true
  end
end
