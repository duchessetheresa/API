const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

// Fonction login ajoutée
const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const [rows] = await pool.query('SELECT * FROM Authentification WHERE username = ?', [username]);
        
        if (rows.length === 0) {
            return res.status(400).json({ message: 'Identifiants invalides' });
        }

        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Identifiants invalides' });
        }

        const payload = {
            user: {
                id: user.id,
                username: user.username,
                type_utilisateur: user.type_utilisateur,
                utilisateur_id: user.utilisateur_id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
};

// Fonction faceLogin existante
const faceLogin = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Aucune image fournie' });
    }

    try {
        // ... (votre implémentation existante)
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

// Fonction registerFace existante
const registerFace = async (req, res) => {
    const { patientId } = req.body;
    const faceImage = req.file;

    if (!faceImage) {
        return res.status(400).json({ message: 'Aucune image faciale fournie' });
    }

    try {
        // ... (votre implémentation existante)
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

module.exports = { 
    login, 
    faceLogin, 
    registerFace 
};
