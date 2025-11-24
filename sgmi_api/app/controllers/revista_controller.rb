class RevistaController < ApplicationController
  before_action :set_revistum, only: %i[ show update destroy ]

  # GET /revista
  def index
    @revista = Revista.all

    render json: @revista
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
