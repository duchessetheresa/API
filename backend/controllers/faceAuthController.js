const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const faceRecognition = require('../services/faceRecognitionService');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const registerFace = async (req, res) => {
    const { patientId } = req.body;
    const faceImage = req.file;

    if (!faceImage) {
        return res.status(400).json({ message: 'Aucune image faciale fournie' });
    }

    try {
        // Vérifier si le patient existe
        const [patient] = await pool.query('SELECT id FROM Patient WHERE id = ?', [patientId]);
        if (patient.length === 0) {
            return res.status(404).json({ message: 'Patient non trouvé' });
        }

        // Extraire le descripteur facial
        const descriptor = await faceRecognition.detectAndExtractFace(faceImage.buffer);
        const descriptorArray = Array.from(descriptor);
        const faceId = uuidv4();

        // Enregistrer dans FaceBiometrics
        await pool.query(
            'INSERT INTO FaceBiometrics (id, patient_id, descriptor) VALUES (?, ?, ?)',
            [faceId, patientId, JSON.stringify(descriptorArray)]
        );

        // Mettre à jour l'authentification
        const [auth] = await pool.query('SELECT id FROM Authentification WHERE utilisateur_id = ?', [patientId]);
        
        if (auth.length > 0) {
            await pool.query(
                'UPDATE Authentification SET face_biometrics_id = ? WHERE utilisateur_id = ?',
                [faceId, patientId]
            );
        } else {
            const authId = uuidv4();
            await pool.query(
                'INSERT INTO Authentification (id, utilisateur_id, type_utilisateur, face_biometrics_id) VALUES (?, ?, ?, ?)',
                [authId, patientId, 'patient', faceId]
            );
        }

        res.status(201).json({ message: 'Visage enregistré avec succès' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

const verifyFace = async (req, res) => {
    const faceImage = req.file;

    if (!faceImage) {
        return res.status(400).json({ message: 'Aucune image faciale fournie' });
    }

    try {
        // Extraire le descripteur de l'image fournie
        const inputDescriptor = await faceRecognition.detectAndExtractFace(faceImage.buffer);
        const inputDescriptorArray = Array.from(inputDescriptor);

        // Trouver la correspondance dans la base de données
        const [matches] = await pool.query(`
            SELECT fb.id, fb.patient_id, p.nom, p.prenom 
            FROM FaceBiometrics fb
            JOIN Patient p ON fb.patient_id = p.id
            ORDER BY (
                SELECT SQRT(SUM(POW(JSON_EXTRACT(fb.descriptor, CONCAT('$[', idx, ']') - ?))) 
                FROM (
                    SELECT 0 AS idx UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4
                    UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9
                ) AS indices
            ) ASC
            LIMIT 1
        `, [...inputDescriptorArray]);

        if (matches.length === 0) {
            return res.status(404).json({ message: 'Aucune correspondance trouvée' });
        }

        const match = matches[0];
        const storedDescriptor = JSON.parse(match.descriptor);

        // Comparer les descripteurs
        const isMatch = await faceRecognition.compareFaces(inputDescriptor, new Float32Array(storedDescriptor));

        if (!isMatch) {
            return res.status(401).json({ message: 'Authentification faciale échouée' });
        }

        // Créer le token JWT
        const payload = {
            user: {
                id: match.id,
                username: `${match.prenom}.${match.nom}`,
                type_utilisateur: 'patient',
                utilisateur_id: match.patient_id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ 
                    token,
                    user: {
                        id: match.patient_id,
                        nom: match.nom,
                        prenom: match.prenom
                    }
                });
            }
        );
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

module.exports = { registerFace, verifyFace };
