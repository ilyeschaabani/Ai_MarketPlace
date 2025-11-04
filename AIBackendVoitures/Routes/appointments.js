const express = require('express');
const AppointmentController = require('../Controllers/appointmentController');
const router = express.Router();
const ctrl = new AppointmentController();

// ========== ROUTES RENDEZ-VOUS ==========

// Créer un rendez-vous
router.post('/', async (req, res) => {
  await ctrl.createAppointment(req, res);
});

// Récupérer tous les rendez-vous
router.get('/', async (req, res) => {
  await ctrl.getAllAppointments(req, res);
});

// Récupérer un rendez-vous par ID
router.get('/:id', async (req, res) => {
  await ctrl.getAppointmentById(req, res);
});

// Mettre à jour un rendez-vous
router.put('/:id', async (req, res) => {
  await ctrl.updateAppointment(req, res);
});

// Supprimer un rendez-vous
router.delete('/:id', async (req, res) => {
  await ctrl.deleteAppointment(req, res);
});

module.exports = router;