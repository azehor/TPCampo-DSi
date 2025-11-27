class CreateJoinTableMemoriasTrabajoEnRevistas < ActiveRecord::Migration[8.1]
  def change
    create_join_table :memorias, :trabajo_en_revistas do |t|
      t.index [:memoria_id, :trabajo_en_revista_id], name: "idx_memoria_trabajo_revista"
      t.index [:trabajo_en_revista_id, :memoria_id], name: "idx_trabajo_revista_memoria"
    end
  end
end
