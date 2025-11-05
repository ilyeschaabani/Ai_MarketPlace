# Insurance Risk Analyzer - Setup Guide

This guide explains how to integrate the Insurance Risk Analyzer into the AI Car Marketplace.

## Architecture Overview

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│   Next.js       │         │   Node.js        │         │   Flask         │
│   Frontend      │────────▶│   Backend        │────────▶│   Insurance AI  │
│   (Port 3000)   │         │   (Port 5000)    │         │   (Port 5002)   │
└─────────────────┘         └──────────────────┘         └─────────────────┘
                                     │
                                     ▼
                            ┌──────────────────┐
                            │   MySQL          │
                            │   Database       │
                            └──────────────────┘
```

## Prerequisites

- Node.js 18+ (for frontend & backend)
- Python 3.8+ (for Flask service)
- MySQL 8.0+
- Git

## Step 1: Database Setup

Run the migration to add insurance fields to the `annonces` table:

```sql
-- Located in: AIBackendVoitures/migrations/add_insurance_fields.sql

ALTER TABLE annonces
  ADD COLUMN insurance_risk_score FLOAT NULL,
  ADD COLUMN insurance_cost DECIMAL(10,2) NULL,
  ADD COLUMN insurance_risk_level VARCHAR(20) NULL,
  ADD COLUMN number_of_accidents INT DEFAULT 0,
  ADD COLUMN years_of_experience INT DEFAULT 0;

CREATE INDEX idx_insurance_risk_level ON annonces(insurance_risk_level);
CREATE INDEX idx_insurance_cost ON annonces(insurance_cost);
```

**Execute in MySQL:**
```powershell
# From AIBackendVoitures/migrations/
mysql -u root -p marketplace_db < add_insurance_fields.sql
```

## Step 2: Flask Service Setup

### Install Dependencies

```powershell
# Navigate to insurance-risk-analyzer directory
cd c:\Users\ilyes\insurance-risk-analyzer

# Create virtual environment
python -m venv .venv

# Activate virtual environment
.\.venv\Scripts\activate

# Install requirements
pip install -r requirements.txt
```

### Verify Model Files

Ensure these files exist in the `insurance-risk-analyzer` directory:
- `risk_model_full.pkl` - Trained risk prediction model
- `cost_model_full.pkl` - Trained cost prediction model
- `app.py` - Flask application

### Start Flask Service

```powershell
# Default port 5002
python app.py

# Custom port
$env:PORT="5002"; python app.py
```

**Verify it's running:**
```powershell
curl http://localhost:5002/health
```

Expected response:
```json
{
  "status": "ok",
  "service": "insurance-risk-analyzer",
  "version": "1.0.0"
}
```

## Step 3: Node.js Backend Setup

### Install Dependencies

The `axios` package should already be installed. If not:

```powershell
cd c:\Git\Ai_MarketPlace\AIBackendVoitures
npm install axios
```

### Environment Configuration

Create or update `.env` file in `AIBackendVoitures/`:

```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=marketplace_db

# API URLs
FRAUD_API_URL=http://localhost:5001/predict
INSURANCE_API_URL=http://localhost:5002/predict

# Server
PORT=5000
```

### Verify Service Integration

The following files should be present:
- `Services/insuranceRisk.js` - Insurance API client
- `Controllers/AnnonceController.js` - Updated with insurance integration

### Start Node.js Backend

```powershell
cd c:\Git\Ai_MarketPlace\AIBackendVoitures
npm start
```

## Step 4: Frontend Setup

### Install Dependencies

```powershell
cd c:\Git\Ai_MarketPlace\Ai_MarketPlace-main
pnpm install
```

### Environment Configuration

Create or update `.env.local`:

```env
# Backend API
NEXT_PUBLIC_API_URL=http://localhost:5000

# Insurance Risk API (optional - backend handles this)
INSURANCE_API_URL=http://localhost:5002/predict
```

### Verify Components

New files added:
- `components/insurance-card.tsx` - Insurance display component
- `app/api/ai/insurance-risk/route.ts` - Updated API route

### Start Frontend

```powershell
pnpm dev
```

Frontend runs on: `http://localhost:3000`

