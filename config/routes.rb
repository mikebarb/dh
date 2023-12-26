Rails.application.routes.draw do
  resources :people do 
    resources :orders
  end

  get 'stores/front', as: :shop_front
  get 'stores/back',  as: :shop_back
  post 'stores/orderdrink', as: :stores_orderdrink
  post 'stores/addperson', as: :stores_addperson

  # Defines the root path route ("/")
  # root "articles#index"
end
