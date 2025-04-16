const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const { 
    login,
    faceLogin,
    registerFace 
} = require('../controllers/authController'); // Import correct

// Routes
router.post('/login', login);
router.post('/face-login', upload.single('faceImage'), faceLogin);
router.post('/register-face', upload.single('faceImage'), registerFace);

module.exports = router;
