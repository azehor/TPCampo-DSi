class Personal < ApplicationRecord
  # Relación uno a uno con Investigador
  has_one :investigador, dependent: :destroy

  validates :dni,
            numericality: {
              only_integer: true,
              greater_than_or_equal_to: 0,
              less_than_or_equal_to: 9_999_999_999
            },
            allow_nil: true
end
