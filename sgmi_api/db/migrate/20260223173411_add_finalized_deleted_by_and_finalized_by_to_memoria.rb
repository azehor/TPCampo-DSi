class AddFinalizedDeletedByAndFinalizedByToMemoria < ActiveRecord::Migration[8.1]
  def up
    change_table :memorias do |t|
      t.boolean :finalized, default: false
      t.references :finalized_by, foreign_key: { to_table: :users }
      t.references :deleted_by, foreign_key: { to_table: :users }
    end
  end
  def down
    remove_column :memorias, :finalized
    remove_column :memorias, :finalized_by
    remove_column :memorias, :deleted_by
  end
end
