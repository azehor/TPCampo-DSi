class PatentesController < ApplicationController
  before_action :set_patente, only: %i[ show update destroy ]

  # GET /patentes
  def index
    if params.has_key?(:page) && params.has_key?(:limit)
      page = params[:page].to_i
      per_page = params[:limit].to_i
    else
      page = 0
      per_page = 15
    end
    count = Patente.count
    patentes = Patente.limit(per_page).offset(page * per_page)
    render json: {
      content: patentes.as_json,
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
        :grupo_de_investigacion_id
      )
    end
end
