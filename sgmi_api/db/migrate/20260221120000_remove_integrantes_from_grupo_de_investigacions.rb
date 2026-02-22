class RemoveIntegrantesFromGrupoDeInvestigacions < ActiveRecord::Migration[8.1]
  def up
    remove_column :grupo_de_investigacions, :integrantes
  end

  def down
    add_column :grupo_de_investigacions, :integrantes, :integer, null: false, default: 0
  end
end
