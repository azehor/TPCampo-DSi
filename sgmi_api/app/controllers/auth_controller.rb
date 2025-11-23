class AuthController < ApplicationController
  skip_before_action :authorize_request, only: [:login]

  def login
    user = User.find_by(email: params[:email])

    if user&.authenticate(params[:password])
      token = JsonWebToken.encode(user_id: user.id)
      render json: { token: token, email: user.email, role: user.role }
    else
      render json: { error: "Credenciales inválidas" }, status: :unauthorized
    end
  end
end
