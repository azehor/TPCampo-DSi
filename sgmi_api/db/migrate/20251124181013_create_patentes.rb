class CreatePatentes < ActiveRecord::Migration[8.1]
  def change
    create_table :patentes do |t|
      t.string :identificador
      t.string :titulo
      t.string :tipo

      t.timestamps
    end
  end
end
