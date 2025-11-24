class GrupoDeInvestigacionsController < ApplicationController
  def index
    grupos = GrupoDeInvestigacion.all
    render json: grupos.as_json(
      include: {
        director: {},
        vicedirector: {},
        facultad_regional: {}
      }
    )
  end


  def show
  grupo = GrupoDeInvestigacion.find(params[:id])
    render json: grupo.as_json(
      include: {
        director: {},
        vicedirector: {},
        facultad_regional: {}
        }
    )
  end

  def create
    grupo = GrupoDeInvestigacion.new(grupo_params)

    if grupo.save
      render json: grupo, status: :created
    else
      render json: grupo.errors, status: :unprocessable_entity
    end
  end

  def update
    grupo = GrupoDeInvestigacion.find(params[:id])

    if grupo.update(grupo_params)
      render json: grupo
    else
      render json: grupo.errors, status: :unprocessable_entity
    end
  end

  def destroy
    grupo = GrupoDeInvestigacion.find(params[:id])
    grupo.destroy
    head :no_content
  end

  private

  def grupo_params
    params.require(:grupo_de_investigacion).permit(
      :correo_electronico,
      :integrantes,
      :nombre,
      :objetivos,
      :sigla,
      :facultad_regional_id,
      :director_id,
      :vicedirector_id
    )
  end
end
