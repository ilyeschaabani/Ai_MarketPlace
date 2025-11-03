/**
 * @file server.js
 * @description Serveur principal Express pour l'API de gestion de voitures et rendez-vous
 * @version 2.1.0
 * @created 2024-11-03
 * @updated 2024-11-03 - Ajout module rendez-vous
 * @context Application de vente de voitures d'occasion (Acheteur/Vendeur)
 */

const express = require('express');
const cors = require('cors');
const VoitureController = require('./Controllers/VoitureController');
const AppointmentController = require('./Controllers/appointmentController');
const { initializeDatabase } = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ========== MIDDLEWARE ==========

/**
 * Middleware pour parser le JSON
 */
app.use(express.json());

/**
 * Middleware CORS - Configuration pour permettre les requêtes du frontend
 */
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ========== INITIALISATION DES CONTRÔLEURS ==========

const voitureController = new VoitureController();
const appointmentController = new AppointmentController();

// ========== ROUTES VOITURES (EXISTANT) ==========

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

// ========== ROUTES RENDEZ-VOUS (NOUVEAU) ==========

/**
 * POST /api/appointments - Créer un nouveau rendez-vous
 */
app.post('/api/appointments', async (req, res) => {
  await appointmentController.createAppointment(req, res);
});

/**
 * GET /api/appointments - Récupérer tous les rendez-vous
 */
app.get('/api/appointments', async (req, res) => {
  await appointmentController.getAllAppointments(req, res);
});

/**
 * GET /api/appointments/:id - Récupérer un rendez-vous spécifique
 */
app.get('/api/appointments/:id', async (req, res) => {
  await appointmentController.getAppointmentById(req, res);
});

/**
 * PUT /api/appointments/:id - Modifier un rendez-vous
 */
app.put('/api/appointments/:id', async (req, res) => {
  await appointmentController.updateAppointment(req, res);
});

/**
 * DELETE /api/appointments/:id - Supprimer un rendez-vous
 */
app.delete('/api/appointments/:id', async (req, res) => {
  await appointmentController.deleteAppointment(req, res);
});

// ========== ROUTES GÉNÉRALES ==========

/**
 * GET / - Route de test et documentation de l'API
 */
app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenue sur l\'API de gestion des voitures et rendez-vous',
    version: '2.1.0',
    database: 'MySQL',
    endpoints: {
      // Voitures
      'POST /api/voitures': 'Créer une voiture',
      'GET /api/voitures': 'Récupérer toutes les voitures',
      'GET /api/voitures/:matricule': 'Récupérer une voiture',
      'PUT /api/voitures/:matricule': 'Modifier une voiture',
      'DELETE /api/voitures/:matricule': 'Supprimer une voiture',
      'GET /api/voitures/stats/count': 'Compter les voitures',
      'GET /api/voitures/search/filter': 'Rechercher des voitures',
      
      // Rendez-vous
      'POST /api/appointments': 'Créer un rendez-vous',
      'GET /api/appointments': 'Récupérer tous les rendez-vous',
      'GET /api/appointments/:id': 'Récupérer un rendez-vous spécifique',
      'PUT /api/appointments/:id': 'Modifier un rendez-vous',
      'DELETE /api/appointments/:id': 'Supprimer un rendez-vous'
    },
    context: 'Application de vente de voitures d\'occasion (Acheteur/Vendeur)'
  });
});

// ========== GESTION DES ERREURS ==========

/**
 * Middleware de gestion des routes non trouvées
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée',
    status: 404,
    path: req.path
  });
});

/**
 * Middleware de gestion des erreurs globales
 */
app.use((err, req, res, next) => {
  console.error('❌ Erreur serveur:', err.message);
  res.status(500).json({
    success: false,
    message: 'Erreur interne du serveur',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ========== DÉMARRAGE DU SERVEUR ==========

/**
 * Fonction de démarrage du serveur avec initialisation de la base de données
 */
async function startServer() {
  try {
    console.log('🔄 Initialisation de la base de données...');
    await initializeDatabase();
    console.log('✓ Base de données initialisée avec succès');

    app.listen(PORT, () => {
      console.log(`\n🚗 Serveur démarré sur http://localhost:${PORT}`);
      console.log(`📝 API Voitures disponible sur http://localhost:${PORT}/api/voitures`);
      console.log(`📅 API Rendez-vous disponible sur http://localhost:${PORT}/api/appointments`);
      console.log(`📊 Consulter la base de données sur http://localhost/phpmyadmin`);
      console.log(`\n📚 Documentation API disponible sur http://localhost:${PORT}/`);
    });
  } catch (error) {
    console.error('✗ Erreur au démarrage du serveur:', error.message);
    process.exit(1);
  }
}

// Démarrer le serveur
startServer();