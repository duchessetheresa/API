const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const faceAuthController = require('../controllers/faceAuthController');
const { authenticate, authorize } = require('../middlewares/auth');

router.post('/register', authenticate, authorize(['professionnel']), upload.single('faceImage'), faceAuthController.registerFace);
router.post('/verify', upload.single('faceImage'), faceAuthController.verifyFace);

module.exports = router;
