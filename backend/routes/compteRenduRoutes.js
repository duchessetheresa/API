const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middlewares/auth');
const compteRenduController = require('../controllers/compteRenduController');

router.post('/', authenticate, authorize(['professionnel']), compteRenduController.createCompteRendu);
router.get('/dossier/:dossierId', authenticate, authorize(['professionnel', 'patient']), compteRenduController.getComptesRendusByDossier);

module.exports = router;
