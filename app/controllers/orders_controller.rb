class OrdersController < ApplicationController
  before_action :set_person

  def create
    @person.orders.create! params.required(:order).permit(:drink, :status)
    redirect_to @person
  end

  private
    def set_person
      @person = Person.find(params[:person_id])
    end
end
