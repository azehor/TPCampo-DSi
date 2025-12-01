class MemoriasController < ApplicationController
  before_action :set_memoria, only: [
  :show, :update, :destroy,
  :add_patente, :remove_patente,
  :add_trabajo_en_revista, :remove_trabajo_en_revista,
  :add_publicacion_en_libro, :remove_publicacion_en_libro,
  :add_articulo_de_divulgacion, :remove_articulo_de_divulgacion,
  :patentes, :trabajos_en_revista, :publicaciones_en_libro, :articulos_de_divulgacion
]

  # GET /memorias
  def index
    if params.has_key?(:grupo)
      grupo_id = params[:grupo].to_i
      render json: Memoria.where(grupo_de_investigacion_id: grupo_id).as_json(include: full_includes)
    else
      render json: Memoria.all.as_json(include: full_includes)
    end
  end

  # GET /memorias/:id
  def show
    render json: @memoria.as_json(include: full_includes)
  end

  # POST /memorias
  def create
    memoria = Memoria.new(memoria_params)

    if memoria.save
      render json: memoria, status: :created
    else
      render json: memoria.errors, status: :unprocessable_entity
    end
  end

  # PUT/PATCH /memorias/:id
  def update
    if @memoria.update(memoria_params)
      render json: @memoria
    else
      render json: @memoria.errors, status: :unprocessable_entity
    end
  end

  # DELETE /memorias/:id
  def destroy
    @memoria.destroy
    head :no_content
  end

  # ASOCIACIONES CON LAS OTRAS TABLAS

  # Patentes
  def add_patente
    patente = Patente.find(params[:patente_id])
    @memoria.patentes << patente unless @memoria.patentes.include?(patente)
    render json: @memoria
  end

  def remove_patente
    patente = Patente.find(params[:patente_id])
    @memoria.patentes.delete(patente)
    head :no_content
  end

  # GET /memorias/:id/patentes
  def patentes
    if params.has_key?(:page) && params.has_key?(:limit)
      page = params[:page].to_i
      per_page = params[:limit].to_i
    else
      page = 0
      per_page = 15
    end
    count = @memoria.patentes.count
    content = @memoria.patentes.limit(per_page).offset(page * per_page)
    render json: {
      content: content.as_json(),
      metadata: {
        page: page,
        per_page: per_page,
        total_count: count
      }
    }
  end


  # Trabajo en revista
  def add_trabajo_en_revista
    trabajo = TrabajoEnRevista.find(params[:trabajo_en_revista_id])
    @memoria.trabajo_en_revistas << trabajo unless @memoria.trabajo_en_revistas.include?(trabajo)
    render json: @memoria
  end

  def remove_trabajo_en_revista
    trabajo = TrabajoEnRevista.find(params[:trabajo_en_revista_id])
    @memoria.trabajo_en_revistas.delete(trabajo)
    head :no_content
  end

  # GET /memorias/:id/trabajos_en_revista
  def trabajos_en_revista
    if params.has_key?(:page) && params.has_key?(:limit)
      page = params[:page].to_i
      per_page = params[:limit].to_i
    else
      page = 0
      per_page = 15
    end
    count = @memoria.trabajo_en_revistas.count
    content = @memoria.trabajo_en_revistas.limit(per_page).offset(page * per_page)
    render json: {
      content: content.as_json(include: {
        revista: {
          include: {
            pais: {}
          }
        }
      }),
      metadata: {
        page: page,
        per_page: per_page,
        total_count: count
      }
    }
  end

  # Publicación en libros
  def add_publicacion_en_libro
    pub = PublicacionEnLibro.find(params[:publicacion_en_libro_id])
    @memoria.publicacion_en_libros << pub unless @memoria.publicacion_en_libros.include?(pub)
    render json: @memoria
  end

  def remove_publicacion_en_libro
    pub = PublicacionEnLibro.find(params[:publicacion_en_libro_id])
    @memoria.publicacion_en_libros.delete(pub)
    head :no_content
  end

  # GET /memorias/:id/publicaciones_en_libro
  def publicaciones_en_libro
    if params.has_key?(:page) && params.has_key?(:limit)
      page = params[:page].to_i
      per_page = params[:limit].to_i
    else
      page = 0
      per_page = 15
    end
    count = @memoria.publicacion_en_libros.count
    content = @memoria.publicacion_en_libros.limit(per_page).offset(page * per_page)
    render json: {
      content: content.as_json(),
      metadata: {
        page: page,
        per_page: per_page,
        total_count: count
      }
    }
  end

  # Artículo de divulgación
  def add_articulo_de_divulgacion
    art = ArticuloDeDivulgacion.find(params[:articulo_de_divulgacion_id])
    @memoria.articulo_de_divulgacions << art unless @memoria.articulo_de_divulgacions.include?(art)
    render json: @memoria
  end

  def remove_articulo_de_divulgacion
    art = ArticuloDeDivulgacion.find(params[:articulo_de_divulgacion_id])
    @memoria.articulo_de_divulgacions.delete(art)
    head :no_content
  end

  # GET /memorias/:id/articulos_de_divulgacion
  def articulos_de_divulgacion
    if params.has_key?(:page) && params.has_key?(:limit)
      page = params[:page].to_i
      per_page = params[:limit].to_i
    else
      page = 0
      per_page = 15
    end
    count = @memoria.articulo_de_divulgacions.count
    content = @memoria.articulo_de_divulgacions.limit(per_page).offset(page * per_page)
    render json: {
      content: content.as_json(),
      metadata: {
        page: page,
        per_page: per_page,
        total_count: count
      }
    }
  end

  def full_includes
    {
      patentes: {},
      trabajo_en_revistas: {},
      publicacion_en_libros: {},
      articulo_de_divulgacions: {}
    }
  end

  private

  def set_memoria
    @memoria = Memoria.find(params[:id])
  end

  def memoria_params
    params.require(:memoria).permit(
      :anio,
      :grupo_de_investigacion_id
    )
  end
end
