# 🧪 Postman Testing Guide - Insurance Risk Integration

Complete guide to test the Insurance Risk Analyzer using Postman.

---

## 📋 Prerequisites

- ✅ Postman installed (download from https://www.postman.com/downloads/)
- ✅ Flask service running on port 5002
- ✅ Node.js backend running on port 5000
- ✅ MySQL database running

---

## 🎯 Test Flow Overview

```
Test 1: Health Checks
   ↓
Test 2: Test Flask Insurance API directly
   ↓
Test 3: Create a Car (voiture)
   ↓
Test 4: Create Listing (annonce) with Insurance
   ↓
Test 5: View all listings with insurance data
```

---

## 📝 Postman Collection Setup

### Create New Collection
1. Open Postman
2. Click "New" → "Collection"
3. Name it: **"AI Marketplace - Insurance Risk"**
4. Add description: "Testing Insurance Risk Analyzer integration"

---

## 🧪 TEST 1: Health Check - Flask Insurance API

**Purpose:** Verify Flask service is running

### Request Setup:
- **Method:** `GET`
- **URL:** `http://localhost:5002/health`
- **Headers:** None needed

### Expected Response:
```json
Status: 200 OK

{
  "status": "ok",
  "service": "insurance-risk-analyzer",
  "version": "1.0.0"
}
```

### ✅ Success Criteria:
- Status code is 200
- Response contains "status": "ok"

### ❌ If it fails:
```powershell
# Start Flask service
cd c:\Users\ilyes\insurance-risk-analyzer
.\.venv\Scripts\activate
python app.py
```

---

## 🧪 TEST 2: Health Check - Backend API

**Purpose:** Verify Node.js backend is running

### Request Setup:
- **Method:** `GET`
- **URL:** `http://localhost:5000/`
- **Headers:** None needed

### Expected Response:
```json
Status: 200 OK

{
  "message": "Bienvenue sur l'API de gestion des voitures",
  "version": "2.0.0",
  "database": "MySQL",
  "endpoints": {
    "POST /api/voitures": "Créer une voiture",
    "GET /api/voitures": "Récupérer toutes les voitures",
    ...
  }
}
```

### ✅ Success Criteria:
- Status code is 200
- Response contains version "2.0.0"

---

## 🧪 TEST 3: Direct Insurance Risk Prediction

**Purpose:** Test Flask ML model directly

### Request Setup:
- **Method:** `POST`
- **URL:** `http://localhost:5002/predict`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body (raw JSON):**
  ```json
  {
    "carYear": 2019,
    "carValue": 48000,
    "numberOfAccidents": 1,
    "yearsOfExperience": 6
  }
  ```

### Expected Response:
```json
Status: 200 OK

{
  "success": true,
  "riskScore": 0.306,
  "insuranceCost": 743.04,
  "riskLevel": "medium",
  "message": "Le risque estimé pour ce véhicule est de 0.306 et la prime d'assurance estimée est de 743.04 TND/an."
}
```

### Test Variations:

#### A) High Risk Test
**Body:**
```json
{
  "carYear": 2005,
  "carValue": 15000,
  "numberOfAccidents": 3,
  "yearsOfExperience": 1
}
```
**Expected:** Higher riskScore (~0.5+), riskLevel: "medium" or "high"

#### B) Low Risk Test
**Body:**
```json
{
  "carYear": 2022,
  "carValue": 75000,
  "numberOfAccidents": 0,
  "yearsOfExperience": 15
}
```
**Expected:** Lower riskScore (~0.2), riskLevel: "low"

### ✅ Success Criteria:
- Status code is 200
- Response contains "success": true
- riskScore is between 0 and 1
- insuranceCost is a positive number
- riskLevel is "low", "medium", or "high"

### ❌ Error Test - Missing Fields
**Body:**
```json
{
  "carYear": 2019,
  "carValue": 48000
}
```
**Expected:**
```json
Status: 400 Bad Request

{
  "success": false,
  "error": "Missing required fields: numberOfAccidents, yearsOfExperience"
}
```

---

## 🧪 TEST 4: Create a Car (Voiture)

**Purpose:** Create a car in the database

### Request Setup:
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/voitures`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body (raw JSON):**
  ```json
  {
    "matricule": "POSTMAN-001",
    "marque": "Peugeot",
    "modele": "208 GTi",
    "annee": 2019,
    "prix": 48000,
    "puissance": 120,
    "cylindres": 4,
    "carburant": "diesel",
    "transmission": "manual",
    "traction": "FWD"
  }
  ```

### Expected Response:
```json
Status: 201 Created

{
  "success": true,
  "message": "Voiture créée avec succès",
  "data": {
    "id": 1,
    "matricule": "POSTMAN-001",
    "marque": "Peugeot",
    "modele": "208 GTi",
    "annee": 2019,
    "prix": "48000.00",
    "puissance": 120,
    ...
  },
  "status": 201
}
```

### 📝 Note the Car ID
**IMPORTANT:** Save the `id` from the response (e.g., `1`)  
You'll need it for the next test!

### ✅ Success Criteria:
- Status code is 201
- Response contains "success": true
- data.id exists (note this ID!)

---

## 🧪 TEST 5: Create Listing with Insurance Analysis

**Purpose:** Create an annonce and get automatic insurance analysis

### Request Setup:
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/annonces`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body (raw JSON):**
  ```json
  {
    "id_voiture": 1,
    "annee": 2019,
    "prix": 48000,
    "puissance": "120",
    "marque": "Peugeot",
    "carburant": "diesel",
    "transmission": "manual",
    "odometer": 45000,
    "notRepairedDamage": false,
    "numberOfAccidents": 1,
    "yearsOfExperience": 6
  }
  ```

⚠️ **Replace `"id_voiture": 1` with the actual car ID from Test 4!**

### Expected Response:
```json
Status: 201 Created

{
  "success": true,
  "message": "Annonce créée et publiée avec succès",
  "data": {
    "id": 1,
    "id_voiture": 1,
    "annee": 2019,
    "puissance": "120",
    "marque": "Peugeot",
    "carburant": "diesel",
    "transmission": "manual",
    "odometer": 45000,
    "notRepairedDamage": 0,
    "fraud_prediction": null,
    "fraud_probability": null,
    "fraud_level": null,
    "insurance_risk_score": 0.306,
    "insurance_cost": "743.04",
    "insurance_risk_level": "medium",
    "number_of_accidents": 1,
    "years_of_experience": 6,
    "date_creation": "2025-11-04T...",
    "date_modification": "2025-11-04T..."
  },
  "fraud_detection": null,
  "insurance_analysis": {
    "riskScore": 0.306,
    "insuranceCost": 743.04,
    "riskLevel": "medium"
  },
  "status": 201
}
```

### ✅ Success Criteria:
- Status code is 201
- Response contains "success": true
- **data.insurance_risk_score** exists and is a number
- **data.insurance_cost** exists and is a number
- **data.insurance_risk_level** is "low", "medium", or "high"
- **insurance_analysis** object contains all 3 fields

### 🎯 Key Fields to Check:
```json
"insurance_risk_score": 0.306,          // ← AI prediction
"insurance_cost": "743.04",             // ← Annual premium
"insurance_risk_level": "medium",       // ← Risk classification
"number_of_accidents": 1,               // ← Your input stored
"years_of_experience": 6                // ← Your input stored
```

### Test Variations:

#### A) Low Risk Scenario
```json
{
  "id_voiture": 1,
  "annee": 2022,
  "prix": 75000,
  "puissance": "180",
  "marque": "BMW",
  "carburant": "essence",
  "transmission": "automatic",
  "odometer": 10000,
  "notRepairedDamage": false,
  "numberOfAccidents": 0,
  "yearsOfExperience": 15
}
```
**Expected:** Low riskScore, riskLevel: "low"

#### B) High Risk Scenario
```json
{
  "id_voiture": 1,
  "annee": 2005,
  "prix": 15000,
  "puissance": "90",
  "marque": "Toyota",
  "carburant": "essence",
  "transmission": "manual",
  "odometer": 150000,
  "notRepairedDamage": true,
  "numberOfAccidents": 3,
  "yearsOfExperience": 1
}
```
**Expected:** Higher riskScore, riskLevel: "medium" or "high"

---

## 🧪 TEST 6: Get All Listings with Insurance

**Purpose:** Retrieve all listings and see insurance data

### Request Setup:
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/annonces`
- **Headers:** None needed

### Expected Response:
```json
Status: 200 OK

{
  "success": true,
  "message": "3 annonce(s) trouvée(s)",
  "data": [
    {
      "id": 1,
      "id_voiture": 1,
      "marque": "Peugeot",
      "annee": 2019,
      "insurance_risk_score": 0.306,
      "insurance_cost": "743.04",
      "insurance_risk_level": "medium",
      "number_of_accidents": 1,
      "years_of_experience": 6,
      ...
    },
    {
      "id": 2,
      ...
    }
  ],
  "status": 200
}
```

### ✅ Success Criteria:
- Status code is 200
- Response contains array of annonces
- Each annonce has insurance fields populated

---

## 🧪 TEST 7: Get Single Listing

**Purpose:** Get details of one specific listing

### Request Setup:
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/annonces/1`
- **Headers:** None needed

**Replace `1` with an actual annonce ID from Test 6**

### Expected Response:
```json
Status: 200 OK

{
  "success": true,
  "message": "Annonce trouvée",
  "data": {
    "id": 1,
    "marque": "Peugeot",
    "insurance_risk_score": 0.306,
    "insurance_cost": "743.04",
    "insurance_risk_level": "medium",
    ...
  },
  "status": 200
}
```

---

## 🧪 TEST 8: Frontend API Route

**Purpose:** Test Next.js API route that proxies to Flask

### Request Setup:
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/ai/insurance-risk`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body (raw JSON):**
  ```json
  {
    "carYear": 2020,
    "carValue": 55000,
    "numberOfAccidents": 0,
    "yearsOfExperience": 10
  }
  ```

### Expected Response:
```json
Status: 200 OK

{
  "success": true,
  "riskScore": 0.25,
  "insuranceCost": 780.50,
  "riskLevel": "low",
  "message": "Le risque estimé..."
}
```

⚠️ **Note:** Frontend must be running on port 3000 for this test!

---

## 📊 Postman Tests (Automated)

You can add automated tests in Postman's "Tests" tab:

### For Health Check (Test 1):
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Service is ok", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.status).to.eql("ok");
});
```

### For Insurance Prediction (Test 3):
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has success field", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.be.true;
});

