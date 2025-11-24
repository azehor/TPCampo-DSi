class PublicacionEnLibrosController < ApplicationController
  before_action :set_publicacion_en_libro, only: %i[ show update destroy ]

  # GET /publicacion_en_libros
  def index
    @publicacion_en_libros = PublicacionEnLibro.all

    render json: @publicacion_en_libros
  end

  # GET /publicacion_en_libros/1
  def show
    render json: @publicacion_en_libro
  end

  # POST /publicacion_en_libros
  def create
    @publicacion_en_libro = PublicacionEnLibro.new(publicacion_en_libro_params)

    if @publicacion_en_libro.save
      render json: @publicacion_en_libro, status: :created, location: @publicacion_en_libro
    else
      render json: @publicacion_en_libro.errors, status: :unprocessable_content
    end
  end

  # PATCH/PUT /publicacion_en_libros/1
  def update
    if @publicacion_en_libro.update(publicacion_en_libro_params)
      render json: @publicacion_en_libro
    else
      render json: @publicacion_en_libro.errors, status: :unprocessable_content
    end
  end

  # DELETE /publicacion_en_libros/1
  def destroy
    @publicacion_en_libro.destroy!
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_publicacion_en_libro
      @publicacion_en_libro = PublicacionEnLibro.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def publicacion_en_libro_params
      params.require(:publicacion_en_libro).permit(
        :codigo,
        :titulo,
        :capitulo,
        :libro,
        :grupo_de_investigacion_id
      )
    end
end
