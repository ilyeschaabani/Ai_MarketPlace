# 🚀 Guide de Démarrage - Service Voitures

## Prérequis

- Node.js (v16 ou supérieur)
- XAMPP (MySQL et PHPMyAdmin)
- npm ou pnpm

## Installation

### 1. Démarrer MySQL

1. Ouvrez XAMPP Control Panel
2. Démarrez le module **MySQL**
3. Ouvrez PHPMyAdmin: http://localhost/phpmyadmin
4. Créez une base de données nommée `gestion_voitures`

### 2. Configurer et Démarrer le Backend (Port 5000)

```powershell
# Naviguer vers le dossier backend
cd "AIBackendVoitures"

# Installer les dépendances
npm install

# Configurer les variables d'environnement
# Créer un fichier .env avec:
# PORT=5000
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=
# DB_NAME=gestion_voitures

# Démarrer le serveur
node server.js
```

Vous devriez voir:
```
✓ Base de données initialisée avec succès
🚗 Serveur démarré sur http://localhost:5000
📝 API disponible sur http://localhost:5000/api/voitures
📊 Consulter la base de données sur http://localhost/phpmyadmin
```

### 3. Configurer et Démarrer le Frontend (Port 3000)

```powershell
# Ouvrir un NOUVEAU terminal
# Naviguer vers le dossier frontend
cd "Ai_MarketPlace-main"

# Installer les dépendances
npm install

# Le fichier .env.local est déjà configuré avec:
# NEXT_PUBLIC_VOITURE_API_URL=http://localhost:5000

# Démarrer le serveur de développement
npm run dev
```

Vous devriez voir:
```
▲ Next.js 14.x.x
- Local:        http://localhost:3000
```

## 🎯 Accès aux Services

### Frontend
- **Page principale**: http://localhost:3000
- **Service Voitures**: http://localhost:3000/cars
  - Liste des voitures
  - Ajouter une voiture
  - Voir détails
  - Modifier
  - Supprimer

### Backend API
- **Documentation**: http://localhost:5000
- **Toutes les voitures**: http://localhost:5000/api/voitures
- **Une voiture**: http://localhost:5000/api/voitures/AB-123-CD
- **Rechercher**: http://localhost:5000/api/voitures/search/filter?marque=Renault
- **Compter**: http://localhost:5000/api/voitures/stats/count

### Base de Données
- **PHPMyAdmin**: http://localhost/phpmyadmin
  - Base: `gestion_voitures`
  - Table: `voitures`

## 🧪 Tester l'Installation

### Option 1: Test Automatique (Recommandé)

```powershell
# Dans le dossier racine du projet
node test-voiture-integration.js
```

Ce script va:
1. Vérifier la connexion au backend
2. Tester toutes les opérations CRUD
3. Tester la recherche
4. Afficher un rapport de test

### Option 2: Test Manuel

1. Allez sur http://localhost:3000/cars
2. Cliquez sur "Ajouter une Voiture"
3. Remplissez le formulaire:
   - Matricule: AB-123-CD
   - Marque: Renault
   - Modèle: Clio
   - Année: 2020
   - Prix: 15000
4. Cliquez sur "Ajouter la voiture"
5. Vérifiez qu'elle apparaît dans la liste
6. Testez les autres fonctionnalités (détails, modification, suppression)

### Option 3: Test avec Postman

1. Ouvrez Postman
2. Importez le fichier `AIBackendVoitures/postman_collection.json`
3. Exécutez les requêtes de test

## ⚠️ Dépannage

### Erreur: "Backend non disponible"

**Problème**: Le frontend ne peut pas se connecter au backend

**Solutions**:
1. Vérifiez que le backend est démarré: http://localhost:5000
2. Vérifiez le fichier `.env.local` dans `Ai_MarketPlace-main`:
   ```
   NEXT_PUBLIC_VOITURE_API_URL=http://localhost:5000
   ```
3. Redémarrez le frontend après avoir modifié `.env.local`

### Erreur MySQL: "ER_ACCESS_DENIED_ERROR"

**Problème**: Connexion à MySQL refusée

