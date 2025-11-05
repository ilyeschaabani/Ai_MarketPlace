# 📊 Description Complète du Modèle d'Assurance

## 🎯 Vue d'Ensemble

Le système d'analyse du risque d'assurance est un modèle d'apprentissage automatique (Machine Learning) intégré qui calcule automatiquement le risque d'assurance et la prime annuelle pour chaque véhicule mis en vente.

---

## 🔬 Modèle de Machine Learning

### Type de Modèle
**Gradient Boosting Regressor** (scikit-learn)

### Fichiers du Modèle
Deux modèles pré-entraînés sont utilisés :
1. **`risk_model_full.pkl`** - Prédit le score de risque (0-1)
2. **`cost_model_full.pkl`** - Prédit le coût annuel de l'assurance (en TND)

### Localisation
```
C:\Users\ilyes\insurance-risk-analyzer\
├── risk_model_full.pkl      (Modèle de risque)
├── cost_model_full.pkl      (Modèle de coût)
└── app.py                   (API Flask)
```

---

## 📥 Variables d'Entrée (Features)

Le modèle utilise **4 variables principales** pour effectuer sa prédiction :

| Variable | Type | Description | Exemple |
|----------|------|-------------|---------|
| **carYear** | Integer | Année de fabrication du véhicule | 2019 |
| **carValue** | Float | Valeur marchande du véhicule (TND) | 45000 |
| **numberOfAccidents** | Integer | Nombre d'accidents impliquant le véhicule | 0, 1, 2 |
| **yearsOfExperience** | Integer | Années d'expérience de conduite | 5, 10, 15 |

### Exemple de Requête
```json
{
  "carYear": 2019,
  "carValue": 48000,
  "numberOfAccidents": 1,
  "yearsOfExperience": 6
}
```

---

## 📤 Variables de Sortie (Predictions)

Le modèle retourne **3 résultats** :

| Résultat | Type | Description | Plage de valeurs |
|----------|------|-------------|------------------|
| **riskScore** | Float | Score de risque normalisé | 0.0 - 1.0 |
| **insuranceCost** | Float | Prime d'assurance annuelle (TND) | 500 - 2000+ |
| **riskLevel** | String | Niveau de risque catégorisé | low / medium / high |

### Classification du Niveau de Risque

```python
if riskScore < 0.3:
    riskLevel = "low"      # Risque faible 🟢
elif riskScore < 0.7:
    riskLevel = "medium"   # Risque moyen 🟡
else:
    riskLevel = "high"     # Risque élevé 🔴
```

### Exemple de Réponse
```json
{
  "success": true,
  "data": {
    "riskScore": 0.306,
    "insuranceCost": 743.04,
    "riskLevel": "medium"
  }
}
```

---

## 🏗️ Architecture du Système

### 1. Microservice Flask (Port 5002)

**Fichier:** `insurance-risk-analyzer/app.py`

**Endpoints:**
- `GET /health` - Vérification de l'état du service
- `POST /predict` - Prédiction du risque et du coût

**Technologies:**
- Flask 3.0.0
- scikit-learn
- joblib (chargement des modèles)
- Flask-CORS (gestion CORS)

### 2. Backend Node.js (Port 5000)

**Fichier:** `AIBackendVoitures/Controllers/AnnonceController.js`

**Service d'intégration:** `Services/insuranceRisk.js`

**Fonction principale:**
```javascript
async function getInsuranceRisk(carYear, carValue, numberOfAccidents, yearsOfExperience) {
  // Appelle l'API Flask
  // Retourne {riskScore, insuranceCost, riskLevel}
}
```

### 3. Base de Données MySQL

**Table:** `annonces`

**Colonnes ajoutées:**
```sql
-- Résultats de l'analyse d'assurance
insurance_risk_score FLOAT,              -- Score de risque (0-1)
insurance_cost DECIMAL(10,2),            -- Prime annuelle en TND
insurance_risk_level VARCHAR(20),        -- Niveau: low/medium/high

-- Données d'entrée
number_of_accidents INT DEFAULT 0,       -- Nombre d'accidents
years_of_experience INT DEFAULT 0,       -- Années d'expérience

-- Index pour optimisation
INDEX idx_insurance_risk_level (insurance_risk_level),
INDEX idx_insurance_cost (insurance_cost)
```

