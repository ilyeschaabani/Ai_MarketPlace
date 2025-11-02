const express = require('express');
const cors = require('cors');
const VoitureController = require('./Controllers/VoitureController');
const { initializeDatabase } = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware pour parser le JSON
app.use(express.json());

// CORS middleware - Configuration pour permettre les requêtes du frontend
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'], // Frontend Next.js
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Initialiser le contrôleur
const voitureController = new VoitureController();

// ========== ROUTES CRUD ==========

/**
 * POST /api/voitures - Créer une nouvelle voiture
 */
app.post('/api/voitures', async (req, res) => {
  const resultat = await voitureController.creerVoiture(req.body);
  res.status(resultat.status).json(resultat);
});

/**
 * GET /api/voitures - Récupérer toutes les voitures
 */
app.get('/api/voitures', async (req, res) => {
  const resultat = await voitureController.obtenirToutesLesVoitures();
  res.status(resultat.status).json(resultat);
});

/**
 * GET /api/voitures/:matricule - Récupérer une voiture par son matricule
 */
app.get('/api/voitures/:matricule', async (req, res) => {
  const resultat = await voitureController.obtenirVoitureParMatricule(req.params.matricule);
  res.status(resultat.status).json(resultat);
});

/**
 * PUT /api/voitures/:matricule - Modifier une voiture
 */
app.put('/api/voitures/:matricule', async (req, res) => {
  const resultat = await voitureController.mettreAJourVoiture(req.params.matricule, req.body);
  res.status(resultat.status).json(resultat);
});

/**
 * DELETE /api/voitures/:matricule - Supprimer une voiture
 */
app.delete('/api/voitures/:matricule', async (req, res) => {
  const resultat = await voitureController.supprimerVoiture(req.params.matricule);
  res.status(resultat.status).json(resultat);
});

/**
 * GET /api/voitures/stats/count - Compter les voitures
 */
app.get('/api/voitures/stats/count', async (req, res) => {
  const resultat = await voitureController.compterVoitures();
  res.status(resultat.status).json(resultat);
});

/**
 * GET /api/voitures/search/filter - Rechercher des voitures
 */
app.get('/api/voitures/search/filter', async (req, res) => {
  const resultat = await voitureController.rechercherVoitures(req.query);
  res.status(resultat.status).json(resultat);
});

// Route de test
app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenue sur l\'API de gestion des voitures',
    version: '2.0.0',
    database: 'MySQL',
    endpoints: {
      'POST /api/voitures': 'Créer une voiture',
      'GET /api/voitures': 'Récupérer toutes les voitures',
      'GET /api/voitures/:matricule': 'Récupérer une voiture',
      'PUT /api/voitures/:matricule': 'Modifier une voiture',
      'DELETE /api/voitures/:matricule': 'Supprimer une voiture',
      'GET /api/voitures/stats/count': 'Compter les voitures',
      'GET /api/voitures/search/filter': 'Rechercher des voitures'
    }
  });
});

// Gestion des routes non trouvées
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée',
    status: 404
  });
});

// Démarrer le serveur avec initialisation de la base de données
async function startServer() {
  try {
    console.log('🔄 Initialisation de la base de données...');
    await initializeDatabase();
    console.log('✓ Base de données initialisée avec succès');

    app.listen(PORT, () => {
      console.log(`\n🚗 Serveur démarré sur http://localhost:${PORT}`);
      console.log(`📝 API disponible sur http://localhost:${PORT}/api/voitures`);
      console.log(`📊 Consulter la base de données sur http://localhost/phpmyadmin`);
    });
  } catch (error) {
    console.error('✗ Erreur au démarrage du serveur:', error.message);
    process.exit(1);
  }
}

startServer();