**Solutions**:
1. Vérifiez que MySQL est démarré dans XAMPP
2. Vérifiez le fichier `.env` dans `AIBackendVoitures`:
   ```
   DB_USER=root
   DB_PASSWORD=
   ```
3. Si vous avez un mot de passe MySQL, ajoutez-le à `DB_PASSWORD`

### Erreur: "Database does not exist"

**Problème**: La base de données n'existe pas

**Solutions**:
1. Ouvrez PHPMyAdmin: http://localhost/phpmyadmin
2. Créez une base nommée `gestion_voitures`
3. Redémarrez le backend

### Erreur CORS

**Problème**: Le navigateur bloque les requêtes

**Solutions**:
1. Vérifiez que le backend est configuré pour accepter localhost:3000
2. Dans `AIBackendVoitures/server.js`, vérifiez:
   ```javascript
   app.use(cors({
     origin: ['http://localhost:3000', 'http://localhost:3001'],
     ...
   }));
   ```

### Le port 5000 est déjà utilisé

**Solutions**:
1. Changez le port dans `AIBackendVoitures/.env`:
   ```
   PORT=5001
   ```
2. Mettez à jour `Ai_MarketPlace-main/.env.local`:
   ```
   NEXT_PUBLIC_VOITURE_API_URL=http://localhost:5001
   ```
3. Redémarrez les deux serveurs

## 📝 Notes Importantes

### Service Séparé

Le service **VOITURES** (`/cars`) est complètement séparé du service **CAR LISTING**:

- **Voitures** (`/cars`):
  - Backend: Port 5000
  - Base de données: MySQL (gestion_voitures)
  - API: `/api/voitures`

- **Car Listings** (`/buyer/listings`, `/seller/listings`):
  - Système existant (inchangé)
  - Utilise mock-data ou autre backend

### Structure des Données

Une voiture a les champs suivants:

**Obligatoires**:
- matricule (string)
- marque (string)
- modele (string)

**Optionnels**:
- annee (number)
- puissance (number, en CV)
- cylindres (number, en cm³)
- carburant (string: essence, diesel, electrique, hybride, gpl)
- transmission (string: manuelle, automatique, semi-automatique)
- traction (string: avant, arriere, integrale)
- prix (number, en €)

## 🔄 Workflow de Développement

### Développement Normal

1. Démarrez MySQL dans XAMPP
2. Démarrez le backend: `node server.js`
3. Démarrez le frontend: `npm run dev`
4. Développez et testez
5. Les changements frontend se rechargent automatiquement
6. Redémarrez le backend après modifications du code backend

### Arrêt des Services

1. Frontend: `Ctrl + C` dans le terminal
2. Backend: `Ctrl + C` dans le terminal
3. MySQL: Arrêtez dans XAMPP (optionnel)

### Redémarrage Complet

```powershell
# Terminal 1 - Backend
cd AIBackendVoitures
node server.js

# Terminal 2 - Frontend
cd Ai_MarketPlace-main
npm run dev
```

## 📚 Documentation Complète

Pour plus de détails, consultez:
- `INTEGRATION_VOITURES.md` - Guide complet d'intégration
- `AIBackendVoitures/README.md` - Documentation du backend
- `AIBackendVoitures/API_POSTMAN.md` - Documentation de l'API

## ✅ Checklist de Vérification

Avant de commencer le développement, vérifiez:

- [ ] XAMPP est installé
- [ ] MySQL est démarré dans XAMPP
- [ ] La base `gestion_voitures` existe
- [ ] Node.js est installé (`node --version`)
- [ ] Le backend démarre sans erreur (port 5000)
- [ ] Le frontend démarre sans erreur (port 3000)
- [ ] http://localhost:3000/cars affiche la page
- [ ] Les tests d'intégration passent

## 🎉 Félicitations !

Si tout fonctionne, vous êtes prêt à utiliser le service de gestion des voitures avec:
- ✅ Interface utilisateur complète
- ✅ CRUD complet (Create, Read, Update, Delete)
- ✅ Recherche et filtres
- ✅ Voitures similaires
- ✅ Base de données MySQL persistante
- ✅ API REST documentée