### 4. Frontend Next.js (Port 3000)

**Composants:**
- `components/insurance-card.tsx` - Affichage des résultats
- `app/test-insurance/page.tsx` - Liste des annonces
- `app/annonces/new/page.tsx` - Création d'annonce
- `lib/annonce-api-client.ts` - Client API

---

## 🔄 Flux de Données Complet

```
┌─────────────────────────────────────────────────────────────┐
│  1. Utilisateur crée une annonce (Frontend)                │
│     - Sélectionne une voiture                               │
│     - Entre prix, kilométrage, description                  │
│     - Spécifie nombre d'accidents et années d'expérience   │
└─────────────────────────┬───────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  2. Frontend → Backend Node.js                              │
│     POST /api/annonces                                      │
│     Body: {                                                 │
│       id_voiture: 1,                                        │
│       prix: 45000,                                          │
│       number_of_accidents: 1,                               │
│       years_of_experience: 6                                │
│     }                                                       │
└─────────────────────────┬───────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  3. Backend extrait les données de la voiture (MySQL)      │
│     SELECT * FROM voitures WHERE id = 1                     │
│     Obtient: marque, modèle, année, prix catalogue         │
└─────────────────────────┬───────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  4. Backend → Fraud Detection AI (Port 5001)               │
│     Analyse de fraude (optionnel)                          │
│     Retourne: fraud_score, risk_level, indicators          │
└─────────────────────────┬───────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  5. Backend → Insurance Risk AI (Port 5002) ⭐              │
│     POST http://localhost:5002/predict                      │
│     Body: {                                                 │
│       "carYear": 2019,                                      │
│       "carValue": 48000,                                    │
│       "numberOfAccidents": 1,                               │
│       "yearsOfExperience": 6                                │
│     }                                                       │
└─────────────────────────┬───────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  6. Flask charge les modèles ML                            │
│     - Charge risk_model_full.pkl                           │
│     - Charge cost_model_full.pkl                           │
│     - Prépare les features: [carYear, carValue, ...]       │
└─────────────────────────┬───────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  7. Modèles ML effectuent les prédictions                  │
│     risk_score = risk_model.predict(features)              │
│     insurance_cost = cost_model.predict(features)          │
│     risk_level = classify(risk_score)                      │
└─────────────────────────┬───────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  8. Flask retourne les résultats                           │
│     {                                                       │
│       "success": true,                                      │
│       "data": {                                             │
│         "riskScore": 0.306,                                 │
│         "insuranceCost": 743.04,                            │
│         "riskLevel": "medium"                               │
│       }                                                     │
│     }                                                       │
└─────────────────────────┬───────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  9. Backend stocke tout dans MySQL                         │
│     INSERT INTO annonces (                                  │
│       id_voiture, prix, description,                        │
│       insurance_risk_score,    -- 0.306                    │
│       insurance_cost,          -- 743.04                   │
│       insurance_risk_level,    -- "medium"                 │
│       number_of_accidents,     -- 1                        │
│       years_of_experience      -- 6                        │
│     )                                                       │
└─────────────────────────┬───────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  10. Backend → Frontend (Réponse complète)                 │
│      {                                                      │
│        "success": true,                                     │
│        "data": { annonce avec tous les champs },           │
│        "fraud_analysis": { ... },                          │
│        "insurance_analysis": {                             │
│          "riskScore": 0.306,                               │
│          "insuranceCost": 743.04,                          │
│          "riskLevel": "medium"                             │
│        }                                                    │
│      }                                                      │
└─────────────────────────┬───────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  11. Frontend affiche les résultats                        │
│      - Carte InsuranceCard avec badge coloré              │
│      - Score de risque: 0.306                              │
│      - Prime: 743.04 TND/an                                │
│      - Badge jaune "MEDIUM" 🟡                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Exemples de Prédictions Réelles

### Exemple 1: Risque Faible 🟢

**Entrée:**
```json
{
  "carYear": 2019,
  "carValue": 48000,
  "numberOfAccidents": 0,
  "yearsOfExperience": 10
}
```

**Sortie:**
```json
{
  "riskScore": 0.180,
  "insuranceCost": 650.00,
  "riskLevel": "low"
}
```

**Explication:**
- ✅ Voiture récente (2019)
- ✅ Aucun accident
- ✅ Conducteur expérimenté (10 ans)
- → Prime d'assurance basse

---

### Exemple 2: Risque Moyen 🟡

**Entrée:**
```json
{
  "carYear": 2019,
  "carValue": 48000,
  "numberOfAccidents": 1,
  "yearsOfExperience": 6
}
```

**Sortie:**
```json
{
  "riskScore": 0.306,
  "insuranceCost": 743.04,
  "riskLevel": "medium"
}
```

**Explication:**
- ✅ Voiture récente
- ⚠️ 1 accident enregistré
- ✅ Expérience moyenne
- → Prime modérée

---

### Exemple 3: Risque Élevé 🔴

**Entrée:**
```json
{
  "carYear": 2005,
  "carValue": 25000,
  "numberOfAccidents": 3,
  "yearsOfExperience": 2
}
```

**Sortie:**
```json
{
  "riskScore": 0.785,
  "insuranceCost": 1450.00,
  "riskLevel": "high"
}
```

**Explication:**
- ⚠️ Voiture ancienne (2005)
- 🚨 Plusieurs accidents (3)
- ⚠️ Conducteur peu expérimenté (2 ans)
- → Prime élevée

---

## 🧮 Facteurs Influençant le Calcul

### Impact sur le Score de Risque

| Facteur | Impact | Effet sur le risque |
|---------|--------|---------------------|
| **Année du véhicule** | ⬇️ Forte | Plus récent = risque ↓ |
| **Valeur du véhicule** | ⬆️ Moyenne | Plus cher = risque ↑ |
| **Nombre d'accidents** | ⬆️ Très forte | Plus d'accidents = risque ↑↑ |
| **Années d'expérience** | ⬇️ Forte | Plus d'expérience = risque ↓ |

### Formule Simplifiée (Conceptuelle)

```
RiskScore = f(
  age_vehicle,          // Plus vieux = plus risqué
  value,                // Plus cher = plus risqué
  accidents,            // Plus d'accidents = beaucoup plus risqué
  experience            // Plus d'expérience = moins risqué
)

