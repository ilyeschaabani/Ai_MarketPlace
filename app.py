# app.py
from flask import Flask, render_template, request, jsonify
import joblib
import numpy as np
import pandas as pd
from sklearn.base import TransformerMixin, BaseEstimator

# -------------------------------------
# 🔧 Define FeatureBuilder (needed to unpickle pipeline)
# -------------------------------------
class FeatureBuilder(TransformerMixin, BaseEstimator):
    def fit(self, X, y=None):
        return self
    def transform(self, X):
        X = X.copy()
        X["age"] = 2025 - pd.to_numeric(X["year"], errors="coerce")
        X["miles_per_year"] = X["mileage"] / X["age"].replace(0, np.nan)
        X["is_dealer"] = (X["seller_type"] == "dealer").astype(int)
        return X

# -------------------------------------
# Load model and pipeline
# -------------------------------------
app = Flask(__name__)
model = joblib.load("model.joblib")
pipeline = joblib.load("feature_pipeline.joblib")

# Column names
MODEL_COL = "model"
MAKE_COL = "make"
YEAR_COL = "year"
MILEAGE_COL = "mileage"
SELLER_COL = "seller_type"

# -------------------------------------
# Routes
# -------------------------------------
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        car_make = request.form['make']
        car_model = request.form['model']
        year = int(request.form['year'])
        mileage = float(request.form['mileage'])
        seller = request.form['seller']

        row = pd.DataFrame([{
            MAKE_COL: car_make,
            MODEL_COL: car_model,
            YEAR_COL: year,
            MILEAGE_COL: mileage,
            SELLER_COL: seller
        }])

        X_new = pipeline.transform(row)
        prediction = model.predict(X_new)[0]

        return render_template('index.html',
                               prediction_text=f"Estimated price: ${prediction:,.2f}")

    except Exception as e:
        return render_template('index.html', prediction_text=f"Error: {str(e)}")

if __name__ == '__main__':
    app.run(debug=True)
