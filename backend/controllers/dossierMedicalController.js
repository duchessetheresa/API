const pool = require('../config/db');

const getDossierByPatientId = async (req, res) => {
    try {
        const [dossier] = await pool.query(
            'SELECT * FROM DossierMedical WHERE patient_id = ?', 
            [req.params.patientId]
        );
        
        if (dossier.length === 0) {
            return res.status(404).json({ message: 'Dossier not found' });
        }
        
        // Récupérer les comptes rendus associés
        const [comptesRendus] = await pool.query(
            'SELECT * FROM CompteRendu WHERE dossier_id = ?',
            [dossier[0].id]
        );
        
        // Récupérer les traitements associés
        const [traitements] = await pool.query(
            'SELECT * FROM Traitement WHERE dossier_id = ?',
            [dossier[0].id]
        );
        
        res.json({
            ...dossier[0],
            comptesRendus,
            traitements
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

const updateDossierMedical = async (req, res) => {
    const { historique_soins, allergies } = req.body;
    
    try {
        await pool.query(
            'UPDATE DossierMedical SET historique_soins = ?, allergies = ? WHERE patient_id = ?',
            [historique_soins, allergies, req.params.patientId]
        );
        
        res.json({ message: 'Dossier updated successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

module.exports = { getDossierByPatientId, updateDossierMedical };
