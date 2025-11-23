class CreateInvestigadors < ActiveRecord::Migration[8.1]
  def change
    create_table :investigadors do |t|
      t.string :categoria,  null: false
      t.string :dedicacion,  null: false
      t.integer :programa_incentivo
      t.references :personal, null: false, foreign_key: true

      t.timestamps
    end
  end
end
