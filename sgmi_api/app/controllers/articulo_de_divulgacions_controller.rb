class ArticuloDeDivulgacionsController < ApplicationController
  before_action :set_articulo_de_divulgacion, only: %i[ show update destroy ]

  # GET /articulo_de_divulgacions
  def index
    if params.has_key?(:query)
      query = params[:query].to_s
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
      field = "articulo_de_divulgacions.created_at"
      sort = "desc"
    end
    count = ArticuloDeDivulgacion.count
    articulos = ArticuloDeDivulgacion
      .joins(:grupo_de_investigacion)
      .select("grupo_de_investigacions.nombre as grupo", :codigo, :titulo, :nombre, :grupo_de_investigacion_id, :id)
      .query_tables(query)
      .limit(per_page).offset(page * per_page)
      .order(ArticuloDeDivulgacion.sanitize_sql_for_order("#{field} #{sort}"))
    render json: {
      content: articulos.as_json(include: {
          grupo_de_investigacion: {}
      }),
      metadata: {
        page: page,
        per_page: per_page,
        total_count: count
      }
    }
  end

  # GET /articulo_de_divulgacions/1
  def show
    render json: @articulo_de_divulgacion
  end

  # POST /articulo_de_divulgacions
  def create
    @articulo_de_divulgacion = ArticuloDeDivulgacion.new(articulo_de_divulgacion_params)

    if @articulo_de_divulgacion.save
      render json: @articulo_de_divulgacion, status: :created, location: @articulo_de_divulgacion
    else
      render json: @articulo_de_divulgacion.errors, status: :unprocessable_content
    end
  end

  # PATCH/PUT /articulo_de_divulgacions/1
  def update
    if @articulo_de_divulgacion.update(articulo_de_divulgacion_params)
      render json: @articulo_de_divulgacion
    else
      render json: @articulo_de_divulgacion.errors, status: :unprocessable_content
    end
  end

  # DELETE /articulo_de_divulgacions/1
  def destroy
    @articulo_de_divulgacion.destroy!
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_articulo_de_divulgacion
      @articulo_de_divulgacion = ArticuloDeDivulgacion.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def articulo_de_divulgacion_params
      params.require(:articulo_de_divulgacion).permit(
        :codigo,
        :nombre,
        :titulo,
        :grupo_de_investigacion_id,
        :query,
        :field,
        :sort
      )
    end
end
