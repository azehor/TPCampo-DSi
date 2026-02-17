class AddSoftDeleteToMemorias < ActiveRecord::Migration[8.1]
  def change
    add_column :memorias, :deleted_at, :datetime, null: true
    add_index :memorias, :deleted_at
  end
end
