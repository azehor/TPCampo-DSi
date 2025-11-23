class ApplicationController < ActionController::API
  before_action :authorize_request
  attr_reader :current_user

  private

  def authorize_request
    header = request.headers["Authorization"]

    return render json: { error: "Token no enviado" }, status: :unauthorized if header.blank?

    token = header.split(" ").last

    decoded = JsonWebToken.decode(token)
    return render json: { error: "Token inválido o expirado" }, status: :unauthorized if decoded.nil?

    @current_user = User.find_by(id: decoded[:user_id])
    return render json: { error: "Usuario no encontrado" }, status: :unauthorized if @current_user.nil?
  end
end
