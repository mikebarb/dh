class StoresController < ApplicationController

  # GET /stores/front or /stores/front.json
  def front
    #----------------------------------------------------------------------------------------------------------------------------
    # This solution of an efficient database query to get last order for each person is found at
    # https://www.salsify.com/blog/engineering/most-recent-by-group-in-rails 
    # This solution only generates two database queries, with the pseudo last drink table eager loaded.
    #----------------------------------------------------------------------------------------------------------------------------
    @people = Person.includes(:last_order).all
  end

  # GET /people/1 or /people/1.json
  def back
     @orders = Order
               .all
#               .include ("person")
  end

  # GET /stores/ready
  def ready
    @person = Person.new
  end

end

