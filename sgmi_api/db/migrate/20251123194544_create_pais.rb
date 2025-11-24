class CreatePais < ActiveRecord::Migration[8.1]
  def change
    create_table :pais do |t|
      t.string :nombre, null: false
      t.string :codigo, null: false

      t.timestamps
    end
  end
end
