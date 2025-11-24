class CreateArticuloDeDivulgacions < ActiveRecord::Migration[8.1]
  def change
    create_table :articulo_de_divulgacions do |t|
      t.string :titulo
      t.string :nombre
      t.string :codigo

      t.references :grupo_de_investigacion, null: false, foreign_key: { to_table: :grupo_de_investigacions }

      t.timestamps
    end
  end
end
