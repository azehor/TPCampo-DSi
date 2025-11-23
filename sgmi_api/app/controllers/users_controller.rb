class UsersController < ApplicationController
  # Solo el admin puede crear usuarios
  before_action :authorize_admin!, only: [:create]

  def create
    user = User.new(user_params)
    user.role = "user"

    if user.save
      render json: { message: "Usuario creado", user: user }, status: :created
    else
      render json: user.errors, status: :unprocessable_entity
    end
  end

  def change_password
    # Verificar si contraseña actual ingresasa es correcta
    unless @current_user.authenticate(params[:current_password])
      return render json: { error: "Contraseña actual incorrecta" }, status: :unauthorized
    end

    # Realizar validacion de nueva contraseña
    if params[:new_password].blank?
      return render json: { error: "La nueva contraseña no puede estar vacía" }, status: :unprocessable_entity
    end

    # Cambiar contraseña
    @current_user.password = params[:new_password]

    if @current_user.save
      render json: { message: "Contraseña actualizada correctamente" }, status: :ok
    else
      render json: @current_user.errors, status: :unprocessable_entity
    end
  end

  private

  def authorize_admin!
    unless @current_user&.role == "admin"
      render json: { error: "Solo los admin pueden realizar esta accion" }, status: :forbidden
    end
  end

  def user_params
    params.permit(:email, :password)
  end
end
