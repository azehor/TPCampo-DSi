class PatentesController < ApplicationController
  before_action :set_patente, only: %i[ show update destroy ]

  # GET /patentes
  def index
    curr = current_user
    if curr.role == "admin"
      currGrupo = nil
    else
      currGrupo = User.includes(investigador: :grupos_de_investigacion).references(:investigadors)
        .where(id: curr.id).first.investigador.grupos_de_investigacion_ids
    end
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
    if params.has_key?(:field) && params.has_key?(:sort)
      field = params[:field]
      sort = params[:sort]
    else
      field = "patentes.created_at"
      sort = "desc"
    end
    count = Patente.count
    patentes = Patente
      .joins(:grupo_de_investigacion)
      .select("grupo_de_investigacions.nombre as grupo", :identificador, :titulo, :tipo, :grupo_de_investigacion_id, :id)
      .query_tables(query)
      .user_visibility(currGrupo)
      .limit(per_page).offset(page * per_page)
      .order(Patente.sanitize_sql_for_order("#{field} #{sort}"))
    render json: {
      content: patentes.as_json(include: {
          grupo_de_investigacion: {}
      }),
      metadata: {
        page: page,
        per_page: per_page,
        total_count: count
      }
    }
  end

  # GET /patentes/1
  def show
    render json: @patente
  end

  # POST /patentes
  def create
    @patente = Patente.new(patente_params)

    if @patente.save
      render json: @patente, status: :created, location: @patente
    else
      render json: @patente.errors, status: :unprocessable_content
    end
  end

  # PATCH/PUT /patentes/1
  def update
    if @patente.update(patente_params)
      render json: @patente
    else
      render json: @patente.errors, status: :unprocessable_content
    end
  end

  # DELETE /patentes/1
  def destroy
    @patente.destroy!
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_patente
      @patente = Patente.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def patente_params
      params.require(:patente).permit(
        :identificador,
        :titulo,
        :tipo,
        :grupo_de_investigacion_id,
        :query,
        :field,
        :sort
      )
    end
end
