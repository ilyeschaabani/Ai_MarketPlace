# 📚 Documentation des APIs - Gestion de Voitures

## 🚀 Démarrage du serveur

```bash
npm install express
node server.js
```

Le serveur démarre sur : **http://localhost:3000**

---

## 📝 APIs à tester dans Postman

### 1️⃣ CREATE - Ajouter une voiture
**Méthode:** `POST`  
**URL:** `http://localhost:3000/api/voitures`  
**Content-Type:** `application/json`

**JSON Body:**
```json
{
  "matricule": "MER-009",
  "marque": "Mercedes-Benz",
  "modele": "Classe A",
  "annee": 2021,
  "puissance": 163,
  "cylindres": 4,
  "carburant": "Essence",
  "transmission": "manuel",
  "traction": "FWD",
  "prix": 320.0
}
```

**Réponse (201 Created):**
```json
{
  "success": true,
  "message": "Voiture créée avec succès",
  "data": {
    "matricule": "MER-009",
    "marque": "Mercedes-Benz",
    "modele": "Classe A",
    "annee": 2021,
    "puissance": 163,
    "cylindres": 4,
    "carburant": "Essence",
    "transmission": "manuel",
    "traction": "FWD",
    "prix": 320
  },
  "status": 201
}
```

---

### 2️⃣ CREATE - Ajouter d'autres voitures (Exemples)

**Voiture 2 - Toyota:**
```json
{
  "matricule": "TOY-001",
  "marque": "Toyota",
  "modele": "Corolla",
  "annee": 2022,
  "puissance": 130,
  "cylindres": 4,
  "carburant": "Essence",
  "transmission": "automatique",
  "traction": "FWD",
  "prix": 250.0
}
```

**Voiture 3 - BMW:**
```json
{
  "matricule": "BMW-005",
  "marque": "BMW",
  "modele": "Série 3",
  "annee": 2020,
  "puissance": 190,
  "cylindres": 6,
  "carburant": "Diesel",
  "transmission": "automatique",
  "traction": "RWD",
  "prix": 450.0
}
```

**Voiture 4 - Peugeot:**
```json
{
  "matricule": "PEU-012",
  "marque": "Peugeot",
  "modele": "308",
  "annee": 2019,
  "puissance": 110,
  "cylindres": 4,
  "carburant": "Essence",
  "transmission": "manuel",
  "traction": "FWD",
  "prix": 180.0
}
```

---

### 3️⃣ READ - Récupérer toutes les voitures
**Méthode:** `GET`  
**URL:** `http://localhost:3000/api/voitures`  
**Body:** Aucun

**Réponse (200 OK):**
```json
{
  "success": true,
  "message": "4 voiture(s) trouvée(s)",
  "data": [
    {
      "matricule": "MER-009",
      "marque": "Mercedes-Benz",
      "modele": "Classe A",
      "annee": 2021,
      "puissance": 163,
      "cylindres": 4,
      "carburant": "Essence",
      "transmission": "manuel",
      "traction": "FWD",
      "prix": 320
    },
    {
      "matricule": "TOY-001",
      "marque": "Toyota",
      "modele": "Corolla",
      "annee": 2022,
      "puissance": 130,
      "cylindres": 4,
      "carburant": "Essence",
      "transmission": "automatique",
      "traction": "FWD",
      "prix": 250
    }
  ],
  "status": 200
}
```

---

### 4️⃣ READ - Récupérer une voiture spécifique
**Méthode:** `GET`  
**URL:** `http://localhost:3000/api/voitures/MER-009`  
**Body:** Aucun

**Réponse (200 OK):**
```json
{
  "success": true,
  "message": "Voiture trouvée",
  "data": {
    "matricule": "MER-009",
    "marque": "Mercedes-Benz",
    "modele": "Classe A",
    "annee": 2021,
    "puissance": 163,
    "cylindres": 4,
    "carburant": "Essence",
    "transmission": "manuel",
    "traction": "FWD",
    "prix": 320
  },
  "status": 200
}
```

