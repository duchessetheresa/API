const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middlewares/auth');
const dossierController = require('../controllers/dossierMedicalController');

router.get('/patient/:patientId', authenticate, authorize(['professionnel', 'patient']), dossierController.getDossierByPatientId);
router.put('/patient/:patientId', authenticate, authorize(['professionnel']), dossierController.updateDossierMedical);

module.exports = router;
