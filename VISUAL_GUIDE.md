# 🎯 Guide Visuel Rapide - Service Voitures

## 🚀 Démarrage en 3 Minutes

### 1️⃣ Démarrer MySQL (30 secondes)
```
XAMPP Control Panel → Start MySQL
```
✅ MySQL devrait être "Running" (vert)

### 2️⃣ Démarrer le Backend (1 minute)
```powershell
cd AIBackendVoitures
node server.js
```
✅ Vous verrez: `🚗 Serveur démarré sur http://localhost:5000`

### 3️⃣ Démarrer le Frontend (1 minute)
```powershell
cd Ai_MarketPlace-main
npm run dev
```
✅ Vous verrez: `- Local: http://localhost:3000`

### 4️⃣ Ouvrir le Navigateur (30 secondes)
```
http://localhost:3000/cars
```
✅ Vous verrez la page de gestion des voitures

---

## 🎨 Aperçu de l'Interface

### Page Liste (`/cars`)
```
┌─────────────────────────────────────────────────────────────┐
│  🏠 AI Car Market        [Voitures] [Dashboard] [👤 User]   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Gestion des Voitures                   [➕ Ajouter]        │
│  Gérez votre inventaire...                                  │
│                                                              │
│  ┌──────────┬──────────┬──────────┬──────────┐             │
│  │ Total: 5 │Marques:3 │Résultats│Prix Moyen│             │
│  │ voitures │          │    5    │ 15000€   │             │
│  └──────────┴──────────┴──────────┴──────────┘             │
│                                                              │
│  ┌─────────────────────────────────────────────┐            │
│  │ 🔍 Rechercher...  [Marque ▼] [Carburant ▼] │            │
│  └─────────────────────────────────────────────┘            │
│                                                              │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐           │
│  │🚗 Renault  │  │🚗 Peugeot  │  │🚗 Citroën  │           │
│  │   Clio     │  │    308     │  │    C3      │           │
│  │ AB-123-CD  │  │ EF-456-GH  │  │ IJ-789-KL  │           │
│  │            │  │            │  │            │           │
│  │ 📅 2020    │  │ 📅 2021    │  │ 📅 2019    │           │
│  │ ⚡ 90 CV   │  │ ⚡ 130 CV  │  │ ⚡ 75 CV   │           │
│  │ ⛽ essence │  │ ⛽ diesel  │  │ ⛽ essence │           │
│  │            │  │            │  │            │           │
│  │ 💰 12000€  │  │ 💰 18500€  │  │ 💰 9000€   │           │
│  │            │  │            │  │            │           │
│  │[Détails] [✏️][🗑️]│[Détails][✏️][🗑️]│[Détails][✏️][🗑️]│           │
│  └────────────┘  └────────────┘  └────────────┘           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Page Ajout (`/cars/new`)
```
┌─────────────────────────────────────────────────────────────┐
│  🏠 AI Car Market        [Voitures] [Dashboard] [👤 User]   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ← Retour à la liste                                        │
│                                                              │
│  🚗 Ajouter une Voiture                                     │
│  Remplissez les informations...                             │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Informations de base                                │    │
│  │                                                      │    │
│  │ Matricule *          Marque *                       │    │
│  │ [AB-123-CD     ]     [Renault        ]              │    │
│  │                                                      │    │
│  │ Modèle *             Année                          │    │
│  │ [Clio          ]     [2020           ]              │    │
│  │                                                      │    │
│  │ Caractéristiques techniques                         │    │
│  │                                                      │    │
│  │ Puissance (CV)       Cylindrée (cm³)                │    │
│  │ [90            ]     [1200           ]              │    │
│  │                                                      │    │
│  │ Carburant            Transmission                   │    │
│  │ [Essence      ▼]     [Manuelle      ▼]              │    │
│  │                                                      │    │
│  │ Traction             Prix (€)                       │    │
│  │ [Avant        ▼]     [12000          ]              │    │
│  │                                                      │    │
│  │               [💾 Ajouter] [Annuler]                │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Page Détails (`/cars/AB-123-CD`)
```
┌─────────────────────────────────────────────────────────────┐
│  🏠 AI Car Market        [Voitures] [Dashboard] [👤 User]   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ← Retour à la liste                                        │
│                                                              │
│  Renault Clio                         [✏️ Modifier] [🗑️]    │
│  AB-123-CD  2020                                            │
│                                                              │
│  ┌─────────────────────────┐  ┌───────────────────┐        │
│  │                         │  │ Voitures Similaires│        │
│  │  Prix                   │  │ Basées sur Renault │        │
│  │  💰 12 000 €            │  │                    │        │
│  │                         │  │ ┌─────────────┐   │        │
│  │ Caractéristiques        │  │ │ Renault     │   │        │
│  │                         │  │ │ Megane      │   │        │
│  │ ⚡ Puissance             │  │ │ 2019        │   │        │
│  │    90 CV                │  │ │ 15000€      │   │        │
│  │                         │  │ └─────────────┘   │        │
│  │ 🔧 Cylindrée            │  │                    │        │
│  │    1200 cm³             │  │ ┌─────────────┐   │        │
│  │                         │  │ │ Renault     │   │        │
│  │ ⛽ Carburant             │  │ │ Captur      │   │        │
│  │    Essence              │  │ │ 2021        │   │        │
│  │                         │  │ │ 18000€      │   │        │
│  │ ⚙️ Transmission          │  │ └─────────────┘   │        │
│  │    Manuelle             │  │                    │        │
│  │                         │  │ 💡 À venir :       │        │
│  │ 🏁 Traction             │  │ Embedding pour     │        │
│  │    Avant                │  │ meilleure          │        │
│  │                         │  │ similarité         │        │
│  │ 📅 Année                 │  │                    │        │
│  │    2020                 │  └───────────────────┘        │
│  │                         │                                │
│  │ Informations système    │                                │
│  │ ID: 1                   │                                │
│  │ Créé: 30/10/2025       │                                │
│  │ Modifié: 30/10/2025    │                                │
│  └─────────────────────────┘                                │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Workflow Typique

### Scénario 1: Ajouter une Voiture

```
1. 📍 Aller sur /cars
2. ➕ Cliquer "Ajouter une Voiture"
3. 📝 Remplir le formulaire:
   ├─ Matricule: AB-123-CD
   ├─ Marque: Renault
   ├─ Modèle: Clio
   ├─ Année: 2020
   ├─ Prix: 12000
   └─ ...autres champs
