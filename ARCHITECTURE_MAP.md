# 🏗️ Architecture du Service Voitures

## Vue d'ensemble

```
┌─────────────────────────────────────────────────────────────────┐
│                        UTILISATEUR                               │
│                     (Navigateur Web)                             │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          │ HTTP
                          │
┌─────────────────────────▼───────────────────────────────────────┐
│                  FRONTEND - Next.js                              │
│                    Port: 3000                                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Routes /cars/*                                          │  │
│  │  ├── /cars              (Liste + CRUD)                   │  │
│  │  ├── /cars/new          (Ajouter)                        │  │
│  │  ├── /cars/[id]         (Détails + Similaires)           │  │
│  │  └── /cars/[id]/edit    (Modifier)                       │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Client API (voiture-api-client.ts)                      │  │
│  │  - getAllVoitures()                                      │  │
│  │  - getVoitureByMatricule()                              │  │
│  │  - createVoiture()                                       │  │
│  │  - updateVoiture()                                       │  │
│  │  - deleteVoiture()                                       │  │
│  │  - searchVoitures()                                      │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          │ HTTP/REST
                          │ (CORS activé)
                          │
┌─────────────────────────▼───────────────────────────────────────┐
│                BACKEND - Express.js                              │
│                    Port: 5000                                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Routes API (/api/voitures)                              │  │
│  │  ├── GET    /api/voitures                                │  │
│  │  ├── GET    /api/voitures/:matricule                     │  │
│  │  ├── POST   /api/voitures                                │  │
│  │  ├── PUT    /api/voitures/:matricule                     │  │
│  │  ├── DELETE /api/voitures/:matricule                     │  │
│  │  ├── GET    /api/voitures/search/filter                  │  │
│  │  └── GET    /api/voitures/stats/count                    │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  VoitureController                                       │  │
│  │  - creerVoiture()                                        │  │
│  │  - obtenirToutesLesVoitures()                           │  │
│  │  - obtenirVoitureParMatricule()                         │  │
│  │  - mettreAJourVoiture()                                  │  │
│  │  - supprimerVoiture()                                    │  │
│  │  - rechercherVoitures()                                  │  │
│  │  - compterVoitures()                                     │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Modèle Voiture (Voiture.js)                            │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          │ MySQL2
                          │ (Connection Pool)
                          │
┌─────────────────────────▼───────────────────────────────────────┐
│                   BASE DE DONNÉES                                │
│                      MySQL                                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Database: gestion_voitures                              │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │  Table: voitures                                   │  │  │
│  │  │  ├── id (PRIMARY KEY, AUTO_INCREMENT)              │  │  │
│  │  │  ├── matricule (VARCHAR UNIQUE, INDEX)             │  │  │
│  │  │  ├── marque (VARCHAR, INDEX)                       │  │  │
│  │  │  ├── modele (VARCHAR)                              │  │  │
│  │  │  ├── annee (INT)                                   │  │  │
│  │  │  ├── puissance (DECIMAL)                           │  │  │
│  │  │  ├── cylindres (DECIMAL)                           │  │  │
│  │  │  ├── carburant (VARCHAR)                           │  │  │
│  │  │  ├── transmission (VARCHAR)                        │  │  │
│  │  │  ├── traction (VARCHAR)                            │  │  │
│  │  │  ├── prix (DECIMAL)                                │  │  │
│  │  │  ├── date_creation (TIMESTAMP)                     │  │  │
│  │  │  └── date_modification (TIMESTAMP)                 │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Géré via: PHPMyAdmin (http://localhost/phpmyadmin)             │
└──────────────────────────────────────────────────────────────────┘
```

## Flux de Données

### 1. Créer une Voiture

```
Utilisateur → Frontend (/cars/new)
    ↓
    Remplit le formulaire
    ↓
    Click "Ajouter"
    ↓
voitureApiClient.createVoiture(data)
    ↓
    POST http://localhost:5000/api/voitures
    ↓
Backend → VoitureController.creerVoiture()
    ↓
    Validation des données
    ↓
    INSERT INTO voitures
    ↓
MySQL → Enregistre la voiture
    ↓
    Retourne l'ID
    ↓
Backend → Response { success: true, data: {...} }
    ↓
Frontend → Redirection vers /cars
    ↓
Utilisateur voit la nouvelle voiture dans la liste
```

### 2. Lire les Voitures

```
Utilisateur → Visite /cars
    ↓
useEffect() → voitureApiClient.getAllVoitures()
    ↓
    GET http://localhost:5000/api/voitures
    ↓
Backend → VoitureController.obtenirToutesLesVoitures()
    ↓
    SELECT * FROM voitures
    ↓
MySQL → Retourne les voitures
    ↓
Backend → Response { success: true, data: [...] }
    ↓
Frontend → Affichage dans la grille
    ↓
Utilisateur voit toutes les voitures
```

### 3. Mettre à Jour une Voiture

