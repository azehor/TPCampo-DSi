Rails.application.routes.draw do
  # Público
  post "/login", to: "auth#login"

  # Rutas protegidas por autenticación
  scope "/api" do
    resources :users, only: [ :create ]  # Solo admin

    resources :facultad_regionales
    resources :personals
    resources :investigadors
    resources :grupo_de_investigacions
    resources :pais
    resources :patentes
    resources :revista
    resources :trabajo_en_revista
    resources :articulo_de_divulgacions
    resources :publicacion_en_libros

    # MEMORIAS
    resources :memorias do
      member do
        # MEMORIA-PATENTES
        post   "patentes/:patente_id", to: "memorias#add_patente"
        delete "patentes/:patente_id", to: "memorias#remove_patente"
        get "patentes",                 to: "memorias#patentes"

        # MEMORIA-TRABAJO EN REVISTA
        post   "trabajo_en_revista/:trabajo_en_revista_id", to: "memorias#add_trabajo_en_revista"
        delete "trabajo_en_revista/:trabajo_en_revista_id", to: "memorias#remove_trabajo_en_revista"
        get "trabajos_en_revista",      to: "memorias#trabajos_en_revista"

        # MEMORIA-PUBLICACION EN LIBROS
        post   "publicacion_en_libros/:publicacion_en_libro_id", to: "memorias#add_publicacion_en_libro"
        delete "publicacion_en_libros/:publicacion_en_libro_id", to: "memorias#remove_publicacion_en_libro"
        get "publicaciones_en_libro",   to: "memorias#publicaciones_en_libro"

        # MEMORIA-ARTICULO DE DIVULGACION
        post   "articulo_de_divulgacions/:articulo_de_divulgacion_id", to: "memorias#add_articulo_de_divulgacion"
        delete "articulo_de_divulgacions/:articulo_de_divulgacion_id", to: "memorias#remove_articulo_de_divulgacion"
        get "articulos_de_divulgacion", to: "memorias#articulos_de_divulgacion"
      end
    end

    # EXPORTAR A EXCEL
    get "/exportar", to: "excel#generar"

    # CAMBIO DE CONTRASEÑA (fuera de memorias)
    patch "/change_password", to: "users#change_password"
  end

  get "up" => "rails/health#show", as: :rails_health_check
end
