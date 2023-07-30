from flask import Flask, render_template
from flask import Flask, request, jsonify
import pickle
import os
import json
import pandas as pd
import numpy as np
current_dir = os.path.dirname(__file__)
 
def ValuePredictor(data = pd.DataFrame):
      model_name1='./notebook/loan_prediction_model_LR.pkl'
      model_name2='./notebook/loan_prediction_model_DT.pkl'
      model_name3='./notebook/loan_prediction_model_RF.pkl'
      print(model_name1,model_name2,model_name3)
      model_dir=os.path.join(current_dir, model_name1)
      loaded_model1 = pickle.load(open(model_dir, 'rb'))
      model_dir=os.path.join(current_dir, model_name2)
      loaded_model2 = pickle.load(open(model_dir, 'rb'))
      model_dir=os.path.join(current_dir, model_name3)
      loaded_model3 = pickle.load(open(model_dir, 'rb'))
      result = [loaded_model1.predict(data),loaded_model2.predict(data),loaded_model3.predict(data)]
      return result


def CreditPredictor(data = pd.DataFrame):
      model_name1='./notebook/loan_prediction_model_ABc.pkl'
      model_name2='./notebook/loan_prediction_model_GBC.pkl'
      model_name3='./notebook/loan_prediction_model_SGDC.pkl'
      model_dir=os.path.join(current_dir, model_name1)
      loaded_model1 = pickle.load(open(model_dir, 'rb'))
      model_dir=os.path.join(current_dir, model_name2)
      loaded_model2 = pickle.load(open(model_dir, 'rb'))
      model_dir=os.path.join(current_dir, model_name3)
      loaded_model3 = pickle.load(open(model_dir, 'rb'))
      result = [loaded_model1.predict(data),loaded_model2.predict(data),loaded_model3.predict(data)]
      return result

# Flask app
app = Flask(__name__)

@app.route('/')
def home():
    return render_template('home.html')


@app.route('/documents')
def documents():
    return render_template('document.html')

@app.route('/predicts')
def predicts():
    return render_template('index.html')

import data
@app.route('/loan', methods=['GET', 'POST'])
def loan():
    selected_option = None
    content = None
    form_name=None
    if request.method == 'GET':
            name=request.args.get('name')
            content=data.o_c.get(name)
            print(content)
    return render_template('loan.html',content=content,name=name)
 

# @app.route('/credit_card')
# def credit_card():
#     return render_template('cc.html')

# @app.route('/credit_card', methods=['POST'])
# def credit_predict():
#        if request.method == 'POST':	
#             name = request.form['name']
#             Gender = request.form['Gender']
#             Has_a_car = request.form['Has_a_car']
#             Has_a_property = request.form['Has_a_property']
#             Educationlevel = request.form['Educationlevel']
#             Employmentstatus = request.form['Employmentstatus']
#             Income = request.form['Income']
#             Dwelling	 = request.form['Dwelling']
#             Maritalstatus = request.form['Maritalstatus']
#             Familymembercount = request.form['Familymembercount']
#             Children_count = request.form['Children_count']
#             Has_a_mobilephone= 1
#             Job_title=request.form['Job_title']
#             list={'Core staff':1, 'Accountants':2, 'Laborers':3, 'Managers':4, "NaN":0,'Sales staff':5, 'Medicine staff':6, 'High skill tech staff':7,'HR staff':8, 'Low-skill Laborers':9, 'Drivers':10, 'Secretaries':11,'Cleaning staff':12, 'Cooking staff':13, 'Security staff':14,'Private service staff':15, 'IT staff':16, 'Waiters/barmen staff':17,'Realty agents':18}
#             try:
#                 Job_title=list[Job_title]
#             except:
#                  Job_title=0
#             print(Gender,Has_a_car,Has_a_mobilephone,Has_a_property,Educationlevel,Employmentstatus,Dwelling,Income,Maritalstatus,Familymembercount,Children_count)
#             schema_name = 'data/columns_set_cc.json'
#             schema_dir= os.path.join(current_dir, schema_name)
#             with open(schema_dir, 'r') as f:
#                 cols =  json.loads(f.read())
#             schema_cols=cols['data_columns']
#             schema_cols['Gender'] = Gender
#             schema_cols['Has_a_car'] = Has_a_car
#             schema_cols['Has_a_property'] = Has_a_property
#             schema_cols['Children_count'] = Children_count
#             schema_cols['Income'] = Income
#             schema_cols['Employmentstatus'] = Employmentstatus	
#             schema_cols['Educationlevel'] = Educationlevel
#             schema_cols['Maritalstatus'] = Maritalstatus
#             schema_cols['Dwelling'] = Dwelling
#             schema_cols["Has_a_mobilephone"]=Has_a_mobilephone
#             schema_cols["Job_title"]=Job_title
#             schema_cols["Familymembercount"]=Familymembercount
#             df = pd.DataFrame(
# 				data = {k: [v] for k, v in schema_cols.items()},
# 				dtype = float
# 			)
#             result = CreditPredictor(data = df)
#             j=0
#             for i in result:    
#                   print(i)
#                   if int(i)==0:
#                         j+=1
#             if j >= 2:prediction = 'Dear  {name}, your Credit card application is approved!'.format(name = name)
#             else:prediction = 'Sorry {name}, your Credit card application is rejected!'.format(name = name)
#             print(prediction)
#             return render_template('prediction.html',prediction=prediction)
           
       

