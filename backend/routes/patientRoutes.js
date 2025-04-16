// backend/routes/patientRoutes.js
const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController'); // Vérifiez ce chemin
const { authenticate, authorize } = require('../middlewares/auth');

// Correction : Utilisez patientController.getAllPatients directement
router.get('/', 
  authenticate, 
  authorize(['professionnel']), 
  patientController.getAllPatients // Doit être une fonction
);

router.get('/:id', 
  authenticate, 
  authorize(['professionnel', 'patient']), 
  patientController.getPatientById
);

router.post('/', 
  authenticate, 
  authorize(['professionnel']), 
  patientController.createPatient
);

module.exports = router;
