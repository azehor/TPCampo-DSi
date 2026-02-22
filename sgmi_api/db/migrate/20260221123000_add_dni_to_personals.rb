class AddDniToPersonals < ActiveRecord::Migration[8.1]
  def change
    add_column :personals, :dni, :string, limit: 45
  end
end