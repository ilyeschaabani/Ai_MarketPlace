# API Marketplace - Gestion des Voitures avec MySQL

## 📋 Description

API REST pour la gestion des voitures avec intégration MySQL. Toutes les opérations (création, lecture, modification, suppression) sont enregistrées dans la base de données.

## 🛠️ Installation

### 1. Prérequis
- Node.js (v14+)
- MySQL Server en cours d'exécution
- PHPmyAdmin (optionnel, pour gérer la base de données)

### 2. Installation des dépendances

```bash
npm install
```

### 3. Configuration de la base de données

#### Option 1: Via PHPmyAdmin

1. Ouvrez PHPmyAdmin: `http://localhost/phpmyadmin`
2. Cliquez sur "Importer"
3. Sélectionnez le fichier `migrations/create_voitures_table.sql`
4. Cliquez sur "Go"

#### Option 2: Via MySQL CLI

```bash
mysql -u root -p < migrations/create_voitures_table.sql
```

#### Option 3: Laissez le serveur créer automatiquement la table
Le serveur crée automatiquement la table au démarrage.

### 4. Configuration des variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
# Configuration de la base de données MySQL
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=marketplace_db

# Configuration du serveur
PORT=3000
NODE_ENV=development
```

**Modifiez les valeurs selon votre configuration MySQL :**
- `DB_HOST`: Adresse du serveur MySQL
- `DB_USER`: Nom d'utilisateur MySQL
- `DB_PASSWORD`: Mot de passe MySQL (vide par défaut)
- `DB_NAME`: Nom de la base de données

### 5. Démarrage du serveur

```bash
npm start
```

Ou en mode développement:

```bash
npm run dev
```

Vous devriez voir:
```
🔄 Initialisation de la base de données...
✓ Base de données initialisée avec succès
🚗 Serveur démarré sur http://localhost:3000
📝 API disponible sur http://localhost:3000/api/voitures
```

## 📡 Endpoints API

### 1. **Créer une voiture** (POST)
```
POST /api/voitures
```
**Body:**
```json
{
  "matricule": "TN123",
  "marque": "Toyota",
  "modele": "Corolla",
  "annee": 2022,
  "puissance": 120,
  "cylindres": 4,
  "carburant": "Essence",
  "transmission": "Automatique",
  "traction": "Avant",
  "prix": 35000
}
```

### 2. **Récupérer toutes les voitures** (GET)
```
GET /api/voitures
```
**Réponse:**
```json
{
  "success": true,
  "message": "3 voiture(s) trouvée(s)",
  "data": [
    {
      "id": 1,
      "matricule": "TN001",
      "marque": "Toyota",
      "modele": "Corolla",
      "annee": 2020,
      "puissance": 120,
      "cylindres": 4,
      "carburant": "Essence",
      "transmission": "Automatique",
      "traction": "Avant",
      "prix": 35000,
      "date_creation": "2024-01-15T10:30:00.000Z",
      "date_modification": "2024-01-15T10:30:00.000Z"
    }
  ],
  "status": 200
}
```

### 3. **Récupérer une voiture par matricule** (GET)
```
GET /api/voitures/TN123
```

### 4. **Modifier une voiture** (PUT)
```
PUT /api/voitures/TN123
```
**Body:**
```json
{
  "prix": 36000,
  "marque": "Honda"
}
```

### 5. **Supprimer une voiture** (DELETE)
```
DELETE /api/voitures/TN123
```

### 6. **Compter les voitures** (GET)
```
GET /api/voitures/stats/count
```
**Réponse:**
```json
{
  "success": true,
  "message": "Nombre de voitures",
  "data": { "total": 15 },
  "status": 200
}
```

### 7. **Rechercher des voitures** (GET)
```
GET /api/voitures/search/filter?marque=Toyota&prixMin=30000&prixMax=40000
```

**Paramètres de recherche:**
- `marque`: Recherche par marque
- `modele`: Recherche par modèle
- `annee`: Filtre par année exacte
- `prixMin`: Prix minimum
- `prixMax`: Prix maximum

## 🗄️ Structure de la base de données

### Table `voitures`

| Colonne | Type | Contrainte | Description |
|---------|------|-----------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Identifiant unique |
| matricule | VARCHAR(20) | UNIQUE, NOT NULL | Numéro de série unique |
| marque | VARCHAR(100) | NOT NULL | Marque du véhicule |
| modele | VARCHAR(100) | NOT NULL | Modèle du véhicule |
| annee | INT | | Année de fabrication |
| puissance | INT | | Puissance en chevaux |
| cylindres | INT | | Nombre de cylindres |
| carburant | VARCHAR(50) | | Type de carburant |
| transmission | VARCHAR(50) | | Type de transmission |
| traction | VARCHAR(50) | | Type de traction |
| prix | DECIMAL(10,2) | | Prix de la voiture |
| date_creation | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Date d'ajout |
| date_modification | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP, ON UPDATE | Date de modification |

**Indices:**
- Index sur `matricule` pour recherche rapide
- Index sur `marque` pour filtrage
- Index sur `prix` pour requêtes de plage

## 🧪 Test de l'API avec Postman/cURL

### Créer une voiture
```bash
curl -X POST http://localhost:3000/api/voitures \
  -H "Content-Type: application/json" \
  -d '{
    "matricule": "TN999",
    "marque": "Ferrari",
    "modele": "F8",
    "annee": 2023,
    "puissance": 710,
    "cylindres": 12,
    "carburant": "Essence",
    "transmission": "Automatique",
    "traction": "Arrière",
    "prix": 280000
  }'
```

### Récupérer toutes les voitures
```bash
curl http://localhost:3000/api/voitures
```

### Modifier une voiture
```bash
curl -X PUT http://localhost:3000/api/voitures/TN999 \
  -H "Content-Type: application/json" \
  -d '{"prix": 290000}'
```

### Supprimer une voiture
```bash
curl -X DELETE http://localhost:3000/api/voitures/TN999
```

## 🔍 Vérifier les données dans PHPmyAdmin

1. Ouvrez PHPmyAdmin: `http://localhost/phpmyadmin`
2. Sélectionnez la base `marketplace_db`
3. Cliquez sur la table `voitures`
4. Vous verrez tous les enregistrements avec timestamps

## 📝 Structure du projet

```
AIBackendVoitures/
├── Controllers/
│   └── VoitureController.js    # Logique CRUD
├── Models/
│   └── Voiture.js              # Modèle de données (optionnel)
├── migrations/
│   └── create_voitures_table.sql # Schéma de base de données
├── .env                        # Configuration
├── db.js                       # Connexion MySQL
├── server.js                   # Serveur Express
├── package.json                # Dépendances
└── README.md                   # Ce fichier
```

## ⚠️ Dépannage

### Erreur: "Cannot find module 'mysql2'"
```bash
npm install mysql2
```

### Erreur: "connect ECONNREFUSED 127.0.0.1:3306"
- Assurez-vous que MySQL est en cours d'exécution
- Vérifiez les paramètres DB_HOST, DB_USER, DB_PASSWORD dans `.env`

### Erreur: "Access denied for user 'root'@'localhost'"
- Vérifiez le mot de passe MySQL dans `.env`
- Par défaut, le mot de passe MySQL est vide

### Erreur: "Unknown database 'marketplace_db'"
- Exécutez le fichier de migration SQL ou laissez le serveur la créer automatiquement

## 🚀 Prochaines étapes

1. Ajouter l'authentification (JWT)
2. Ajouter la validation des données
3. Implémenter la pagination
4. Ajouter les logs d'audit
5. Déployer sur un serveur en production

## 📄 Licence

MIT