```
Utilisateur → /cars/[matricule]/edit
    ↓
    Charge les données actuelles
    ↓
    Modifie les champs
    ↓
    Click "Enregistrer"
    ↓
voitureApiClient.updateVoiture(matricule, data)
    ↓
    PUT http://localhost:5000/api/voitures/:matricule
    ↓
Backend → VoitureController.mettreAJourVoiture()
    ↓
    UPDATE voitures SET ... WHERE matricule = ?
    ↓
MySQL → Met à jour la voiture
    ↓
Backend → Response { success: true, data: {...} }
    ↓
Frontend → Redirection vers /cars/[matricule]
    ↓
Utilisateur voit les modifications
```

### 4. Supprimer une Voiture

```
Utilisateur → Click "Supprimer"
    ↓
    Confirme dans le dialog
    ↓
voitureApiClient.deleteVoiture(matricule)
    ↓
    DELETE http://localhost:5000/api/voitures/:matricule
    ↓
Backend → VoitureController.supprimerVoiture()
    ↓
    DELETE FROM voitures WHERE matricule = ?
    ↓
MySQL → Supprime la voiture
    ↓
Backend → Response { success: true }
    ↓
Frontend → Recharge la liste
    ↓
Utilisateur voit la voiture disparaître
```

### 5. Rechercher des Voitures

```
Utilisateur → Entre "Renault" dans le filtre marque
    ↓
useEffect() détecte le changement
    ↓
    Filtrage côté client (pour la performance)
    ↓
Affichage des résultats filtrés

OU (pour recherche serveur)

Utilisateur → Recherche avancée
    ↓
voitureApiClient.searchVoitures({ marque: "Renault" })
    ↓
    GET http://localhost:5000/api/voitures/search/filter?marque=Renault
    ↓
Backend → VoitureController.rechercherVoitures()
    ↓
    SELECT * FROM voitures WHERE marque LIKE ?
    ↓
MySQL → Retourne les résultats
    ↓
Backend → Response { success: true, data: [...] }
    ↓
Frontend → Affichage des résultats
```

## Technologies Utilisées

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Icons**: Lucide React
- **HTTP Client**: Fetch API native

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL2 (avec Pool)
- **CORS**: cors middleware
- **Env**: dotenv

### Base de Données
- **SGBD**: MySQL 8.0+
- **Admin**: PHPMyAdmin
- **Server**: XAMPP

## Sécurité

### CORS
- Origine autorisée: `http://localhost:3000`
- Méthodes: GET, POST, PUT, DELETE, OPTIONS
- Headers: Content-Type, Authorization

### Validation
- Validation côté client (formulaires React)
- Validation côté serveur (VoitureController)
- Contraintes de base de données (UNIQUE, NOT NULL)

### Erreurs
- Gestion centralisée des erreurs
- Messages d'erreur clairs
- Status HTTP appropriés (200, 400, 404, 500)

## Séparation des Services

⚠️ **IMPORTANT**: Ne pas confondre avec le service Car Listing

| Aspect | Service Voitures | Service Car Listing |
|--------|------------------|---------------------|
| URL | `/cars/*` | `/buyer/listings`, `/seller/listings` |
| Backend | Port 5000 | Autre |
| Base | MySQL (gestion_voitures) | Autre |
| API | `/api/voitures` | Autre |
| Données | Voitures techniques | Annonces de vente |

## Évolutions Futures

### Phase 1 (Actuel) ✅
- CRUD complet
- Recherche par marque/modèle
- Voitures similaires (par marque)
- Interface utilisateur

### Phase 2 (À venir)
- **Embedding pour Similarité**
  - Modèle: Sentence-BERT ou OpenAI
  - Calcul de vecteurs pour chaque voiture
  - Recherche par similarité cosine
  
- **Images**
  - Upload d'images
  - Stockage (local ou cloud)
  - Galerie photo

- **Statistiques Avancées**
  - Dashboard analytique
  - Graphiques de prix
  - Tendances du marché

- **API IA**
  - Prédiction de prix
  - Détection de fraude
  - Recommandations personnalisées

### Phase 3 (Future)
- Export PDF
- Historique des modifications
- Multi-langue
- Mobile app (React Native)

## Monitoring

### Logs Backend
```javascript
console.log('🚗 Serveur démarré sur http://localhost:5000')
console.log('✓ Base de données initialisée')
console.error('✗ Erreur:', error.message)
```

### Logs Frontend
- Console du navigateur (F12)
- Network tab pour les requêtes API
- React DevTools pour les états

### Base de Données
- PHPMyAdmin pour requêtes SQL
- Logs MySQL dans XAMPP

## Performance

### Optimisations
- Connection pooling MySQL (max 10 connexions)
- Timeout des requêtes (10 secondes)
- Index sur matricule et marque
- Pagination (à implémenter)

### Limites Actuelles
- Pas de cache
- Pas de pagination
- Images non gérées
- Pas de compression

## Support

En cas de problème:
1. Consultez `QUICKSTART.md`
2. Vérifiez les logs backend et frontend
3. Testez avec `node test-voiture-integration.js`
4. Vérifiez MySQL dans PHPMyAdmin
