# Importing required libraries
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
 
      print(loaded_model1,loaded_model2,loaded_model3)
      result = [loaded_model1.predict(data),loaded_model2.predict(data),loaded_model3.predict(data)]
      return result


# Flask app
app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')


@app.route('/predict', methods=['POST'])
def predict():
	if request.method == 'POST':	
            name = request.form['name']
            Gender = request.form['gender']
            Education = request.form['education']
            self_employed = request.form['self_employed']
            Married = request.form['marital_status']
            Dependents = request.form['dependents']
            applicant_income = request.form['applicant_income']
            CoapplicantIncome	 = request.form['coapplicant_income']
            loan_amount = request.form['loan_amount']
            loan_term = request.form['loan_term']
            Credit_History = request.form['credit_history']
            Property_Area = request.form['property_area']
            print(name, Gender,Education,self_employed,Married,Dependents,applicant_income,CoapplicantIncome,loan_amount,loan_term,Credit_History,Property_Area)
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
            print(df.dtypes)
            s=""
            if(Gender == "1" ):s="Mr"
            else:
                 if Married == "1":s="Ms"
                 else: s="Mrs"  
            result = ValuePredictor(data = df)
            j=0
            for i in result:    
                  print(i)
                  if int(i)==1:
                        j+=1
            if j >= 2:prediction = 'Dear {s} {name}, your loan is approved!'.format(s=s,name = name)
            else:prediction = 'Sorry {s} {name}, your loan is rejected!'.format(s=s,name = name)
            print(prediction)
            return render_template('prediction.html',prediction=prediction)
            
@app.route('/emi_calculator')
def emi():
    return render_template('emi.html')

if __name__ == '__main__':
    app.run(debug=True)
