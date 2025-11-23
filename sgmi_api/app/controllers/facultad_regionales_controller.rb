class FacultadRegionalesController < ApplicationController
  def index
    render json: FacultadRegional.all
  end

  def show
    render json: FacultadRegional.find(params[:id])
  end

  def create
    facultad = FacultadRegional.new(facultad_params)
    if facultad.save
      render json: facultad, status: :created
    else
      render json: facultad.errors, status: :unprocessable_entity
    end
  end

  def update
    facultad = FacultadRegional.find(params[:id])
    if facultad.update(facultad_params)
      render json: facultad
    else
      render json: facultad.errors, status: :unprocessable_entity
    end
  end

  def destroy
    facultad = FacultadRegional.find(params[:id])
    facultad.destroy
    head :no_content
  end

  private

  def facultad_params
    params.require(:facultad_regional).permit(:nombre)
  end
end