**Erreur (404 Not Found):**
```json
{
  "success": false,
  "message": "Aucune voiture trouvée avec le matricule : INEXISTANT",
  "status": 404
}
```

---

### 5️⃣ UPDATE - Modifier une voiture
**Méthode:** `PUT`  
**URL:** `http://localhost:3000/api/voitures/MER-009`  
**Content-Type:** `application/json`

**JSON Body (Modifier seulement certains champs):**
```json
{
  "prix": 350.0,
  "puissance": 170,
  "annee": 2023
}
```

**Réponse (200 OK):**
```json
{
  "success": true,
  "message": "Voiture mise à jour avec succès",
  "data": {
    "matricule": "MER-009",
    "marque": "Mercedes-Benz",
    "modele": "Classe A",
    "annee": 2023,
    "puissance": 170,
    "cylindres": 4,
    "carburant": "Essence",
    "transmission": "manuel",
    "traction": "FWD",
    "prix": 350
  },
  "status": 200
}
```

---

### 6️⃣ DELETE - Supprimer une voiture
**Méthode:** `DELETE`  
**URL:** `http://localhost:3000/api/voitures/MER-009`  
**Body:** Aucun

**Réponse (200 OK):**
```json
{
  "success": true,
  "message": "Voiture supprimée avec succès",
  "data": {
    "matricule": "MER-009",
    "marque": "Mercedes-Benz",
    "modele": "Classe A",
    "annee": 2023,
    "puissance": 170,
    "cylindres": 4,
    "carburant": "Essence",
    "transmission": "manuel",
    "traction": "FWD",
    "prix": 350
  },
  "status": 200
}
```

---

## 🧪 Ordre recommandé pour tester

1. ✅ **POST** - Créer 4 voitures (Mercedes, Toyota, BMW, Peugeot)
2. ✅ **GET** - Récupérer toutes les voitures
3. ✅ **GET** - Récupérer une voiture spécifique (MER-009)
4. ✅ **PUT** - Modifier la voiture (MER-009)
5. ✅ **GET** - Vérifier la modification
6. ✅ **DELETE** - Supprimer une voiture
7. ✅ **GET** - Vérifier la suppression

---

## 📊 Résumé des APIs

| Opération | Méthode | URL | Description |
|-----------|---------|-----|-------------|
| Créer | POST | `/api/voitures` | Ajouter une nouvelle voiture |
| Lire tout | GET | `/api/voitures` | Récupérer toutes les voitures |
| Lire un | GET | `/api/voitures/:matricule` | Récupérer une voiture |
| Modifier | PUT | `/api/voitures/:matricule` | Mettre à jour une voiture |
| Supprimer | DELETE | `/api/voitures/:matricule` | Supprimer une voiture |

---

## ⚠️ Codes de statut HTTP

- **201** - Voiture créée avec succès
- **200** - Opération réussie
- **400** - Erreur dans les données (champs manquants)
- **404** - Voiture non trouvée
- **409** - Matricule déjà existant
- **500** - Erreur serveur

---

## 📦 Installation et exécution

```bash
# 1. Naviguer dans le dossier du projet
cd c:\Users\HP\Desktop\AIBackendVoitures

# 2. Installer Express
npm install express

# 3. Démarrer le serveur
node server.js

# 4. Ouvrir Postman et commencer à tester les APIs
```

**La sortie devrait afficher:**
```
✅ Serveur démarré sur http://localhost:3000

📋 Endpoints disponibles:
  POST   http://localhost:3000/api/voitures
  GET    http://localhost:3000/api/voitures
  GET    http://localhost:3000/api/voitures/:matricule
  PUT    http://localhost:3000/api/voitures/:matricule
  DELETE http://localhost:3000/api/voitures/:matricule

💡 Testez avec Postman ou curl
```

