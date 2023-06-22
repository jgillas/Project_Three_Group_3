from flask import Flask, render_template, jsonify
import pandas as pd
from sqlalchemy import create_engine, func
import os
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from datetime import datetime as dt

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
    f"/api/v1.0/agegroups<br/>"
    f"Average Teen Births Per Year<br/>"
    f"/api/v1.0/[start_year format:yyyy]/[end_year format:yyyy]<br/>"
    f"Teen Birth Info By Year<br/>"
    f"/api/v1.0/[start_year format:yyyy]<br/>"
  )

@app.route("/api/v1.0/agegroups")
def age_groups():
  results = session.query(birth_rates.age_groups, birth_rates.state_rate).all()
  
  session.close()
  
  all_age_groups = []
  for age_groups, state_rate in results:
      age_group_dict = {}
      age_group_dict["15-17 years"] = age_groups
      age_group_dict["15-19 years"] = age_groups
      age_group_dict["18-19 years"] = age_groups
      age_group_dict["state rate"] = state_rate
      all_age_groups.append(age_group_dict)
      
      return jsonify(all_age_groups)
  
  
@app.route("/api/v1.0/<start_year>/<end_year>")
def Start_end_year(start_year, end_year):
    
    start_year= dt.strptime(start_year, '%YYYY')
    end_year = dt.strptime(end_year, '%YYYY')
    
    start_end_births = session.query(func.avg(birth_rates.state_births)).\
        filter(birth_rates.year >= start_year).filter(birth_rates.year <= end_year).all()
    
    results = start_end_births[0]
    
    session.close()
    
    start_end_births_state = []
    start_end_births_state_dict = {}
    start_end_births_state_dict ["Avg"] = results[0]
    start_end_births_state.append(start_end_births_state_dict)
    
    return jsonify(start_end_births_state)

@app.route("/api/v1.0/<start_year>")
def Start_year(start_year): 
    
    start_year = dt.strptime(start_year, '%Y')
    
    year_start = session.query(func.min(birth_rates.state_births), func.max(birth_rates.state_births)).\
        filter(birth_rates.year >= start_year).all()
        
    results = year_start[0]
    
    session.close()
    
    start_year_births = []
    start_year_births_dict = {}
    start_year_births_dict ["Min"] = results[0]
    start_year_births_dict ["Max"] = results[1]
    start_year_births.append(start_year_births_dict)
    
    return jsonify(start_year_births)

if __name__ == '__main__':
  app.run(debug=True)

