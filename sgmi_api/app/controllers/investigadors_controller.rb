class InvestigadorsController < ApplicationController
  def index
    if params.has_key?(:page) && params.has_key?(:limit)
      page = params[:page].to_i
      per_page = params[:limit].to_i
    else
      page = 0
      per_page = 15
    end

    count = Investigador.count
    investigadores = Investigador.includes(:personal, :user)
      .limit(per_page).offset(page * per_page)

    render json: {
      content: investigadores.as_json(
        include: { personal: {}, user: {} }
      ), metadata: {
        page: page,
        per_page: per_page,
        total_count: count
      }
    }
  end

  def show
    render json: Investigador.find(params[:id])
  end

  def create
    investigador = Investigador.new(investigador_params)
    if investigador.save
      render json: investigador, status: :created
    else
      render json: investigador.errors, status: :unprocessable_entity
    end
  end

  def update
    investigador = Investigador.find(params[:id])
    if investigador.update(investigador_params)
      render json: investigador
    else
      render json: investigador.errors, status: :unprocessable_entity
    end
  end

  def destroy
    investigador = Investigador.find(params[:id])
    investigador.destroy
    head :no_content
  end

  private

  def investigador_params
    params.require(:investigador).permit(
      :categoria,
      :dedicacion,
      :personal_id,
      :user_id
    )
  end
end
