# 🚀 Quick Start - Insurance Risk Integration

## ✅ What Was Done

The Insurance Risk Analyzer has been fully integrated into the AI Car Marketplace:

### 1. **Flask Microservice** (Port 5002)
- ✅ Health check endpoint: `GET /health`
- ✅ Prediction endpoint: `POST /predict`
- ✅ Error handling and input validation
- ✅ Configurable via environment variables
- ✅ Test script included

### 2. **Database Schema** 
- ✅ Added 5 new columns to `annonces` table:
  - `insurance_risk_score` - AI-predicted risk (0-1)
  - `insurance_cost` - Premium estimate (TND/year)
  - `insurance_risk_level` - low/medium/high
  - `number_of_accidents` - Input field
  - `years_of_experience` - Input field
- ✅ Indexes for performance

### 3. **Node.js Backend Integration**
- ✅ `Services/insuranceRisk.js` - API client
- ✅ `Controllers/AnnonceController.js` - Auto-calls insurance API
- ✅ Environment configuration

### 4. **Frontend Components**
- ✅ `InsuranceCard` component - Beautiful display
- ✅ Updated API route - Proxies to Flask
- ✅ TypeScript types support

## 🎯 How It Works

```
User creates listing → Backend receives data
                    ↓
            Insurance API called (5002)
                    ↓
    ML model predicts risk & cost
                    ↓
  Annonce saved with insurance data
                    ↓
   Frontend displays to users
```

## 📝 Quick Setup (3 Steps)

### Step 1: Database Migration

```powershell
# From project root
cd AIBackendVoitures\migrations
mysql -u root -p marketplace_db < add_insurance_fields.sql
```

### Step 2: Start Flask Service

```powershell
# Open new terminal
cd c:\Users\ilyes\insurance-risk-analyzer
.\.venv\Scripts\activate
python app.py
```

**Should see:**
```
* Running on http://0.0.0.0:5002
```

### Step 3: Test It

```powershell
# Test health
curl http://localhost:5002/health

# Test prediction
cd c:\Users\ilyes\insurance-risk-analyzer
.\.venv\Scripts\activate
python test_api.py
```

## 🧪 Testing the Integration

### Create an Annonce with Insurance

```powershell
curl -Method POST http://localhost:5000/api/annonces `
  -Headers @{ "Content-Type"="application/json" } `
  -Body '{
    "id_voiture": 1,
    "annee": 2019,
    "prix": 48000,
    "marque": "Peugeot",
    "puissance": 120,
    "carburant": "diesel",
    "transmission": "manual",
    "numberOfAccidents": 1,
    "yearsOfExperience": 6
  }'
```

**Response includes:**
```json
{
  "success": true,
  "data": {
    "insurance_risk_score": 0.456,
    "insurance_cost": 1234.56,
    "insurance_risk_level": "medium"
  },
  "insurance_analysis": { ... }
}
```

## 📁 Files Created/Modified

### New Files
- ✅ `c:\Users\ilyes\insurance-risk-analyzer\README.md`
- ✅ `c:\Users\ilyes\insurance-risk-analyzer\requirements.txt`
- ✅ `c:\Users\ilyes\insurance-risk-analyzer\test_api.py`
- ✅ `AIBackendVoitures\Services\insuranceRisk.js`
- ✅ `AIBackendVoitures\migrations\add_insurance_fields.sql`
- ✅ `AIBackendVoitures\.env.example`
- ✅ `AIBackendVoitures\INSURANCE_SETUP.md`
- ✅ `Ai_MarketPlace-main\components\insurance-card.tsx`

### Modified Files
- ✅ `c:\Users\ilyes\insurance-risk-analyzer\app.py` - Production ready
- ✅ `AIBackendVoitures\Controllers\AnnonceController.js` - Insurance integration
- ✅ `Ai_MarketPlace-main\app\api\ai\insurance-risk\route.ts` - Real API

## 🎨 Frontend Usage

```tsx
import { InsuranceCard } from "@/components/insurance-card"

// In your listing detail page
<InsuranceCard 
  riskScore={listing.insurance_risk_score}
  insuranceCost={listing.insurance_cost}
  riskLevel={listing.insurance_risk_level}
/>
```

## 🔧 Environment Variables

### Backend (.env)
```env
INSURANCE_API_URL=http://localhost:5002/predict
```

### Flask (optional)
```env
PORT=5002
RISK_MODEL_PATH=risk_model_full.pkl
COST_MODEL_PATH=cost_model_full.pkl
```

## 🚨 Troubleshooting

| Issue | Solution |
|-------|----------|
| Flask won't start | Activate venv: `.\.venv\Scripts\activate` |
| Connection refused | Check Flask is on port 5002 |
| Database error | Run migration SQL |
| Backend error | Check `INSURANCE_API_URL` in .env |

## 🎓 API Reference

### Flask Endpoint

**POST** `/predict`

```json
// Request
{
  "carYear": 2019,
  "carValue": 48000,
  "numberOfAccidents": 1,
  "yearsOfExperience": 6
}

// Response
{
  "success": true,
  "riskScore": 0.456,
  "insuranceCost": 1234.56,
  "riskLevel": "medium",
  "message": "Le risque estimé..."
}
```

## ✨ Features

- ✅ **Automatic Analysis** - Every annonce gets insurance estimate
- ✅ **Smart Caching** - Results stored in database
- ✅ **Fallback Handling** - Graceful degradation if service down
- ✅ **Beautiful UI** - Color-coded risk levels
- ✅ **Type Safe** - Full TypeScript support

## 🎉 Next Steps

1. Run database migration
2. Start Flask service
3. Create test annonce
4. View in frontend

For detailed setup: See `INSURANCE_SETUP.md`
