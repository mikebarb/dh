class StoresController < ApplicationController

  # GET /stores/front or /stores/front.json
  def front

# @people = Person
#	 .select('distinctOrders.*, people.*')
#	 .joins('LEFT OUTER JOIN (SELECT DISTINCT ON (person_id) * FROM orders 
#                              ORDER BY person_id, id desc)
#                              as distinctOrders ON distinctOrders.person_id = people.id')
#-----------------------------------------------------------------------------------
#orders_query1 = "SELECT DISTINCT ON (person_id) * FROM orders 
#          ORDER BY person_id, Updated_at ASC"
#result1 = Order.find_by_sql(orders_query1)
# =>
#"[
#   <Order id: 1, person_id: 1, drink: \"coffee\", status: \"new\", 
#     created_at: \"2023...\", updated_at: \"2023...\">, 
#   <Order id: 7, person_id: 2, drink: \"latte\", status: nil, 
#     created_at: \"2023...\", updated_at: \"2023...\">
#]"
#
#-------------------------------------------------------------------------------------
#orders_query2 = "SELECT DISTINCT ON (person_id) * FROM orders 
#          ORDER BY person_id, id DESC"
#result2fbs = Order.find_by_sql(orders_query2)
#result2e = ActiveRecord::Base.connection.execute(orders_query2)

# =>
#  "[
#  #<Order id: 10, person_id: 1, drink: \"tea\", status: \"new\",
#     created_at: \"2023...\", updated_at: \"2023-07-03 09:37:30.096285000 +0000\">, 
#  #<Order id: 9, person_id: 2, drink: \"chocolate\", status: \"new\", 
#     created_at: \"2023...\", updated_at: \"2023-07-03 09:26:51.662610000 +0000\">
#  ]"
# result = Order.all
# => <ActiveRecord::Relation [
  #<Order id: 1, person_id: 1, drink: "coffee", status: "new", created_at: "2023...", updated_at: "2023-06-14 04:50:54.202102000 +0000">, 
  #<Order id: 2, person_id: 1, drink: "milk", status: nil, created_at: "2023...", updated_at: "2023-06-14 22:11:02.103059000 +0000">, 
  #<Order id: 3, person_id: 1, drink: "soup", status: nil, created_at: "2023...", updated_at: "2023-06-15 04:45:49.378813000 +0000">, 
  #<Order id: 4, person_id: 1, drink: "soup", status: nil, created_at: "2023...", updated_at: "2023-06-15 04:49:40.183724000 +0000">, 
  #<Order id: 5, person_id: 1, drink: "soup", status: nil, created_at: "2023...", updated_at: "2023-06-15 04:54:31.246364000 +0000">, 
  #<Order id: 6, person_id: 1, drink: "choc", status: nil, created_at: "2023...", updated_at: "2023-06-15 04:55:47.456323000 +0000">, 
  #<Order id: 7, person_id: 2, drink: "latte", status: nil, created_at: "2023...", updated_at: "2023-06-16 12:20:36.812387000 +0000">, 
  #<Order id: 8, person_id: 2, drink: "coffee", status: "new", created_at: "2023...", updated_at: "2023-07-03 09:14:57.445021000 +0000">, 
  #<Order id: 9, person_id: 2, drink: "chocolate", status: "new", created_at: "2023...", updated_at: "2023-07-03 09:26:51.662610000 +0000">, 
  #<Order id: 10, person_id: 1, drink: "tea", status: "new", created_at: "2023...", updated_at: "2023-07-03 09:37:30.096285000 +0000">]>

#-------------------------------------------------------------------------------------
#result_query3 = "SELECT p.id, p.name, o.id, o.person_id, o.drink, o.status FROM people as p LEFT OUTER JOIN ( SELECT DISTINCT ON (person_id) * FROM orders 
#          ORDER BY person_id, id DESC ) as o ON o.person_id = p.id ORDER BY p.id"
#result3 = Order.find_by_sql(result_query3)

#result_query4 = "SELECT DISTINCT ON (orders.person_id) orders.* 
#                FROM orders 
#                ORDER BY person_id ASC, id desc"

#result4 = Order.find_by_sql(result_query4)
# =>
#"[#<Order id: 10, person_id: 1, drink: \"tea\", status: \"new\", created_at: \"2023...\", updated_at: \"2023...\">, 
#  #<Order id: 9, person_id: 2, drink: \"chocolate\", status: \"new\", created_at: \"2023...\", updated_at: \"2023...\">]"

