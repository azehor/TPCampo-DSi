class CreateGrupoDeInvestigacions < ActiveRecord::Migration[8.1]
  def change
    create_table :grupo_de_investigacions do |t|
      t.string  :correo_electronico, null: false
      t.integer :integrantes,        null: false
      t.string  :nombre,             null: false
      t.text    :objetivos
      t.string  :sigla,              null: false

      t.references :facultad_regional, null: false, foreign_key: true
      t.references :director, null: false, foreign_key: { to_table: :investigadors }
      t.references :vicedirector, null: false, foreign_key: { to_table: :investigadors }

      t.timestamps
    end
  end
end
