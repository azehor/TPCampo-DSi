class PublicacionEnLibrosController < ApplicationController
  before_action :set_publicacion_en_libro, only: %i[ show update destroy ]

  # GET /publicacion_en_libros
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
    if params.has_key?(:field) && params.has_key?(:sort)
      field = params[:field]
      sort = params[:sort]
    else
      field = "publicacion_en_libros.created_at"
      sort = "desc"
    end
    count = PublicacionEnLibro.count
    publicaciones = PublicacionEnLibro
      .joins(:grupo_de_investigacion)
      .select("grupo_de_investigacions.nombre as grupo", :codigo, :titulo, :libro, :capitulo, :grupo_de_investigacion_id, :id)
      .query_tables(query)
      .limit(per_page).offset(page * per_page)
      .order(PublicacionEnLibro.sanitize_sql_for_order("#{field} #{sort}"))
    render json: {
      content: publicaciones.as_json(include: {
          grupo_de_investigacion: {}
      }),
      metadata: {
        page: page,
        per_page: per_page,
        total_count: count
      }
    }
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
        :grupo_de_investigacion_id,
        :query,
        :field,
        :sort
      )
    end
end
