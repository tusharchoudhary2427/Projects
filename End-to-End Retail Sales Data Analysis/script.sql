create database retail_store;
use retail_store;

-- drop table df_orders;

create table df_orders (
    order_id int,
    order_date date,
    ship_mode varchar(50),
    segment varchar(50),
    country varchar(50),
    city varchar(50),
    state varchar(50),
    postal_code int,
    region varchar(50),
    category varchar(50),
    sub_category varchar(50),
    product_id varchar(50),
    cost_price float,
    list_price float,
    quantity int,
    discount_percent float,
    discount float,
    sale_price float,
    total_profit float
);
select * from df_orders;

-- finding top 10 highest reveue generating products 
select product_id, sum(sale_price) as sales
from df_orders
group by product_id
order by sales desc
limit 10;

-- find top 5 highest selling products in each region
with cte as (
select region,product_id,sum(sale_price) as sales
from df_orders
group by region,product_id)
select * from (
select *
, row_number() over(partition by region order by sales desc) as rn
from cte) A
where rn<=5;

-- find month over month growth comparison for 2022 and 2023 sales eg : jan 2022 vs jan 2023
with monthly_sales as (
  select 
    year(order_date) as order_year,
    month(order_date) as order_month,
    sum(sale_price) as total_sales
  from df_orders
  group by order_year, order_month
)

select 
  order_month,
  round(sum(case when order_year = 2022 then total_sales else 0 end), 3) as sales_2022,
  round(sum(case when order_year = 2023 then total_sales else 0 end), 3) as sales_2023
from monthly_sales
group by order_month
order by order_month;

-- for each category which month had highest sales
with monthly_sales AS (
  select
    category,
    date_format(order_date, '%Y/%m') as order_year_month,
    sum(sale_price) as total_sales
  from df_orders
  group by category, date_format(order_date, '%Y/%m')
)
select category,order_year_month, round(total_sales, 3) as sales
from (select *, row_number() over (partition by category order by total_sales desc) as rn from monthly_sales) 
ranked where rn = 1;




 





