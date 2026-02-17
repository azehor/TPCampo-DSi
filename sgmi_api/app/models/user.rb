class User < ApplicationRecord
    has_secure_password
    has_one :investigador
    validates :email, presence: true, uniqueness: true
    validates :role, presence: true
end
