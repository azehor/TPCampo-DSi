class CreateGrupoInvestigadors < ActiveRecord::Migration[8.1]
  def change
    create_table :grupo_investigadors do |t|
      t.references :grupo_de_investigacion, null: false, foreign_key: true, index: false
      t.references :investigador, null: false, foreign_key: true, index: false

      t.timestamps
    end

    add_index :grupo_investigadors,
              [:grupo_de_investigacion_id, :investigador_id],
              unique: true,
              name: "idx_grupo_investigador_unique"

    add_index :grupo_investigadors, :grupo_de_investigacion_id, name: "idx_grupo_investigador_grupo"
    add_index :grupo_investigadors, :investigador_id, name: "idx_grupo_investigador_investigador"
  end
end
