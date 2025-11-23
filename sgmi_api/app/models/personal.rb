class Personal < ApplicationRecord
  # Relación uno a uno con Investigador
  has_one :investigador, dependent: :destroy
end
