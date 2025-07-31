# downloading dataset from kaggle api
from kaggle.api.kaggle_api_extended import KaggleApi

api = KaggleApi() 
api.authenticate()

#extracting file from zip file
api.dataset_download_files(
    'ankitbansal06/retail-orders',
    path='data',
    unzip=True
)

import pandas as pd

df = pd.read_csv('data/orders.csv')
print(df)
 
# reading data from the file and handling the null values
df = pd.read_csv('data/orders.csv', na_values=['Not Available', 'unknown'])
print(df['Ship Mode'].unique())

#renaming column names and making them lower case and replacing space with underscore
df.columns = df.columns.str.lower().str.replace(' ', '_') # using str because, df.columns is a list-like object made of strings, as ,.str gives you access to string methods applied element-wise to the column names.
print(df.columns)
print(df.head(4))

# deriving new columns discount , sale price and profit
df['discount'] = df['list_price'] * df['discount_percent'] * 0.01
print(df['discount'])

df['sale_price'] = df['list_price'] - df['discount']
print(df['sale_price'])

df['total_profit'] = df['sale_price'] - df['cost_price']
print(df['total_profit'])

# convert order date from object data type to datetime

df['order_date'] = pd.to_datetime(df['order_date'])
print(df['order_date'].dtype)


import sqlalchemy as sal

engine = sal.create_engine('mysql+mysqlconnector://root:Tushar2701__@localhost:3306/retail_store')

conn = engine.connect()

#load the data into sql server using append option
df.to_sql('df_orders', con=conn , index=False, if_exists = 'append')