#----------------------------------------------------------------------------------------------------------------------------
# This solution of an efficient database query to get last order for each person is found at
# https://www.salsify.com/blog/engineering/most-recent-by-group-in-rails 
# This solution only generates two database queries, with the pseudo last drink table eager loaded.
#----------------------------------------------------------------------------------------------------------------------------
@people = Person.includes(:last_order).all

#Started GET "/stores/front" for 172.29.0.1 at 2023-07-07 00:16:24 +0000
#Cannot render console from 172.29.0.1! Allowed networks: 127.0.0.0/127.255.255.255, ::1
#Processing by StoresController#front as HTML
#  Rendering layout layouts/application.html.erb
#  Rendering stores/front.html.erb within layouts/application
#  Person Load (0.3ms)  SELECT "people".* FROM "people"
#  ↳ app/views/stores/front.html.erb:6
#  Order Load (0.6ms)  SELECT "orders".* FROM         (
#          SELECT orders.*
#          FROM orders JOIN (
#            SELECT person_id, max(id) AS id
#                FROM orders
#                GROUP BY person_id
#          ) last_by_person
#          ON orders.id = last_by_person.id
#          AND orders.person_id = last_by_person.person_id
#        ) orders
# WHERE "orders"."person_id" IN ($1, $2, $3, $4)  [["person_id", 1], ["person_id", 2], ["person_id", 3], ["person_id", 4]]
#  ↳ app/views/stores/front.html.erb:6
#  Rendered stores/_frontperson.html.erb (Duration: 5.6ms | Allocations: 466)
#  Rendered stores/_frontperson.html.erb (Duration: 0.5ms | Allocations: 106)
#  Rendered stores/_frontperson.html.erb (Duration: 0.1ms | Allocations: 16)
#  Rendered stores/_frontperson.html.erb (Duration: 0.1ms | Allocations: 16)
#  Rendered stores/front.html.erb within layouts/application (Duration: 54.3ms | Allocations: 8017)
#  Rendered layout layouts/application.html.erb (Duration: 269.2ms | Allocations: 21121)
#Completed 200 OK in 331ms (Views: 272.5ms | ActiveRecord: 6.2ms | Allocations: 23388)


#(byebug) result5.inspect  (this is now @people, was result5 during development testing/assessment)
#  Person Load (0.5ms)  SELECT "people".* FROM "people" /* loading for inspect */ LIMIT $1  [["LIMIT", 11]]
#  ↳ (byebug):1:in `front'
#  Order Load (1.5ms)  SELECT "orders".* FROM         (
#          SELECT orders.*
#          FROM orders JOIN (
#            SELECT person_id, max(id) AS id
#                FROM orders
#                GROUP BY person_id
#          ) last_by_person
#          ON orders.id = last_by_person.id
#          AND orders.person_id = last_by_person.person_id
#        ) orders
# WHERE "orders"."person_id" IN ($1, $2, $3, $4)  [["person_id", 1], ["person_id", 2], ["person_id", 3], ["person_id", 4]]
#  ↳ (byebug):1:in `front'
#"#<ActiveRecord::Relation 
#[#<Person id: 1, name: \"Mike McAuliffe\", created_at: \"2023...\", updated_at: \"2023...\">, 
# #<Person id: 2, name: \"Barb McAuliffe\", created_at: \"2023...\", updated_at: \"2023...\">, 
# #<Person id: 3, name: \"Katie McAuliffe\", created_at: \"2023...\", updated_at: \"2023...\">, 
# #<Person id: 4, name: \"Mieke Rebel \", created_at: \"2023...\", updated_at: \"2023...\">]>"

#byebug

#-- This is the working version done by Dan -------------------------
#@people = Person
#.select('distinctOrders.*, people.*')
#.joins('LEFT OUTER JOIN (SELECT DISTINCT ON (person_id) * FROM orders 
#                            ORDER BY person_id, Updated_at DESC)
#                            as distinctOrders ON distinctOrders.person_id = people.id')
#--------------------------------------------------------------------                           
                           
### Dan ### Order.select('DISTINCT ON ("person_id") *').order(:person_id, updated_at: :desc).joins("INNER JOIN people on people.id = orders.person_id")
  #This seems to work, only problem is not retreiving all columns, might relate to db??
  #Person.select('DISTINCT ON (orders.person_id) orders.*, people.*').joins("INNER JOIN orders on orders.person_id = people.id").order("orders.person_id ASC", "orders.updated_at DESC")
#----------------------------------------------------------------------------------------------
     
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

