class CreatePaises < ActiveRecord::Migration[8.1]
  def change
    create_table :paises do |t|
      t.string :nombre, null: false
      t.string :codigo, null: false

      t.timestamps
    end
  end
end
