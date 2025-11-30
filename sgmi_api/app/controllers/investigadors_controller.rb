class InvestigadorsController < ApplicationController
  def index
    investigadores= Investigador.all
    render json:{
      content: investigadores.as_json(
        include: {personal: {}}
      )
    } 
  end

  def show
    render json: Investigador.find(params[:id])
  end

  def create
    investigador = Investigador.new(investigador_params)
    if investigador.save
      render json: investigador, status: :created
    else
      render json: investigador.errors, status: :unprocessable_entity
    end
  end

  def update
    investigador = Investigador.find(params[:id])
    if investigador.update(investigador_params)
      render json: investigador
    else
      render json: investigador.errors, status: :unprocessable_entity
    end
  end

  def destroy
    investigador = Investigador.find(params[:id])
    investigador.destroy
    head :no_content
  end

  private

  def investigador_params
    params.require(:investigador).permit(
      :categoria,
      :dedicacion,
      :personal_id
    )
  end
end
