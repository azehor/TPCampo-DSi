class AddGrupoRefToTrabajoEnRevista < ActiveRecord::Migration[8.1]
  def change
    change_table :trabajo_en_revista do |t|
      t.references :grupo_de_investigacion, null: false, foreign_key: { to_table: :grupo_de_investigacions }
    end
  end
end