pm.test("Risk score is between 0 and 1", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.riskScore).to.be.within(0, 1);
});

pm.test("Insurance cost is positive", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.insuranceCost).to.be.above(0);
});

pm.test("Risk level is valid", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.riskLevel).to.be.oneOf(['low', 'medium', 'high']);
});
```

### For Create Annonce (Test 5):
```javascript
pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
});

pm.test("Insurance fields are present", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.data).to.have.property('insurance_risk_score');
    pm.expect(jsonData.data).to.have.property('insurance_cost');
    pm.expect(jsonData.data).to.have.property('insurance_risk_level');
});

pm.test("Insurance analysis object exists", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.insurance_analysis).to.exist;
    pm.expect(jsonData.insurance_analysis.riskScore).to.exist;
    pm.expect(jsonData.insurance_analysis.insuranceCost).to.exist;
    pm.expect(jsonData.insurance_analysis.riskLevel).to.exist;
});
```

---

## 🎯 Complete Test Sequence

Run these in order:

1. ✅ Test 1: Flask Health Check
2. ✅ Test 2: Backend Health Check
3. ✅ Test 3: Direct Insurance Prediction (3 variations)
4. ✅ Test 4: Create Car → **Note the ID**
5. ✅ Test 5: Create Annonce with Insurance (3 variations)
6. ✅ Test 6: Get All Listings
7. ✅ Test 7: Get Single Listing
8. ✅ Test 8: Frontend API Route (if frontend running)

---

## 📦 Import Ready-Made Collection

I can provide you a JSON file to import into Postman. Save this as `insurance-risk-tests.postman_collection.json`:

```json
{
  "info": {
    "name": "AI Marketplace - Insurance Risk",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "1. Flask Health Check",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "http://localhost:5002/health",
          "protocol": "http",
          "host": ["localhost"],
          "port": "5002",
          "path": ["health"]
        }
      }
    },
    {
      "name": "2. Backend Health Check",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "http://localhost:5000/",
          "protocol": "http",
          "host": ["localhost"],
          "port": "5000",
          "path": [""]
        }
      }
    },
    {
      "name": "3. Test Insurance Prediction",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"carYear\": 2019,\n  \"carValue\": 48000,\n  \"numberOfAccidents\": 1,\n  \"yearsOfExperience\": 6\n}"
        },
        "url": {
          "raw": "http://localhost:5002/predict",
          "protocol": "http",
          "host": ["localhost"],
          "port": "5002",
          "path": ["predict"]
        }
      }
    },
    {
      "name": "4. Create Car",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"matricule\": \"POSTMAN-001\",\n  \"marque\": \"Peugeot\",\n  \"modele\": \"208 GTi\",\n  \"annee\": 2019,\n  \"prix\": 48000,\n  \"puissance\": 120,\n  \"cylindres\": 4,\n  \"carburant\": \"diesel\",\n  \"transmission\": \"manual\",\n  \"traction\": \"FWD\"\n}"
        },
        "url": {
          "raw": "http://localhost:5000/api/voitures",
          "protocol": "http",
          "host": ["localhost"],
          "port": "5000",
          "path": ["api", "voitures"]
        }
      }
    },
    {
      "name": "5. Create Annonce with Insurance",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"id_voiture\": 1,\n  \"annee\": 2019,\n  \"prix\": 48000,\n  \"puissance\": \"120\",\n  \"marque\": \"Peugeot\",\n  \"carburant\": \"diesel\",\n  \"transmission\": \"manual\",\n  \"odometer\": 45000,\n  \"notRepairedDamage\": false,\n  \"numberOfAccidents\": 1,\n  \"yearsOfExperience\": 6\n}"
        },
        "url": {
          "raw": "http://localhost:5000/api/annonces",
          "protocol": "http",
          "host": ["localhost"],
          "port": "5000",
          "path": ["api", "annonces"]
        }
      }
    },
    {
      "name": "6. Get All Listings",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "http://localhost:5000/api/annonces",
          "protocol": "http",
          "host": ["localhost"],
          "port": "5000",
          "path": ["api", "annonces"]
        }
      }
    }
  ]
}
```

**To import:**
1. Open Postman
2. Click "Import"
3. Drag and drop the JSON file
4. All requests will be imported!

---

## 🎉 You're Ready to Test!

Follow the tests in order and verify each one works. Happy testing! 🚀
