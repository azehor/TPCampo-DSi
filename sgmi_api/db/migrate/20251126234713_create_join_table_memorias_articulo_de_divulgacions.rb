class CreateJoinTableMemoriasArticuloDeDivulgacions < ActiveRecord::Migration[8.1]
  def change
    create_join_table :memorias, :articulo_de_divulgacions do |t|
      t.index [:memoria_id, :articulo_de_divulgacion_id], name: "idx_memoria_divulgacion"
      t.index [:articulo_de_divulgacion_id, :memoria_id], name: "idx_divulgacion_memoria"
    end
  end
end
