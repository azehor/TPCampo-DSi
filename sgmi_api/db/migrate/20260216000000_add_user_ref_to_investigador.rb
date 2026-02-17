class AddUserRefToInvestigador < ActiveRecord::Migration[8.1]
  def change
    add_reference :investigadors, :user, null: true, foreign_key: true
  end
end
