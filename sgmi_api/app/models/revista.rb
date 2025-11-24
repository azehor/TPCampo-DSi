class Revista < ApplicationRecord
  belongs_to :pais, class_name: "Pais"

  validates :nombre, presence: true
  validates :issn, presence: true
  validates :editorial, presence: true

  validates :pais, presence: true
end
