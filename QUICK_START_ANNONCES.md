# 🚀 Guide Rapide - Créer une Annonce (5 Minutes)

## Étape 1: Démarrer les services ⚙️

Ouvrez **3 terminaux PowerShell** et exécutez:

```powershell
# Terminal 1 - Insurance Risk AI
cd C:\Users\ilyes\insurance-risk-analyzer
.\.venv\Scripts\python.exe app.py
# Attendez: "Running on http://127.0.0.1:5002"

# Terminal 2 - Backend
cd C:\Git\Ai_MarketPlace\AIBackendVoitures
node server.js
# Attendez: "Server running on port 5000"

# Terminal 3 - Frontend
cd C:\Git\Ai_MarketPlace\Ai_MarketPlace-main
npm run dev
# Attendez: "Local: http://localhost:3000"
```

## Étape 2: Ouvrir le navigateur 🌐

```
http://localhost:3000
```

## Étape 3: Navigation 🧭

Dans la navbar, vous verrez maintenant:

```
[AI Car Market] [Voitures] [Annonces] [➕ Nouvelle Annonce] [Dashboard]
```

### Option A: Cliquer sur "Nouvelle Annonce"
Bouton vert avec icône ➕

### Option B: URL directe
```
http://localhost:3000/annonces/new
```

## Étape 4: Remplir le formulaire 📝

### Section 1: Sélection de la voiture

| Champ | Exemple |
|-------|---------|
| **Voiture** | Peugeot 208 (2019) - AB-123-CD |

> ⚠️ **Pas de voiture dans la liste?**
> 1. Cliquez sur "Créer une voiture d'abord"
> 2. Ou allez sur http://localhost:3000/cars/new
> 3. Créez une voiture
> 4. Revenez sur /annonces/new

### Section 2: Détails de l'annonce

| Champ | Valeur d'exemple | Obligatoire |
|-------|------------------|-------------|
| Prix de vente | `45000` | ✅ |
| Kilométrage | `75000` | ✅ |
| État | `Bon` | ❌ |
| Localisation | `Tunis` | ❌ |
| Description | `Voiture en excellent état, bien entretenue, premier propriétaire` | ✅ |

### Section 3: Informations pour l'assurance

| Champ | Valeur d'exemple | Impact |
|-------|------------------|--------|
| Nombre d'accidents | `0` | Plus = prime ⬆️ |
| Années d'expérience | `5` | Plus = prime ⬇️ |

## Étape 5: Créer et analyser 🎯

1. Cliquez sur **"Créer l'annonce et analyser"**

2. Vous verrez:
```
⏳ Analyse en cours par les IA...
```

3. Après 2-3 secondes:
```
✅ Annonce créée avec succès!
Votre annonce a été créée et analysée par nos IA.
🔍 Score de fraude: 0.15 (low)
🛡️ Prime d'assurance: 743.04 TND
```

4. **Redirection automatique** vers la page de test

## Étape 6: Voir les résultats 📊

Sur la page `/test-insurance`, vous verrez votre annonce avec:

### Carte d'information voiture
```
Peugeot 208
Année: 2019
Prix: 45,000 TND
Kilométrage: 75,000 km
```

### Carte d'analyse d'assurance
```
🛡️ Analyse d'Assurance
Score de risque: 0.306
Prime annuelle: 743.04 TND/an
Niveau de risque: medium 🟡
```

---

## 🎯 Exemples de test

### Test 1: Risque FAIBLE

```
Voiture: Peugeot 208 (2019)
Prix: 45000 TND
Kilométrage: 50000 km
Description: "Voiture bien entretenue, carnet complet"
Accidents: 0
Expérience: 10 ans

Résultat attendu:
✅ Fraud: LOW
✅ Insurance: ~650 TND
✅ Risk: LOW 🟢
```

### Test 2: Risque MOYEN

```
Voiture: BMW 320i (2022)
Prix: 85000 TND
Kilométrage: 30000 km
Description: "Très bon état"
Accidents: 1
Expérience: 5 ans

Résultat attendu:
⚠️ Fraud: MEDIUM
⚠️ Insurance: ~840 TND
⚠️ Risk: MEDIUM 🟡
```

### Test 3: Risque ÉLEVÉ

```
Voiture: Mercedes C-Class (2005)
Prix: 25000 TND
Kilométrage: 200000 km
Description: "À voir"
Accidents: 3
Expérience: 2 ans

Résultat attendu:
🚨 Fraud: HIGH
🚨 Insurance: ~1200 TND
🚨 Risk: HIGH 🔴
```

