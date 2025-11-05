# 📝 Guide: Créer des Annonces depuis le Frontend

## 🎯 Vue d'ensemble

Vous pouvez maintenant créer des annonces de voitures directement depuis l'interface web. Lors de la création, **2 systèmes IA analysent automatiquement votre annonce**:

1. **🔍 Fraud Detection AI** - Détecte les fraudes potentielles
2. **🛡️ Insurance Risk AI** - Calcule le risque d'assurance et la prime

---

## 🚀 Démarrage rapide

### Étape 1: Démarrer tous les services

```powershell
# Terminal 1 - Flask (Insurance Risk AI)
cd C:\Users\ilyes\insurance-risk-analyzer
.\.venv\Scripts\python.exe app.py

# Terminal 2 - Backend Node.js
cd C:\Git\Ai_MarketPlace\AIBackendVoitures
node server.js

# Terminal 3 - Frontend Next.js
cd C:\Git\Ai_MarketPlace\Ai_MarketPlace-main
npm run dev
```

### Étape 2: Accéder au formulaire de création

Ouvrez votre navigateur et allez à:
```
http://localhost:3000/annonces/new
```

---

## 📋 Utilisation du formulaire

### 1️⃣ Sélection de la voiture

**Important:** Vous devez avoir créé au moins une voiture avant de créer une annonce.

- Si aucune voiture n'existe: Cliquez sur "Créer une voiture d'abord"
- Sinon: Sélectionnez une voiture dans la liste déroulante
- Un aperçu de la voiture s'affichera automatiquement

### 2️⃣ Détails de l'annonce

Remplissez les champs suivants:

| Champ | Obligatoire | Description | Exemple |
|-------|-------------|-------------|---------|
| **Prix de vente** | ✅ | Prix demandé en TND | 45000 |
| **Kilométrage** | ✅ | Kilométrage actuel | 75000 |
| **État** | ❌ | Condition du véhicule | Bon, Excellent, Moyen |
| **Localisation** | ❌ | Ville ou région | Tunis, Sfax |
| **Description** | ✅ | Description détaillée | "Voiture bien entretenue..." |

**💡 Astuce:** Plus la description est détaillée, plus l'analyse de fraude sera précise!

### 3️⃣ Informations pour l'assurance

Ces champs sont utilisés par l'IA d'assurance:

| Champ | Description | Impact sur le calcul |
|-------|-------------|---------------------|
| **Nombre d'accidents** | Accidents impliquant ce véhicule | ⬆️ Plus d'accidents = prime plus élevée |
| **Années d'expérience** | Expérience du conducteur | ⬇️ Plus d'expérience = prime réduite |

**Valeurs par défaut:**
- Accidents: 0
- Expérience: 5 ans

### 4️⃣ Soumettre et analyser

1. Cliquez sur **"Créer l'annonce et analyser"**
2. Le système va:
   - ⏳ Créer l'annonce dans la base de données
   - 🔍 Analyser avec le Fraud Detection AI
   - 🛡️ Calculer avec l'Insurance Risk AI
   - 💾 Stocker tous les résultats
3. Vous verrez une notification avec les résultats
4. Redirection automatique vers la page de test après 3 secondes

---

## 📊 Comprendre les résultats

### Résultats de l'analyse de fraude

```
Score: 0.15
Niveau de risque: low
Indicateurs:
  - Prix cohérent avec le marché
  - Description détaillée
```

**Niveaux de risque:**
- 🟢 **Low** (< 0.3): Annonce fiable
- 🟡 **Medium** (0.3-0.7): Vérification recommandée
- 🔴 **High** (> 0.7): Forte suspicion de fraude

### Résultats de l'assurance

```
Score de risque: 0.306
Prime annuelle: 743.04 TND
Niveau de risque: medium
```

**Interprétation:**
- **Score de risque**: 0-1 (plus haut = plus risqué)
- **Prime**: Coût annuel estimé de l'assurance
- **Niveau**: Catégorie de risque

---

## 🔧 Architecture technique

### Flux de création d'annonce

```
Frontend (Next.js)
    ↓ POST /api/annonces
Backend Node.js
    ↓ Validation
    ├─→ Fraud Detection API (port 5001)
    │   └─→ Retourne fraud_score, risk_level, indicators
    ├─→ Insurance Risk AI (port 5002)
    │   └─→ Retourne riskScore, insuranceCost, riskLevel
    └─→ MySQL Database
        └─→ Stocke annonce + résultats IA
```

### Fichiers créés

1. **`lib/annonce-api-client.ts`** - Client API TypeScript
   - Méthodes: create, getAll, getById, update, delete
   - Gestion des erreurs et timeouts
   - Types TypeScript complets

2. **`app/annonces/new/page.tsx`** - Page de création
   - Formulaire complet avec validation
   - Chargement automatique des voitures
   - Affichage des résultats IA
   - Interface responsive

### Endpoints utilisés

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/voitures` | Liste des voitures |
| GET | `/api/annonces` | Liste des annonces |
| POST | `/api/annonces` | Créer une annonce |
| GET | `/api/annonces/:id` | Détails d'une annonce |

---

## 🧪 Scénarios de test

### Test 1: Annonce normale (risque faible)

```
Voiture: Peugeot 208 (2019)
Prix: 45000 TND
Kilométrage: 50000 km
Accidents: 0
Expérience: 10 ans

Résultats attendus:
✅ Fraud score: ~0.15 (low)
✅ Insurance cost: ~650 TND
✅ Risk level: low
```

### Test 2: Annonce avec historique d'accidents

```
Voiture: BMW 320i (2022)
Prix: 85000 TND
Kilométrage: 30000 km
Accidents: 2
Expérience: 3 ans