4. 💾 Cliquer "Ajouter"
5. ✅ Toast: "Voiture ajoutée avec succès"
6. 🔄 Redirection vers /cars
7. 👀 Voir la nouvelle voiture dans la liste
```

### Scénario 2: Modifier une Voiture

```
1. 📍 Sur /cars, trouver la voiture
2. ✏️ Cliquer sur l'icône Modifier
3. 📝 Page /cars/AB-123-CD/edit s'ouvre
4. ✏️ Modifier le prix: 12000 → 11500
5. 💾 Cliquer "Enregistrer"
6. ✅ Toast: "Voiture modifiée"
7. 🔄 Redirection vers /cars/AB-123-CD
8. 👀 Voir le nouveau prix
```

### Scénario 3: Voir les Détails

```
1. 📍 Sur /cars, cliquer "Détails"
2. 📄 Page /cars/AB-123-CD s'ouvre
3. 👀 Voir toutes les caractéristiques
4. 👀 Voir les voitures similaires (même marque)
5. 🔗 Cliquer sur une voiture similaire
6. 🔄 Navigation vers cette voiture
```

### Scénario 4: Rechercher

```
1. 📍 Sur /cars
2. 🔍 Taper "Renault" dans la recherche
3. ⚡ Filtrage instantané côté client
4. 👀 Voir seulement les Renault
5. 🎯 Ou sélectionner filtre Marque: Renault
6. 👀 Même résultat
7. ❌ Cliquer X pour effacer
8. 🔄 Toutes les voitures réapparaissent
```

---

## 🗺️ Carte des URLs

```
Frontend (http://localhost:3000)
│
├─ /                           Page d'accueil
├─ /login                      Connexion
├─ /register                   Inscription
│
├─ /cars                       ⭐ Liste des voitures
│   ├─ /new                    ⭐ Ajouter voiture
│   └─ /[matricule]            ⭐ Détails voiture
│       └─ /edit               ⭐ Modifier voiture
│
├─ /buyer/dashboard            Dashboard acheteur
└─ /seller/dashboard           Dashboard vendeur

Backend (http://localhost:5000)
│
├─ /                           Documentation API
│
└─ /api/voitures               ⭐ Endpoint principal
    ├─ GET    /                Liste toutes
    ├─ POST   /                Créer
    ├─ GET    /:matricule      Détails
    ├─ PUT    /:matricule      Modifier
    ├─ DELETE /:matricule      Supprimer
    ├─ GET    /search/filter   Rechercher
    └─ GET    /stats/count     Compter
```

---

## 📊 Flux de Données en Images

### Création d'une Voiture

```
   Utilisateur
       │
       │ Remplit formulaire
       ▼
   Frontend
   (React Form)
       │
       │ voitureApiClient.createVoiture()
       ▼
   HTTP POST
   localhost:5000/api/voitures
       │
       │ JSON: { matricule, marque, ... }
       ▼
   Backend
   (Express)
       │
       │ VoitureController.creerVoiture()
       ▼
   MySQL
   (gestion_voitures)
       │
       │ INSERT INTO voitures
       ▼
   Enregistré ✅
       │
       │ Retour { success: true, data: {...} }
       ▼
   Frontend
       │
       │ Toast notification
       ▼
   Utilisateur voit
   la confirmation ✅
```

---

## 🎨 Composants Utilisés

### shadcn/ui Components

```
✓ Button          - Boutons d'action
✓ Card            - Cartes d'affichage
✓ Input           - Champs de saisie
✓ Select          - Listes déroulantes
✓ Badge           - Étiquettes
✓ Dialog          - Modales
✓ Toast           - Notifications
✓ Separator       - Séparateurs
✓ Label           - Labels de formulaire
```

### Icônes Lucide React

```
🚗 Car            - Logo, voitures
📅 Calendar       - Années
⚡ Gauge          - Puissance
⛽ Fuel           - Carburant
⚙️ Settings       - Transmission
💰 Euro           - Prix
🔍 Search         - Recherche
➕ Plus           - Ajouter
✏️ Edit           - Modifier
🗑️ Trash2         - Supprimer
⬅️ ArrowLeft      - Retour
💾 Save           - Enregistrer
⏳ Loader2        - Chargement
⚠️ AlertCircle    - Erreurs
```

---

## 📱 États de l'Interface

### État: Chargement
```
┌─────────────────────┐
│                     │
│    ⏳ Chargement    │
│    des voitures...  │
│                     │
└─────────────────────┘
```

### État: Erreur
```
┌─────────────────────┐
│        ⚠️           │
│  Backend non        │
│  disponible         │
│                     │
│  [Réessayer]        │
└─────────────────────┘
```

### État: Vide
```
┌─────────────────────┐
│        🚗           │
│  Aucune voiture     │
│  trouvée            │
│                     │
│  [➕ Ajouter]       │
└─────────────────────┘
```

### État: Succès
```
┌─────────────────────┐
│  🚗 Renault Clio   │
│  AB-123-CD         │
│  💰 12000€         │
│  [Détails][✏️][🗑️] │
└─────────────────────┘
```

---

## ⌨️ Raccourcis Clavier (À venir)

```
Ctrl + N  - Nouvelle voiture
Ctrl + S  - Sauvegarder
Ctrl + F  - Focus recherche
Escape    - Fermer dialogs
```

---

## 🎯 Prochaines Fonctionnalités

### Court Terme
- [ ] Pagination (10 voitures par page)
- [ ] Tri (par prix, année, marque)
- [ ] Export CSV/Excel
- [ ] Import CSV

### Moyen Terme
- [ ] Upload d'images
- [ ] Galerie photos
- [ ] Historique des modifications
- [ ] Commentaires/Notes

### Long Terme
- [ ] Embedding pour similarité intelligente
- [ ] Prédiction de prix (IA)
- [ ] Détection de fraude
- [ ] Recommandations personnalisées
- [ ] Mobile app

---

## 💡 Astuces

### Développement

```powershell
# Redémarrer rapidement
Ctrl + C  (dans les 2 terminaux)
↑ (flèche haut) + Enter (relancer les commandes)

# Voir les logs en temps réel
# Les consoles affichent les requêtes
```

### Debugging

```javascript
// Dans le navigateur (F12)
// Onglet Console: Voir les erreurs JS
// Onglet Network: Voir les requêtes API
// Onglet Application: Voir le localStorage
```

### Base de Données

```
PHPMyAdmin → gestion_voitures → voitures
- Voir toutes les données
- Modifier manuellement
- Exécuter des requêtes SQL
```

---

## ✅ Checklist Rapide

Avant de commencer:
- [ ] MySQL démarré (vert dans XAMPP)
- [ ] Backend démarré (terminal 1)
- [ ] Frontend démarré (terminal 2)
- [ ] http://localhost:3000/cars accessible

Chaque fois que vous codez:
- [ ] Pas d'erreur dans console backend
- [ ] Pas d'erreur dans console frontend
- [ ] Pas d'erreur dans console navigateur (F12)

---

Tout est prêt ! Bon développement ! 🚀
