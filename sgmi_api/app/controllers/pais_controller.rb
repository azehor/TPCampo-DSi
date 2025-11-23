class PaisController < ApplicationController
  before_action :set_pais, only: %i[ show update destroy ]

  # GET /pais
  def index
    @pais = Pais.all
    render json: @pais
  end

  # GET /pais/:id
  def show
    render json: @pais
  end

  # POST /pais
  def create
    @pais = Pais.new(pais_params)

    if @pais.save
      render json: @pais, status: :created
    else
      render json: @pais.errors, status: :unprocessable_entity
    end
  end

  # PATCH /pais/:id
  def update
    if @pais.update(pais_params)
      render json: @pais
    else
      render json: @pais.errors, status: :unprocessable_entity
    end
  end

  # DELETE /pais/:id
  def destroy
    @pais.destroy!
    head :no_content
  end

  private

  def set_pais
    @pais = Pais.find(params[:id])
  end

  def pais_params
    params.require(:pais).permit(:nombre, :codigo)
  end
end
