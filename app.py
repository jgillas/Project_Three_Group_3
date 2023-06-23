from flask import Flask, render_template, jsonify
import pandas as pd
from sqlalchemy import create_engine, func
import os
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from datetime import datetime as dt
import numpy as np

engine_sqlite = create_engine('sqlite:///teen_births.sqlite')
Base = automap_base()
Base.prepare(engine_sqlite, reflect=True)

mapped_classes = Base.classes.keys()
for class_name in mapped_classes:
    print(class_name)

birth_rates = Base.metadata.tables['birth_rates']
session = Session(engine_sqlite)

app = Flask(__name__)

@app.route("/")
def welcome():
  return (
    f"Welcome to the Homepage for Teen Births in the U.S. Analysis. The avaliable routes are listed below.<br/>"
    f"Teen Births Based on Age Group<br/>"
    f"/api/v1.0/state<br/>"
    f"Average Teen Births Per Year<br/>"
    f"/api/v1.0/[start_year format:yyyy]/[end_year format:yyyy]<br/>"
    f"Teen Birth Info By Year<br/>"
    f"/api/v1.0/[start_year format:yyyy]<br/>"
  )

@app.route("/api/v1.0/state")
def state():
    
  results = session.query(birth_rates.columns.state_rate, birth_rates.columns.state, birth_rates.columns.year).\
      filter(birth_rates.columns.year).all()
  
  session.close()
  
  all_age_groups = []
  for state_rate, state, year in results:
      age_group_dict = {}
      age_group_dict["state rate"] = state_rate
      age_group_dict["state"] = state
      age_group_dict["year"] = year
      all_age_groups.append(age_group_dict)
  
  return jsonify(all_age_groups)
  
  
@app.route("/api/v1.0/<int:start_year>/<int:end_year>")
def Start_end_year(start_year, end_year):

    start_end_births = session.query(func.avg(birth_rates.columns.state_births),birth_rates.columns.state, birth_rates.columns.year).\
        group_by(birth_rates.columns.year, birth_rates.columns.state).filter(birth_rates.columns.year >= start_year).filter(birth_rates.columns.year <= end_year).all()
    
    
    session.close()
    

    start_end_births_state = []
    for state_births, state, year in start_end_births:
        start_end_births_state_dict = {}
        start_end_births_state_dict ["Avg"] = state_births
        start_end_births_state_dict ["state"] = state
        start_end_births_state_dict ["year"] = year
        start_end_births_state.append(start_end_births_state_dict)
    
    return jsonify(start_end_births_state)

@app.route("/api/v1.0/<int:start_year>")
def Start_year(start_year): 

    year_start = session.query(func.min(birth_rates.columns.state_births),func.max(birth_rates.columns.state_births),birth_rates.columns.state, birth_rates.columns.year).\
        group_by(birth_rates.columns.year, birth_rates.columns.state).filter(birth_rates.columns.year >= start_year).filter(birth_rates.columns.year <= start_year).all()

    session.close()
    
    temps = list(np.ravel(year_start))
    return jsonify(temps)
    
    start_year_births = []
    
    return jsonify(start_year_births)

if __name__ == '__main__':
  app.run(debug=True)

