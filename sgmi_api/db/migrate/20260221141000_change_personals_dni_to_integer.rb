class ChangePersonalsDniToInteger < ActiveRecord::Migration[8.1]
  def up
    change_column :personals,
                  :dni,
                  :integer,
                  using: "CASE WHEN dni ~ '^[0-9]+$' AND dni::bigint <= 2147483647 THEN dni::integer ELSE NULL END"
  end

  def down
    change_column :personals, :dni, :string, limit: 10
  end
end