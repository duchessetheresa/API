const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const getAllProfessionnels = async (req, res) => {
    try {
        const [professionnels] = await pool.query(`
            SELECT ps.*, e.nom as etablissement_nom 
            FROM ProfessionnelSante ps
            LEFT JOIN Etablissement e ON ps.etablissement_id = e.id
        `);
        res.json(professionnels);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

const createProfessionnel = async (req, res) => {
    const { nom, specialite, etablissement_id } = req.body;
    const id = uuidv4();

    try {
        await pool.query(
            'INSERT INTO ProfessionnelSante (id, nom, specialite, etablissement_id) VALUES (?, ?, ?, ?)',
            [id, nom, specialite, etablissement_id]
        );

        // Créer également un compte d'authentification
        const authId = uuidv4();
        const username = `${nom.split(' ')[0].toLowerCase()}.${id.slice(0, 4)}`;
        const password = 'password123'; // À changer en prod
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await pool.query(
            'INSERT INTO Authentification (id, username, password, utilisateur_id, type_utilisateur) VALUES (?, ?, ?, ?, ?)',
            [authId, username, hashedPassword, id, 'professionnel']
        );

        res.status(201).json({ id, username, password, message: 'Professionnel créé avec succès' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

module.exports = { getAllProfessionnels, createProfessionnel };
