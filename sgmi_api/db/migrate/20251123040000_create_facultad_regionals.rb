class CreateFacultadRegionals < ActiveRecord::Migration[8.1]
  def change
    create_table :facultad_regionals do |t|
      t.string :nombre, null: false

      t.timestamps
    end
  end
end
