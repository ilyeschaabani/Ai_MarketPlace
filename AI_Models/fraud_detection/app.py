from flask import Flask, request, jsonify
import pandas as pd
import pickle
import datetime
import os
from flask_cors import CORS


app = Flask(__name__)
CORS(app) 

# Load model and scaler from your path
folder_path = r"D:\mmm\mmm\2025-2026 5SAE1\AI\projet"
model_path = os.path.join(folder_path, "rf_fraud_model.pkl")
scaler_path = os.path.join(folder_path, "scaler.pkl")

with open(model_path, 'rb') as f:
    model = pickle.load(f)

with open(scaler_path, 'rb') as f:
    scaler = pickle.load(f)

# Define feature lists
numerical_features = ['odometer', 'powerPS', 'car_age']
categorical_features = ['brand', 'fuelType', 'gearbox', 'vehicleType']

def map_annonce_to_model_input(annonce_data):
    """
    Map annonce + voiture data to model input format
    
    Expected input format from your API:
    {
        "marque": "Toyota",
        "annee": 2020,
        "puissance": 132,
        "carburant": "Essence",
        "transmission": "Automatique",
        "odometer": 50000,
        "notRepairedDamage": false
    }
    """
    # Map French field names to German model field names
    fuel_type_map = {
        'Essence': 'benzin',
        'Diesel': 'diesel',
        'Électrique': 'elektro',
        'Hybride': 'hybrid',
        'GPL': 'lpg',
        'GNC': 'cng',
        'Autre': 'andere'
    }
    
    gearbox_map = {
        'Manuelle': 'manuell',
        'Automatique': 'automatik'
    }
    
    brand_map = {
        'Toyota': 'toyota',
        'BMW': 'bmw',
        'Mercedes': 'mercedes_benz',
        'Audi': 'audi',
        'Volkswagen': 'volkswagen',
        'Renault': 'renault',
        'Peugeot': 'peugeot',
        'Citroën': 'citroen',
        'Ford': 'ford',
        'Opel': 'opel'
    }
    
    # Default vehicleType to 'andere' if not provided
    vehicle_type = 'andere'  # You can add this field to your annonce if needed
    
    return {
        'yearOfRegistration': annonce_data.get('annee'),
        'powerPS': int(annonce_data.get('puissance', 0)),
        'odometer': annonce_data.get('odometer', 0),
        'brand': brand_map.get(annonce_data.get('marque'), 'andere'),
        'fuelType': fuel_type_map.get(annonce_data.get('carburant'), 'andere'),
        'gearbox': gearbox_map.get(annonce_data.get('transmission'), 'manuell'),
        'vehicleType': vehicle_type,
        'notRepairedDamage': 'not repaired' if annonce_data.get('notRepairedDamage') else 'repaired'
    }



# Function to calculate anomaly flags
def calculate_anomalies(df):
    min_year, max_year = 1950, datetime.datetime.now().year
    df['year_anomaly'] = df['yearOfRegistration'].apply(lambda x: 1 if (pd.isna(x) or x < min_year or x > max_year) else 0)
    df['car_age'] = datetime.datetime.now().year - df['yearOfRegistration']
    df['mileage_anomaly'] = df.apply(lambda x: 1 if (x['odometer'] > 500000 or x['odometer'] < 0 or x['car_age'] < 0) else 0, axis=1)
    df['power_anomaly'] = df['powerPS'].apply(lambda x: 1 if x < 10 or x > 1000 else 0)
    df['repair_anomaly'] = df['notRepairedDamage'].apply(lambda x: 1 if x not in ['repaired', 'not repaired'] else 0)
    df['duplicate_anomaly'] = 0
    df['fuelType_anomaly'] = df['fuelType'].apply(lambda x: 0 if x in ['lpg','benzin','diesel','cng','hybrid','elektro','andere'] else 1)
    df['gearbox_anomaly'] = df['gearbox'].apply(lambda x: 0 if x in ['manuell','automatik'] else 1)
    df['vehicleType_anomaly'] = df['vehicleType'].apply(lambda x: 0 if x in ['bus','limousine','kleinwagen','kombi','coupe','suv','cabrio','andere'] else 1)
    df['brand_anomaly'] = df['brand'].apply(lambda x: 0)  # default 0 for simplicity; can check against training brands
    return df

# Health check route
@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'message': 'Fraud detection API is running'})

# Prediction route
@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        
        # Map your annonce data to model input format
        model_input = map_annonce_to_model_input(data)
        
        df_new = pd.DataFrame([model_input])
        
        # Calculate anomalies
        df_new = calculate_anomalies(df_new)
        
        # One-hot encode categorical features
        df_new = pd.get_dummies(df_new, columns=categorical_features, drop_first=True)
        
        # Align columns with training data
        for col in model.feature_names_in_:
            if col not in df_new.columns:
                df_new[col] = 0
        df_new = df_new[model.feature_names_in_]
        
        # Scale numerical features
        df_new[numerical_features] = scaler.transform(df_new[numerical_features])
        
        # Predict
        pred = model.predict(df_new)[0]
        prob = model.predict_proba(df_new)[:,1][0]
        
        # Determine fraud level
        fraud_level = 'high' if prob > 0.7 else ('medium' if prob > 0.4 else 'low')
        
        return jsonify({
            'success': True,
            'fraud_prediction': int(pred),
            'fraud_probability': float(prob),
            'fraud_level': fraud_level,
            'is_fraud': bool(pred == 1)
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)
