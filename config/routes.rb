Rails.application.routes.draw do
  resources :buttons
  resources :people do 
    resources :orders
  end

  get 'stores/front', as: :shop_front
  get 'stores/back',  as: :shop_back
  get 'stores/brewster', as: :shop_brewster
  get 'stores/ready', as: :shop_ready
  post 'stores/orderdrink', as: :stores_orderdrink
  post 'stores/addperson', as: :stores_addperson
  post 'stores/updatestatus', as: :stores_updatestatus

  # Defines the root path route ("/")
  root 'shop#front'
end
