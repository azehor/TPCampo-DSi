class CreateRevista < ActiveRecord::Migration[8.1]
  def change
    create_table :revista do |t|
      t.timestamps
    end
  end
end
