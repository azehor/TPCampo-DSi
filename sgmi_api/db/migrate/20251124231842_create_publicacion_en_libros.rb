class CreatePublicacionEnLibros < ActiveRecord::Migration[8.1]
  def change
    create_table :publicacion_en_libros do |t|
      t.string :titulo
      t.string :libro
      t.string :capitulo
      t.string :codigo

      t.references :grupo_de_investigacion, null: false, foreign_key: { to_table: :grupo_de_investigacions }

      t.timestamps
    end
  end
end
