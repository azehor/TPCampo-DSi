class CreateJoinTableMemoriasPatentes < ActiveRecord::Migration[8.1]
  def change
    create_join_table :memorias, :patentes do |t|
      t.index [:memoria_id, :patente_id], name: "idx_memoria_patente"
      t.index [:patente_id, :memoria_id], name: "idx_patente_memoria"
    end
  end
end
