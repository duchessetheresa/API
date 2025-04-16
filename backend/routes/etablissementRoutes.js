const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { authenticate, authorize } = require('../middlewares/auth');
const { v4: uuidv4 } = require('uuid');

// Get all establishments
router.get('/', authenticate, authorize(['professionnel']), async (req, res) => {
    try {
        const [etablissements] = await pool.query('SELECT * FROM Etablissement');
        res.json(etablissements);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Create new establishment
router.post('/', authenticate, authorize(['professionnel']), async (req, res) => {
    const { nom, adresse, type } = req.body;
    const id = uuidv4();

    try {
        await pool.query(
            'INSERT INTO Etablissement (id, nom, adresse, type) VALUES (?, ?, ?, ?)',
            [id, nom, adresse, type]
        );
        res.status(201).json({ id, message: 'Etablissement créé avec succès' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
