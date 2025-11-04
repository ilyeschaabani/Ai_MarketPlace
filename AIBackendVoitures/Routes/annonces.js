const express = require('express');
const AnnonceController = require('../Controllers/AnnonceController');
const router = express.Router();
const ctrl = new AnnonceController();

// Créer une annonce
router.post('/', async (req, res) => {
  const result = await ctrl.creerAnnonce(req.body);
  res.status(result.status).json(result);
});

// Obtenir toutes les annonces
router.get('/', async (req, res) => {
  const result = await ctrl.obtenirToutesLesAnnonces();
  res.status(result.status).json(result);
});

// Obtenir une annonce par ID
router.get('/:id', async (req, res) => {
  const result = await ctrl.obtenirAnnonceParId(req.params.id);
  res.status(result.status).json(result);
});

// Obtenir les annonces d'une voiture spécifique
router.get('/voiture/:id_voiture', async (req, res) => {
  const result = await ctrl.obtenirAnnoncesParVoiture(req.params.id_voiture);
  res.status(result.status).json(result);
});

// Mettre à jour une annonce
router.put('/:id', async (req, res) => {
  const result = await ctrl.mettreAJourAnnonce(req.params.id, req.body);
  res.status(result.status).json(result);
});

// Supprimer une annonce
router.delete('/:id', async (req, res) => {
  const result = await ctrl.supprimerAnnonce(req.params.id);
  res.status(result.status).json(result);
});

// Rechercher des annonces
router.post('/search', async (req, res) => {
  const result = await ctrl.rechercherAnnonces(req.body);
  res.status(result.status).json(result);
});
// ========== ADMIN ROUTES ==========
router.get('/admin/all', async (req, res) => {
  const result = await ctrl.obtenirToutesLesAnnoncesAdmin();
  res.status(result.status).json(result);
});

router.get('/admin/frauduleuses', async (req, res) => {
  const result = await ctrl.obtenirAnnoncesFrauduleuses();
  res.status(result.status).json(result);
});
module.exports = router;