## Step 5: Testing the Integration

### Test Flask API Directly

```powershell
curl -Method POST http://localhost:5002/predict `
  -Headers @{ "Content-Type"="application/json" } `
  -Body '{"carYear":2019,"carValue":48000,"numberOfAccidents":1,"yearsOfExperience":6}'
```

Expected response:
```json
{
  "success": true,
  "riskScore": 0.456,
  "insuranceCost": 1234.56,
  "riskLevel": "medium",
  "message": "Le risque estimé pour ce véhicule est de 0.456 et la prime d'assurance estimée est de 1234.56 TND/an."
}
```

### Test Through Backend API

```powershell
# Create an announcement with insurance data
curl -Method POST http://localhost:5000/api/annonces `
  -Headers @{ "Content-Type"="application/json" } `
  -Body '{
    "id_voiture": 1,
    "annee": 2019,
    "prix": 48000,
    "puissance": 120,
    "marque": "Peugeot",
    "carburant": "diesel",
    "transmission": "manual",
    "numberOfAccidents": 1,
    "yearsOfExperience": 6
  }'
```

The response should include:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "insurance_risk_score": 0.456,
    "insurance_cost": 1234.56,
    "insurance_risk_level": "medium",
    ...
  },
  "insurance_analysis": {
    "riskScore": 0.456,
    "insuranceCost": 1234.56,
    "riskLevel": "medium"
  }
}
```

### Test Frontend Component

1. Navigate to a car listing page
2. The `InsuranceCard` component should display:
   - Risk Score (0-1 scale)
   - Risk Level badge (low/medium/high)
   - Estimated insurance premium (TND/year)

## Running All Services

Use these commands in separate terminal windows:

```powershell
# Terminal 1: Flask Insurance API
cd c:\Users\ilyes\insurance-risk-analyzer
.\.venv\Scripts\activate
python app.py

# Terminal 2: Node.js Backend
cd c:\Git\Ai_MarketPlace\AIBackendVoitures
npm start

# Terminal 3: Next.js Frontend
cd c:\Git\Ai_MarketPlace\Ai_MarketPlace-main
pnpm dev
```

## Troubleshooting

### Flask Service Not Starting
- Verify virtual environment is activated
- Check Python version: `python --version` (should be 3.8+)
- Verify model files exist: `ls *.pkl`

### Backend Can't Connect to Flask
- Ensure Flask is running on port 5002
- Check `INSURANCE_API_URL` in backend `.env`
- Verify firewall allows localhost connections

### Database Errors
- Run migration script to add columns
- Check MySQL is running: `mysql -u root -p`
- Verify table structure: `DESCRIBE annonces;`

### Frontend Not Showing Insurance Data
- Check browser console for API errors
- Verify backend is returning insurance fields
- Ensure `InsuranceCard` component is imported

## Production Deployment

### Flask Service
```powershell
# Use production WSGI server (e.g., gunicorn)
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5002 app:app
```

### Environment Variables
Set in production environment:
- `INSURANCE_API_URL` - Production Flask URL
- `DB_HOST`, `DB_USER`, `DB_PASSWORD` - Production database
- `PORT` - Service ports

## API Documentation

### POST /predict (Flask)

**Request:**
```json
{
  "carYear": 2019,
  "carValue": 48000,
  "numberOfAccidents": 1,
  "yearsOfExperience": 6
}
```

**Response:**
```json
{
  "success": true,
  "riskScore": 0.456,
  "insuranceCost": 1234.56,
  "riskLevel": "medium",
  "message": "Le risque estimé pour ce véhicule est de 0.456 et la prime d'assurance estimée est de 1234.56 TND/an."
}
```

### POST /api/annonces (Backend)

Now accepts additional fields:
- `numberOfAccidents` - Number of previous accidents (default: 0)
- `yearsOfExperience` - Driver's years of experience (default: 0)

Returns insurance analysis in response.

## Support

For issues or questions:
- Check logs in each service
- Verify all services are running
- Ensure database migrations are applied
- Test each API endpoint individually
