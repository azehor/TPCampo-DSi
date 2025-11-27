class CreateMemorias < ActiveRecord::Migration[8.1]
  def change
    create_table :memorias do |t|
      t.string :anio

      t.timestamps
    end
  end
end
