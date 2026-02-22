class ChangeDniLimitTo10InPersonals < ActiveRecord::Migration[8.1]
  def change
    change_column :personals, :dni, :string, limit: 10
  end
end