---

## 🔍 Vérification rapide

### Vérifier que tout fonctionne:

1. **Test Flask (Insurance AI):**
   ```powershell
   Invoke-WebRequest -Uri http://localhost:5002/health
   # Doit retourner: {"status":"ok"}
   ```

2. **Test Backend:**
   ```powershell
   Invoke-WebRequest -Uri http://localhost:5000
   # Doit retourner: {"message":"API Voitures"}
   ```

3. **Test Frontend:**
   - Ouvrez http://localhost:3000
   - Vous devez voir la page d'accueil

---

## ❌ Problèmes courants

### "Aucune voiture disponible"
**Solution:** Créez une voiture d'abord sur `/cars/new`

### "Connection refused 5002"
**Solution:** Le service Flask n'est pas démarré
```powershell
cd C:\Users\ilyes\insurance-risk-analyzer
.\.venv\Scripts\python.exe app.py
```

### "500 Internal Server Error"
**Solution:** Vérifiez que MySQL est démarré et accessible

### Le formulaire ne s'affiche pas
**Solution:** 
1. Vérifiez la console du navigateur (F12)
2. Assurez-vous que le frontend tourne sur port 3000
3. Redémarrez avec `npm run dev`

---

## 📱 Interface utilisateur

### Navigation principale

```
┌─────────────────────────────────────────────────┐
│ AI Car Market [Voitures] [Annonces] [➕ Nouvelle Annonce] │
└─────────────────────────────────────────────────┘
```

### Page de création

```
┌─────────────────────────────────────────┐
│ ← Retour à la liste                     │
│                                          │
│ 📝 Créer une Annonce                    │
│ Créez une nouvelle annonce de voiture   │
│                                          │
│ ┌─────────────────────────────────────┐ │
│ │ ⚠️ IA automatique: Lors de la      │ │
│ │ création, nos systèmes IA...        │ │
│ └─────────────────────────────────────┘ │
│                                          │
│ 🚗 Sélection de la voiture              │
│ ┌─────────────────────────────────────┐ │
│ │ Voiture *                            │ │
│ │ [Peugeot 208 (2019) - AB-123-CD ▼] │ │
│ └─────────────────────────────────────┘ │
│                                          │
│ 💰 Détails de l'annonce                │
│ ┌─────────────────┬─────────────────┐  │
│ │ Prix (TND) *    │ Kilométrage *   │  │
│ │ [45000]         │ [75000]         │  │
│ └─────────────────┴─────────────────┘  │
│                                          │
│ 🛡️ Informations pour l'assurance       │
│ ┌─────────────────┬─────────────────┐  │
│ │ Accidents       │ Expérience      │  │
│ │ [0]             │ [5]             │  │
│ └─────────────────┴─────────────────┘  │
│                                          │
│ [Annuler] [✅ Créer l'annonce]         │
└─────────────────────────────────────────┘
```

### Résultats après création

```
┌─────────────────────────────────────────┐
│ ✨ Résultats de l'analyse IA            │
│                                          │
│ 🛡️ Analyse de fraude                   │
│ ┌─────────────────────────────────────┐ │
│ │ Score: 0.15                          │ │
│ │ Niveau: low 🟢                      │ │
│ │ Indicateurs:                         │ │
│ │ • Prix cohérent avec le marché      │ │
│ └─────────────────────────────────────┘ │
│                                          │
│ 💰 Analyse d'assurance                 │
│ ┌─────────────────────────────────────┐ │
│ │ Score de risque: 0.306               │ │
│ │ Prime annuelle: 743.04 TND          │ │
│ │ Niveau: medium 🟡                   │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

## ⏱️ Temps total: ~5 minutes

1. Démarrer les services: **1 min**
2. Créer une voiture (si nécessaire): **2 min**
3. Créer l'annonce: **2 min**
4. Voir les résultats: **instantané**

---

## 🎓 Prochaines étapes

Une fois que vous maîtrisez la création d'annonces:

1. **Testez différents scénarios** (voir les 3 tests ci-dessus)
2. **Observez comment les IA réagissent** aux différentes valeurs
3. **Utilisez Postman** pour tester l'API directement (voir `POSTMAN_TESTING_GUIDE.md`)
4. **Personnalisez l'interface** selon vos besoins

---

**🎉 C'est parti! Créez votre première annonce maintenant!**

Ouvrez http://localhost:3000/annonces/new et commencez! 🚀
