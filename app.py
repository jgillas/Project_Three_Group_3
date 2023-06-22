from flask import Flask, render_template, jsonify
import pandas as pd
from sqlalchemy import create_engine
import os

# Replace the database_url with your actual database URL
engine_sqlite = create_engine('sqlite:///teen_births.sqlite')

path = os.path.join('Data','NCHS_-_U.S._and_State_Trends_on_Teen_Births.csv')

df = pd.read_csv(path)

df.to_sql('birth_rates', engine_sqlite, if_exists='replace', index=False)
