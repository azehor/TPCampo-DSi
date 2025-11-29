class ArticuloDeDivulgacionsController < ApplicationController
  before_action :set_articulo_de_divulgacion, only: %i[ show update destroy ]

  # GET /articulo_de_divulgacions
  def index
    if params.has_key?(:page) && params.has_key?(:limit)
      page = params[:page].to_i
      per_page = params[:limit].to_i
    else
      page = 0
      per_page = 15
    end
    count = ArticuloDeDivulgacion.count
    articulos = ArticuloDeDivulgacion.limit(per_page).offset(page * per_page)
    render json: {
      content: articulos.as_json,
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
        :grupo_de_investigacion_id
      )
    end
end
