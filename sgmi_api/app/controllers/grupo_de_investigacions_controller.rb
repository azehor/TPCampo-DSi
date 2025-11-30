class GrupoDeInvestigacionsController < ApplicationController
  def index
    if params.has_key?(:page) && params.has_key?(:limit)
      page = params[:page].to_i
      per_page = params[:limit].to_i
    else
      page = 0
      per_page = 15
    end
    count = GrupoDeInvestigacion.count
    grupos = GrupoDeInvestigacion.joins(director: :personal).limit(per_page).offset(page * per_page)
    render json: {
      content: grupos.as_json(
        include: {
          director: {
            include: {
              personal: {}
            }
          },
          vicedirector: {
            include: {
              personal: {}
            }
          },
          facultad_regional: {}
      }
      ), metadata: {
        page: page,
        per_page: per_page,
        total_count: count.as_json
      }
    }
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