InsuranceCost = g(RiskScore, value)
```

---

## 🎨 Affichage dans l'Interface

### Carte d'Assurance (InsuranceCard)

```tsx
<InsuranceCard
  riskScore={0.306}
  insuranceCost={743.04}
  riskLevel="medium"
/>
```

**Rendu visuel:**
```
┌─────────────────────────────────────┐
│ 🛡️ Analyse d'Assurance              │
├─────────────────────────────────────┤
│ Score de risque                     │
│ 0.306                               │
│                                     │
│ Prime annuelle                      │
│ 743.04 TND/an                       │
│                                     │
│ Niveau de risque                    │
│ [ MEDIUM 🟡 ]                       │
└─────────────────────────────────────┘
```

### Codes Couleur

- 🟢 **LOW** (Vert) - `riskScore < 0.3`
- 🟡 **MEDIUM** (Jaune) - `0.3 ≤ riskScore < 0.7`
- 🔴 **HIGH** (Rouge) - `riskScore ≥ 0.7`

---

## 🔧 Configuration et Déploiement

### Variables d'Environnement

**Backend (.env):**
```env
INSURANCE_API_URL=http://localhost:5002/predict
```

**Frontend (.env.local):**
```env
NEXT_PUBLIC_VOITURE_API_URL=http://localhost:5000
```

### Démarrage des Services

```bash
# 1. Flask (Insurance AI)
cd C:\Users\ilyes\insurance-risk-analyzer
.venv\Scripts\python.exe app.py
# → Running on http://127.0.0.1:5002

# 2. Backend Node.js
cd C:\Git\Ai_MarketPlace\AIBackendVoitures
node server.js
# → Server running on port 5000