@app.route('/predict', methods=['POST'])
def predict():
	if request.method == 'POST':	
            name = request.form['name']
            Gender = request.form['gender']
            Education = request.form['education']
            self_employed = request.form['self_employed']
            Married = request.form['marital_status']
            Dependents = request.form['dependents']
            applicant_income = int(request.form['applicant_income'])/20
            CoapplicantIncome	 = int(request.form['coapplicant_income'])/20
            loan_amount = int(request.form['loan_amount'])/20
            loan_term = int(request.form['loan_term'])*30
            Credit_History = request.form['credit_history']
            Property_Area = request.form['property_area']
            dob=request.form['birthdate']
            print(name,dob, Gender,Education,self_employed,Married,Dependents,applicant_income,CoapplicantIncome,loan_amount,loan_term,Credit_History,Property_Area)
            
            s=""
            if(Gender == "1" ):s="Mr"
            else:
                if Married == "1":s="Ms"
                else: s="Mrs"  
            from datetime import date
            l=dob.split("-")
            today = date.today()
            age = today.year -int(l[0])- ((today.month, today.day) <(int(dob[1]),int(dob[2])))
            if age>20 and age<60:
                    schema_name = 'data/columns_set.json'
                    schema_dir= os.path.join(current_dir, schema_name)
                    with open(schema_dir, 'r') as f:
                        cols =  json.loads(f.read())
                    schema_cols=cols['data_columns']
                    schema_cols['Gender'] = Gender
                    schema_cols['Married'] = Married
                    schema_cols['Education'] = Education
                    schema_cols['Self_Employed'] = self_employed
                    schema_cols['ApplicantIncome'] = applicant_income
                    schema_cols['CoapplicantIncome'] = CoapplicantIncome	
                    schema_cols['LoanAmount'] = loan_amount
                    schema_cols['Loan_Amount_Term'] = loan_term
                    schema_cols['Credit_History'] = Credit_History
                    schema_cols["Property_Area"]=Property_Area
                    schema_cols["Dependents"]=Dependents
                    df = pd.DataFrame(
                        data = {k: [v] for k, v in schema_cols.items()},
                        dtype = float
                    )
                    # print(df.dtypes)
                    result = ValuePredictor(data = df)
                    j=0
                    for i in result:    
                        # print(i)
                        if int(i)==1:
                                j+=1
                    if j >= 2:prediction = 'Dear {s} {name}, you are Eligible !'.format(s=s,name = name)
                    else:prediction = 'Sorry {s} {name}, you are not Eligible !'.format(s=s,name = name)
                    # print(prediction)
                    return render_template('prediction.html',prediction=prediction)
            else:
                 prediction = 'Sorry {s} {name}, you are not Eligible!'.format(s=s,name = name)
                 return render_template('prediction.html',prediction=prediction)


@app.route('/emi_calculator')
def emi():
    return render_template('emi.html')

if __name__ == '__main__':
    app.run(debug=True)
