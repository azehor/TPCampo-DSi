Rails.application.routes.draw do
  resources :facultad_regionales
  resources :personals
  resources :investigadors
  resources :grupo_de_investigacions
  resources :pais
  get "up" => "rails/health#show", as: :rails_health_check
end
