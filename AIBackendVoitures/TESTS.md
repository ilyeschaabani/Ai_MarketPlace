# Tests de l'API avec cURL

## 1️⃣ Tester la connexion au serveur

```bash
curl http://localhost:5000
```

## 2️⃣ Ajouter une voiture (CREATE)

```bash
curl -X POST http://localhost:5000/api/voitures ^
  -H "Content-Type: application/json" ^
  -d "{\"matricule\":\"TN001\",\"marque\":\"Toyota\",\"modele\":\"Corolla\",\"annee\":2022,\"puissance\":120,\"cylindres\":4,\"carburant\":\"Essence\",\"transmission\":\"Automatique\",\"traction\":\"Avant\",\"prix\":35000}"
```

## 3️⃣ Récupérer toutes les voitures (READ)

```bash
curl http://localhost:5000/api/voitures
```

## 4️⃣ Récupérer une voiture spécifique (READ)

```bash
curl http://localhost:5000/api/voitures/TN001
```

## 5️⃣ Modifier une voiture (UPDATE)

```bash
curl -X PUT http://localhost:5000/api/voitures/TN001 ^
  -H "Content-Type: application/json" ^
  -d "{\"prix\":37000,\"puissance\":130}"
```

## 6️⃣ Supprimer une voiture (DELETE)

```bash
curl -X DELETE http://localhost:5000/api/voitures/TN001
```

## 7️⃣ Compter les voitures

```bash
curl http://localhost:5000/api/voitures/stats/count
```

## 8️⃣ Rechercher des voitures

```bash
curl "http://localhost:5000/api/voitures/search/filter?marque=Toyota&prixMin=30000&prixMax=40000"
```

## Vérifier dans PHPmyAdmin

1. Ouvrez: http://localhost/phpmyadmin
2. Base de données: `marketplace_db`
3. Table: `voitures`
4. Vous verrez toutes vos opérations enregistrées!

## Colonnes d'audit

- `date_creation`: Enregistrée automatiquement à la création
- `date_modification`: Mise à jour automatiquement à chaque modification
