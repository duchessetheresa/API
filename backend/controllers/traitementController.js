const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const createTraitement = async (req, res) => {
    const { description, medicament, posologie, duree, compte_rendu_id, dossier_id } = req.body;
    const id = uuidv4();

    try {
        await pool.query(
            'INSERT INTO Traitement (id, description, medicament, posologie, duree, compte_rendu_id, dossier_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [id, description, medicament, posologie, duree, compte_rendu_id, dossier_id]
        );

        res.status(201).json({ id, message: 'Traitement created successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

const getTraitementsByDossier = async (req, res) => {
    try {
        const [traitements] = await pool.query(
            'SELECT * FROM Traitement WHERE dossier_id = ?',
            [req.params.dossierId]
        );
        
        res.json(traitements);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

module.exports = { createTraitement, getTraitementsByDossier };
