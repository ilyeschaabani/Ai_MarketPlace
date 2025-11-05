# 🚀 COMPLETE STARTUP GUIDE - AI Car Marketplace with Insurance Risk

Follow these steps to run your complete project with Insurance Risk integration.

## 📋 Prerequisites Checklist

- ✅ MySQL is running
- ✅ Database migration completed (add_insurance_fields.sql)
- ✅ Python 3.10+ installed
- ✅ Node.js installed
- ✅ Model files exist (risk_model_full.pkl, cost_model_full.pkl)

---

## 🎯 Step-by-Step Startup

### Step 1: Start Flask Insurance Risk Service (Port 5002)

**Option A: Using Batch File (Recommended)**
```powershell
# Double-click or run:
c:\Users\ilyes\insurance-risk-analyzer\start_flask.bat
```

**Option B: Manual Start**
```powershell
# Open NEW PowerShell Terminal 1
cd c:\Users\ilyes\insurance-risk-analyzer
.\.venv\Scripts\activate
python app.py
```

**✅ Verify it's running:**
```powershell
# In another terminal
Invoke-RestMethod -Uri http://localhost:5002/health
```

Expected output:
```json
{
  "status": "ok",
  "service": "insurance-risk-analyzer",
  "version": "1.0.0"
}
```

---

### Step 2: Start Node.js Backend (Port 5000)

```powershell
# Open NEW PowerShell Terminal 2
cd c:\Git\Ai_MarketPlace\AIBackendVoitures
node server.js
```

**✅ Should see:**
```
Bienvenue sur l'API de gestion des voitures
Database initialized
Server running on port 5000
```

**Test it:**
```powershell
Invoke-RestMethod -Uri http://localhost:5000/api/voitures
```

---

### Step 3: Start Next.js Frontend (Port 3000)

```powershell
# Open NEW PowerShell Terminal 3
cd c:\Git\Ai_MarketPlace\Ai_MarketPlace-main
pnpm dev
```

**✅ Should see:**
```
- ready started server on 0.0.0.0:3000, url: http://localhost:3000
- event compiled client and server successfully
```

**Open browser:**
```
http://localhost:3000
```

---

## 🧪 Testing the Complete Integration

### Test 1: Flask API Directly

```powershell
# Test prediction
$body = @{
    carYear = 2019
    carValue = 48000
    numberOfAccidents = 1
    yearsOfExperience = 6
} | ConvertTo-Json

Invoke-RestMethod -Uri http://localhost:5002/predict `
    -Method POST `
    -Body $body `
    -ContentType "application/json"
```

**Expected Response:**
```json
{
  "success": true,
  "riskScore": 0.456,
  "insuranceCost": 1234.56,
  "riskLevel": "medium",
  "message": "Le risque estimé pour ce véhicule est de 0.456..."
}
```

---

### Test 2: Backend API with Insurance

First, create a car:
```powershell
$car = @{
    matricule = "TEST123"
    marque = "Peugeot"
    modele = "208 GTi"
    annee = 2019
    prix = 48000
    puissance = 120
    carburant = "diesel"
    transmission = "manual"
} | ConvertTo-Json

Invoke-RestMethod -Uri http://localhost:5000/api/voitures `
    -Method POST `
    -Body $car `
    -ContentType "application/json"
```

Then create an announcement with insurance data:
```powershell
$annonce = @{
    id_voiture = 1  # Use the ID from the car you created
    annee = 2019
    prix = 48000
    puissance = 120
    marque = "Peugeot"
    carburant = "diesel"
    transmission = "manual"
    odometer = 45000
    notRepairedDamage = $false
    numberOfAccidents = 1
    yearsOfExperience = 6
} | ConvertTo-Json

Invoke-RestMethod -Uri http://localhost:5000/api/annonces `
    -Method POST `
    -Body $annonce `
    -ContentType "application/json"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "insurance_risk_score": 0.456,
    "insurance_cost": 1234.56,
    "insurance_risk_level": "medium",
    "fraud_prediction": 0,
    ...
  },
  "insurance_analysis": {
    "riskScore": 0.456,
    "insuranceCost": 1234.56,
    "riskLevel": "medium"
  }
}
```

---

## 🎨 Frontend Usage

1. Open http://localhost:3000
2. Navigate to a car listing page
3. You should see the **Insurance Card** displaying:
   - Risk Score
   - Risk Level (with colored badge)
   - Estimated Premium

---

## 📱 Quick Commands Summary

### Start All Services (3 Terminals)

**Terminal 1 - Flask:**
```powershell
cd c:\Users\ilyes\insurance-risk-analyzer
.\.venv\Scripts\activate
python app.py
```

**Terminal 2 - Backend:**
```powershell
cd c:\Git\Ai_MarketPlace\AIBackendVoitures
node server.js
```

**Terminal 3 - Frontend:**
```powershell
cd c:\Git\Ai_MarketPlace\Ai_MarketPlace-main
pnpm dev
```

---

## 🔧 Troubleshooting

### Problem: Flask won't start

**Solution:**
```powershell
cd c:\Users\ilyes\insurance-risk-analyzer
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

### Problem: "Model file not found"

**Solution:**
- Verify files exist:
```powershell
ls c:\Users\ilyes\insurance-risk-analyzer\*.pkl
```
- Should see: `risk_model_full.pkl` and `cost_model_full.pkl`

### Problem: Backend can't connect to Flask

**Solution:**
1. Check Flask is running: `http://localhost:5002/health`
2. Check `.env` file has: `INSURANCE_API_URL=http://localhost:5002/predict`
3. Restart backend

### Problem: Database error "column not found"

**Solution:**
```powershell
cd c:\Git\Ai_MarketPlace\AIBackendVoitures\migrations
mysql -u root -p marketplace_db < add_insurance_fields.sql
```

---

## 📊 Port Summary

| Service | Port | URL |
|---------|------|-----|
| Flask Insurance API | 5002 | http://localhost:5002 |
| Node.js Backend | 5000 | http://localhost:5000 |
| Next.js Frontend | 3000 | http://localhost:3000 |
| MySQL Database | 3306 | localhost:3306 |

---

## 🎯 Complete Test Flow

1. **Start all 3 services** (Flask, Backend, Frontend)
2. **Create a car** via backend API
3. **Create an announcement** with insurance data
4. **View in frontend** - See insurance card
5. **Check database** - Verify insurance fields saved

```powershell
# Verify in database
mysql -u root -p
USE marketplace_db;
SELECT id, marque, insurance_risk_score, insurance_cost, insurance_risk_level 
FROM annonces 
ORDER BY id DESC 
LIMIT 5;
```

---

## ✅ Success Indicators

When everything is working:

- ✅ Flask shows: `Running on http://127.0.0.1:5002`
- ✅ Backend shows: `Server running on port 5000`
- ✅ Frontend shows: `ready - started server on 0.0.0.0:3000`
- ✅ Creating annonce returns insurance data
- ✅ Frontend displays InsuranceCard component

---

## 🚀 You're Ready!

Your AI Car Marketplace with Insurance Risk integration is now fully operational!

**Next Steps:**
1. Create test listings
2. View insurance estimates
3. Test different risk scenarios
4. Customize frontend UI if needed

For detailed documentation, see:
- `INSURANCE_INTEGRATION_SUMMARY.md`
- `INSURANCE_SETUP.md`
- `insurance-risk-analyzer/README.md`
