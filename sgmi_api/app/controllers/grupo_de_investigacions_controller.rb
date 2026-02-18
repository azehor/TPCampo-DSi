class GrupoDeInvestigacionsController < ApplicationController
  def index
    if params.has_key?(:query)
      query = params[:query]
    else
      query = ""
    end
    if params.has_key?(:page) && params.has_key?(:limit)
      page = params[:page].to_i
      per_page = params[:limit].to_i
    else
      page = 0
      per_page = 15
    end
    if params.has_key?(:field) && params.has_key?(:sort) && params[:field].present? && params[:sort].present?
      field = params[:field]
      sort = params[:sort]
    else
      field = "grupo_de_investigacions.created_at"
      sort = "desc"
    end
    count = GrupoDeInvestigacion.count
    grupos = GrupoDeInvestigacion
      .includes(:facultad_regional, [ { director: :personal }, { vicedirector: :personal } ])
      .select("grupo_de_investigacions.nombre as nombre", :sigla, "facultad_regionals.nombre as facultad_regional",
              "personals.nombre as director", "personals_investigadors.nombre as vicedirector",
              :director_id, :vicedirector_id, :facultad_regional_id, :id)
      .query_tables(query)
      .references(:personal)
      .limit(per_page).offset(page * per_page)
      .order(GrupoDeInvestigacion.sanitize_sql_for_order("#{field} #{sort}"))
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

  # GET /api/grupo_de_investigacions/:id/investigadores
  def investigadores
    grupo = GrupoDeInvestigacion.find(params[:id])

    investigadores = grupo.investigadors.includes(:personal)

    render json: {
      content: investigadores.as_json(include: { personal: {} })
    }
  end

  # POST /api/grupo_de_investigacions/:id/investigadores/:investigador_id
  def add_investigador
    grupo = GrupoDeInvestigacion.find(params[:id])
    investigador = Investigador.find(params[:investigador_id])

    GrupoInvestigador.find_or_create_by!(
      grupo_de_investigacion_id: grupo.id,
      investigador_id: investigador.id
    )

    render json: { message: "Investigador asignado al grupo" }, status: :created
  rescue ActiveRecord::RecordNotFound => e
    render json: { error: e.message }, status: :not_found
  rescue ActiveRecord::RecordInvalid => e
    render json: { error: e.record.errors.full_messages }, status: :unprocessable_entity
  end

  # DELETE /api/grupo_de_investigacions/:id/investigadores/:investigador_id
  def remove_investigador
    grupo = GrupoDeInvestigacion.find(params[:id])

    relacion = GrupoInvestigador.find_by!(
      grupo_de_investigacion_id: grupo.id,
      investigador_id: params[:investigador_id]
    )

    relacion.destroy
    head :no_content
  rescue ActiveRecord::RecordNotFound => e
    render json: { error: e.message }, status: :not_found
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
      :vicedirector_id,
      :query,
      :field,
      :sort
    )
  end
end
