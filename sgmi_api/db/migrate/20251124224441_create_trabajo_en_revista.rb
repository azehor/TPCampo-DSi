class CreateTrabajoEnRevista < ActiveRecord::Migration[8.1]
  def change
    create_table :trabajo_en_revista do |t|
      t.timestamps
    end
  end
end
