require 'jwt'

class JsonWebToken
  SECRET_KEY = ENV["JWT_SECRET"] || "fallback_secret"

  def self.encode(payload, exp = 1.hours.from_now)
    payload[:exp] = exp.to_i
    JWT.encode(payload, SECRET_KEY)
  end

  def self.decode(token)
    decoded = JWT.decode(token, SECRET_KEY)[0]
    HashWithIndifferentAccess.new decoded
  rescue
    nil
  end
end
