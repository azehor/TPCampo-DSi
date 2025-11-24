class TrabajoEnRevistaController < ApplicationController
  before_action :set_trabajo_en_revistum, only: %i[ show update destroy ]

  # GET /trabajo_en_revista
  def index
    @trabajo_en_revista = TrabajoEnRevista.all

    render json: @trabajo_en_revista
  end

  # GET /trabajo_en_revista/1
  def show
    render json: @trabajo_en_revistum
  end

  # POST /trabajo_en_revista
  def create
    @trabajo_en_revistum = TrabajoEnRevista.new(trabajo_en_revistum_params)

    if @trabajo_en_revistum.save
      render json: @trabajo_en_revistum, status: :created, location: @trabajo_en_revistum
    else
      render json: @trabajo_en_revistum.errors, status: :unprocessable_content
    end
  end

  # PATCH/PUT /trabajo_en_revista/1
  def update
    if @trabajo_en_revistum.update(trabajo_en_revistum_params)
      render json: @trabajo_en_revistum
    else
      render json: @trabajo_en_revistum.errors, status: :unprocessable_content
    end
  end

  # DELETE /trabajo_en_revista/1
  def destroy
    @trabajo_en_revistum.destroy!
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_trabajo_en_revistum
      @trabajo_en_revistum = TrabajoEnRevista.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def trabajo_en_revistum_params
      params.require(:trabajo_en_revista).permit(
        :titulo,
        :codigo,
        :revista_id,
        :grupo_de_investigacion_id
      )
    end
end