Résultats attendus:
⚠️ Fraud score: ~0.35 (medium)
⚠️ Insurance cost: ~1200 TND
⚠️ Risk level: medium/high
```

### Test 3: Annonce suspecte (prix trop bas)

```
Voiture: Mercedes C-Class (2023)
Prix: 15000 TND (très bas!)
Kilométrage: 5000 km
Accidents: 0
Expérience: 5 ans

Résultats attendus:
🚨 Fraud score: ~0.75 (high)
⚠️ Insurance cost: variable
🚨 Risk level: high
```

---

## 🎨 Personnalisation

### Modifier l'ID du vendeur

Par défaut, `vendeur_id` est fixé à `1` pour les tests. Pour utiliser l'utilisateur connecté:

```typescript
// Dans app/annonces/new/page.tsx, remplacez:
vendeur_id: "1", 

// Par:
vendeur_id: user?.id || "1",  // Si vous avez un système d'auth
```

### Ajouter des champs personnalisés

Éditez ces fichiers pour ajouter de nouveaux champs:

1. **Backend:** `AIBackendVoitures/Controllers/AnnonceController.js`
2. **Frontend:** `app/annonces/new/page.tsx`
3. **Types:** `lib/annonce-api-client.ts`
4. **Database:** Ajoutez les colonnes dans MySQL

---

## 🐛 Dépannage

### Erreur: "Aucune voiture disponible"

**Cause:** La base de données ne contient aucune voiture

**Solution:**
1. Allez sur `http://localhost:3000/cars/new`
2. Créez au moins une voiture
3. Retournez sur la page de création d'annonce

### Erreur: "Connection refused 5002"

**Cause:** Le service Flask (Insurance Risk) n'est pas démarré

**Solution:**
```powershell
cd C:\Users\ilyes\insurance-risk-analyzer
.\.venv\Scripts\python.exe app.py
```

### Erreur: "Failed to create annonce"

**Vérifications:**
1. ✅ Les 3 services sont démarrés (Flask:5002, Backend:5000, Frontend:3000)
2. ✅ MySQL est actif et accessible
3. ✅ La voiture sélectionnée existe dans la DB
4. ✅ Tous les champs obligatoires sont remplis

**Debug:**
```powershell
# Vérifier les logs du backend
cd C:\Git\Ai_MarketPlace\AIBackendVoitures
node server.js

# Les erreurs s'afficheront dans le terminal
```

---

## 📚 Exemples d'utilisation

### Exemple 1: Création programmatique (via API)

```typescript
import { annonceApiClient } from '@/lib/annonce-api-client';

const createAnnonce = async () => {
  const response = await annonceApiClient.createAnnonce({
    voiture_id: 1,
    vendeur_id: 1,
    prix: 45000,
    description: "Voiture en excellent état, premier propriétaire",
    kilometrage: 50000,
    etat: "excellent",
    localisation: "Tunis",
    number_of_accidents: 0,
    years_of_experience: 10
  });

  console.log('Fraud analysis:', response.fraud_analysis);
  console.log('Insurance analysis:', response.insurance_analysis);
};
```

### Exemple 2: Récupérer toutes les annonces

```typescript
const annonces = await annonceApiClient.getAllAnnonces();
console.log(annonces.data); // Array d'annonces
```

### Exemple 3: Récupérer une annonce spécifique

```typescript
const annonce = await annonceApiClient.getAnnonceById(5);
console.log('Insurance cost:', annonce.data.insurance_cost);
```

---

## 🎯 Prochaines étapes

### Fonctionnalités à implémenter

1. **Authentification**
   - Intégrer le système d'auth pour `vendeur_id`
   - Autorisation: seul le vendeur peut modifier son annonce

2. **Upload d'images**
   - Ajouter un champ pour uploader des photos
   - Stocker dans un service de storage (AWS S3, Cloudinary)

3. **Édition d'annonces**
   - Page `/annonces/[id]/edit`
   - Préremplir le formulaire avec les données existantes

4. **Filtres et recherche**
   - Filtrer par marque, prix, kilométrage
   - Recherche full-text dans les descriptions

5. **Dashboard vendeur**
   - Vue d'ensemble de toutes ses annonces
   - Statistiques de vues et favoris

---

## 📞 Support

Si vous rencontrez des problèmes:

1. **Vérifiez les prérequis:**
   - ✅ Node.js installé
   - ✅ Python 3.10+ installé
   - ✅ MySQL 8.0 actif
   - ✅ Toutes les dépendances installées

2. **Consultez les logs:**
   - Backend: Terminal où `node server.js` tourne
   - Flask: Terminal où `python app.py` tourne
   - Frontend: Console du navigateur (F12)

3. **Testez avec Postman:**
   - Référez-vous à `POSTMAN_TESTING_GUIDE.md`
   - Testez les endpoints individuellement

---

## ✅ Checklist de validation

Avant de créer votre première annonce:

- [ ] MySQL est démarré
- [ ] Flask service tourne sur port 5002
- [ ] Backend Node.js tourne sur port 5000
- [ ] Frontend Next.js tourne sur port 3000
- [ ] Au moins une voiture existe dans la DB
- [ ] Les migrations d'assurance sont appliquées
- [ ] Test de santé Flask: `http://localhost:5002/health` retourne OK
- [ ] Test de santé Backend: `http://localhost:5000` retourne OK

---

**🎉 Vous êtes prêt à créer des annonces avec analyse IA automatique!**

Commencez par créer une voiture sur `/cars/new`, puis créez votre première annonce sur `/annonces/new`!
