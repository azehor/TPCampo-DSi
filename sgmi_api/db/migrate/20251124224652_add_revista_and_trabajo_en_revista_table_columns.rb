class AddRevistaAndTrabajoEnRevistaTableColumns < ActiveRecord::Migration[8.1]
  def change
    change_table :revista do |t|
      t.string :nombre, null: false
      t.string :issn, null: false
      t.string :editorial, null: false
      t.references :pais, null: false, foreign_key: { to_table: :pais }
    end
    change_table :trabajo_en_revista do |t|
      t.string :titulo, null: false
      t.string :codigo, null: false
      t.references :revista, null: false, foreign_key: { to_table: :revista }
    end
  end
end
