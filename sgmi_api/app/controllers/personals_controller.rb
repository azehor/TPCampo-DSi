class PersonalsController < ApplicationController
  def index
    render json: Personal.all
  end

  def show
    render json: Personal.find(params[:id])
  end

  def create
    personal = Personal.new(personal_params)
    if personal.save
      render json: personal, status: :created
    else
      render json: personal.errors, status: :unprocessable_entity
    end
  end

  def update
    personal = Personal.find(params[:id])
    if personal.update(personal_params)
      render json: personal
    else
      render json: personal.errors, status: :unprocessable_entity
    end
  end

  def destroy
    personal = Personal.find(params[:id])
    personal.destroy
    head :no_content
  end
  
  def personal_params
    params.require(:personal).permit(:apellido, :nombre, :horas_semanales, :object_type)
  end
end
