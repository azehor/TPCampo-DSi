class CreateJoinTableMemoriasPublicacionEnLibros < ActiveRecord::Migration[8.1]
  def change
    create_join_table :memorias, :publicacion_en_libros do |t|
      t.index [:memoria_id, :publicacion_en_libro_id], name: "idx_memoria_publicacion_libro"
      t.index [:publicacion_en_libro_id, :memoria_id], name: "idx_publicacion_libro_memoria"
    end
  end
end
