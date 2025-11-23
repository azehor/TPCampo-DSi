class CreatePersonals < ActiveRecord::Migration[8.1]
  def change
    create_table :personals do |t|
      t.string :apellido, limit: 45, null: false
      t.string :nombre,   limit: 45, null: false
      t.integer :horas_semanales
      t.string :object_type, limit: 45, null: false

      t.timestamps
    end
  end
end
