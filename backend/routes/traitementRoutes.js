const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middlewares/auth');
const traitementController = require('../controllers/traitementController');

router.post('/', authenticate, authorize(['professionnel']), traitementController.createTraitement);
router.get('/dossier/:dossierId', authenticate, authorize(['professionnel', 'patient']), traitementController.getTraitementsByDossier);

module.exports = router;