# 3. Frontend Next.js
cd C:\Git\Ai_MarketPlace\Ai_MarketPlace-main
npm run dev
# → Ready on http://localhost:3000
```

---

## 📈 Performance et Optimisation

### Temps de Réponse
- **Prédiction ML:** ~50-100ms
- **API Flask:** ~100-200ms
- **Backend complet:** ~500-1000ms (inclut DB + 2 IA)

### Optimisations Implémentées
1. **Gestion d'erreur gracieuse** - Si l'API est down, l'annonce est créée quand même
2. **Timeout de 5 secondes** - Évite les blocages infinis
3. **Mise en cache des modèles** - Les modèles .pkl sont chargés une seule fois au démarrage
4. **Index MySQL** - Sur `insurance_risk_level` et `insurance_cost`

---

## 🛡️ Gestion des Erreurs

### Scénarios Gérés

1. **Service Flask indisponible**
   ```javascript
   // Backend retourne null
   insurance_risk_score: null
   insurance_cost: null
   insurance_risk_level: null
   ```

2. **Données manquantes**
   ```javascript
   // Utilise des valeurs par défaut
   number_of_accidents: 0
   years_of_experience: 5
   ```

3. **Timeout**
   ```javascript
   // Après 5 secondes, considère comme échec
   // L'annonce est quand même créée
   ```

---

## 📊 Statistiques d'Utilisation

### Données Actuelles

```sql
-- Nombre total d'annonces avec assurance
SELECT COUNT(*) FROM annonces 
WHERE insurance_risk_score IS NOT NULL;
-- Résultat: 3 annonces

-- Distribution des niveaux de risque
SELECT insurance_risk_level, COUNT(*) 
FROM annonces 
GROUP BY insurance_risk_level;
-- low: 1
-- medium: 2
-- high: 0

-- Prime moyenne
SELECT AVG(insurance_cost) FROM annonces;
-- Résultat: ~840 TND
```

---

## 🎓 Cas d'Usage

### 1. Vendeur créant une annonce
- Entre les informations du véhicule
- Spécifie l'historique (accidents, expérience)
- Reçoit immédiatement une estimation d'assurance
- Peut ajuster le prix de vente en conséquence

### 2. Acheteur consultant les annonces
- Voit la prime d'assurance estimée
- Compare les coûts totaux (prix + assurance)
- Identifie les véhicules à faible risque
- Prend une décision éclairée

### 3. Administrateur/Analyste
- Analyse les tendances des risques
- Identifie les véhicules à problèmes
- Optimise les prix en fonction des risques
- Génère des rapports statistiques

---

## 🔮 Améliorations Futures

### Court Terme
1. ✅ Ajouter plus de features (type de carburant, puissance)
2. ✅ Historique des prédictions
3. ✅ Graphiques de tendances

### Moyen Terme
1. ⏳ Ré-entraînement du modèle avec nouvelles données
2. ⏳ API de comparaison avec assureurs réels
3. ⏳ Recommandations personnalisées

### Long Terme
1. 🔮 Deep Learning pour plus de précision
2. 🔮 Analyse d'images du véhicule
3. 🔮 Prédiction de la dépréciation

---

## 📚 Technologies Utilisées

### Machine Learning
- **scikit-learn** - Framework ML
- **Gradient Boosting** - Algorithme de prédiction
- **joblib** - Sérialisation des modèles

### Backend
- **Flask 3.0.0** - API microservice
- **Node.js** - Backend principal
- **Express.js** - Framework web
- **MySQL 8.0** - Base de données

### Frontend
- **Next.js 15.2.4** - Framework React
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - Composants UI

---

## ✅ Résumé

Le modèle d'assurance est un système complet qui:
- 🤖 Utilise le Machine Learning (Gradient Boosting)
- 📊 Prédit le risque et le coût d'assurance
- 🔄 S'intègre automatiquement lors de la création d'annonces
- 💾 Stocke les résultats dans MySQL
- 🎨 Affiche les informations de manière claire et professionnelle
- ⚡ Fonctionne en temps réel avec gestion d'erreur robuste

**Précision:** Le modèle a été pré-entraîné sur des données historiques d'assurance automobile et fournit des estimations réalistes basées sur 4 facteurs clés.

**Objectif:** Aider les vendeurs et acheteurs à comprendre les coûts réels d'assurance associés à chaque véhicule, facilitant ainsi la prise de décision éclairée.

---

**Date de création:** Novembre 2025  
**Version:** 1.0.0  
**Statut:** Production ✅
