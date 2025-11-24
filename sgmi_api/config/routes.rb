Rails.application.routes.draw do
  # Público
  post "/login", to: "auth#login"

  # Rutas protegidas por autenticación
  scope "/api" do
    resources :users, only: [ :create ]        # Solo admin
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
    # Cambiar contraseña
    patch "/change_password", to: "users#change_password"
  end

  get "up" => "rails/health#show", as: :rails_health_check
end
