const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const createCompteRendu = async (req, res) => {
    const { dossier_id, contenu } = req.body;
    const id = uuidv4();
    const auteur_id = req.user.utilisateur_id;
    const date = new Date().toISOString().split('T')[0];

    try {
        await pool.query(
            'INSERT INTO CompteRendu (id, date, contenu, auteur_id, dossier_id) VALUES (?, ?, ?, ?, ?)',
            [id, date, contenu, auteur_id, dossier_id]
        );

        res.status(201).json({ id, message: 'Compte rendu created successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

const getComptesRendusByDossier = async (req, res) => {
    try {
        const [comptesRendus] = await pool.query(
            'SELECT cr.*, ps.nom as auteur_nom FROM CompteRendu cr JOIN ProfessionnelSante ps ON cr.auteur_id = ps.id WHERE dossier_id = ?',
            [req.params.dossierId]
        );
        
        res.json(comptesRendus);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

module.exports = { createCompteRendu, getComptesRendusByDossier };
