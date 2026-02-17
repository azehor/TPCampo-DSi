class RevistaController < ApplicationController
  before_action :set_revistum, only: %i[ show update destroy ]

  # GET /revista
  def index
    if params.has_key?(:page) && params.has_key?(:limit)
      # Con paginación
      page = params[:page].to_i
      per_page = params[:limit].to_i
      count = Revista.count
      revistas = Revista
        .order(created_at: :desc)
        .limit(per_page)
        .offset(page * per_page)
      
      render json: {
        content: revistas.as_json(include: { pais: {} }),
        metadata: {
          page: page,
          per_page: per_page,
          total_count: count
        }
      }
    else
      # Sin paginación - traer todos
      revistas = Revista.order(created_at: :desc)
      render json: revistas.as_json(include: { pais: {} })
    end
  end

  # GET /revista/1
  def show
    render json: @revistum
  end

  # POST /revista
  def create
    @revistum = Revista.new(revistum_params)

    if @revistum.save
      render json: @revistum, status: :created, location: @revistum
    else
      render json: @revistum.errors, status: :unprocessable_content
    end
  end

  # PATCH/PUT /revista/1
  def update
    if @revistum.update(revistum_params)
      render json: @revistum
    else
      render json: @revistum.errors, status: :unprocessable_content
    end
  end

  # DELETE /revista/1
  def destroy
    @revistum.destroy!
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_revistum
      @revistum = Revista.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def revistum_params
      params.require(:revista).permit(
        :editorial,
        :issn,
        :nombre,
        :pais_id
      )
    end
end
