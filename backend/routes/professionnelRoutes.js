const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middlewares/auth');
const professionnelController = require('../controllers/professionnelController');

router.get('/', authenticate, authorize(['professionnel']), professionnelController.getAllProfessionnels);
router.post('/', authenticate, authorize(['professionnel']), professionnelController.createProfessionnel);

module.exports = router;
