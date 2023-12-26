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

  # POST /people or /people.json
  def addperson
    @addperson = Person.new
    # @addperson = Person.new(addperson_params)
    @addperson.name = params["name"]
    respond_to do |format|
      if @addperson.save
        #format.html { redirect_to shop_front_url, notice: "Person was successfully created." }
        #@people = Person.includes(:last_order).all
        #format.html {render :front}
        format.html { render :_frontperson, locals: { person: @addperson }}
        format.json { render :show, status: :created, location: @addperson }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @addperson.errors, status: :unprocessable_entity }
      end
    end
  end

  # CREATE /stores/orderdrink
  # this will create a drink for this  person - person entry already exists
  def orderdrink
    #byebug
    if params[:commit] == "order"
      #byebug
      #checkorderdrink_params
      @person = Person.includes(:last_order).find(params[:id])
      #if @person.last_order.status != "new"
      if @person.last_order.status == "new"
        flash.now.alert = "Already ordered!"
        render :orderdrink
        return
      end
      #@person.orders.create! params.required(:order).permit(:drink, :status)
      #redirect_to @person
      @thisOrder = @person.orders.new drink: params[:drink]
      respond_to do |format|
        if @thisOrder.save
          format.html { 
            flash.now.notice = "Order placed."
            render :orderdrink 
          }
        else
          format.html { 
            flash.now.alert = "failed to submit"
            render :orderdrink  
          }
        end
      end
    elsif params[:commit] == "remove"
      #byebug
      @person = Person.includes(:last_order).find(params[:id])
      #if @person.last_order.status != "new"
      if @person.last_order.status != "new"
        flash.now.alert = "Cannot remove - already made!"
        render :orderdrink
        return
      end
      #@person.orders.create! params.required(:order).permit(:drink, :status)
      #redirect_to @person
      @thisOrder = @person.last_order
      @thisOrder.status = "cancelled"
      respond_to do |format|
        if @thisOrder.save
          format.html { 
            flash.now.notice = "Order cancelled."
            render :orderdrink 
          }
        else
          format.html { 
            flash.now.alert = "failed to update"
            render :orderdrink  
          }
        end
      end
    end
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

  private
  # Use callbacks to share common setup or constraints between actions.

  # Only allow a list of trusted parameters through.
  def checkorderdrink_params
    params.require(:id, :drink)
  end

end

