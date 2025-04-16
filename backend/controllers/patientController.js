const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const faceRecognition = require('../services/faceRecognitionService');
const bcrypt = require('bcrypt');

const getAllPatients = async (req, res) => {
  try {
    const [patients] = await pool.query(`
      SELECT p.*, 
             (SELECT COUNT(*) FROM FaceBiometrics WHERE patient_id = p.id) AS has_face_data
      FROM Patient p
      ORDER BY p.nom, p.prenom
    `);
    res.json(patients);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

const getPatientById = async (req, res) => {
  try {
    const [patient] = await pool.query(`
      SELECT p.*, fb.id as face_biometrics_id
      FROM Patient p
      LEFT JOIN FaceBiometrics fb ON p.id = fb.patient_id
      WHERE p.id = ?
    `, [req.params.id]);
    
    if (patient.length === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    // Récupérer le dossier médical associé
    const [dossier] = await pool.query(
      'SELECT id FROM DossierMedical WHERE patient_id = ?',
      [req.params.id]
    );
    
    res.json({
      ...patient[0],
      dossier_id: dossier[0]?.id || null
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

const createPatient = async (req, res) => {
  const { nom, prenom, date_naissance, adresse } = req.body;
  const faceImage = req.file;
  const id = uuidv4();

  try {
    // Créer le patient
    await pool.query(
      'INSERT INTO Patient (id, nom, prenom, date_naissance, adresse) VALUES (?, ?, ?, ?, ?)',
      [id, nom, prenom, date_naissance, adresse]
    );

    // Créer automatiquement un dossier médical
    const dossierId = uuidv4();
    await pool.query(
      'INSERT INTO DossierMedical (id, patient_id) VALUES (?, ?)',
      [dossierId, id]
    );

    // Si image faciale fournie
    if (faceImage) {
      try {
        const descriptor = await faceRecognition.detectAndExtractFace(faceImage.buffer);
        const faceId = uuidv4();
        
        await pool.query(
          'INSERT INTO FaceBiometrics (id, patient_id, descriptor) VALUES (?, ?, ?)',
          [faceId, id, JSON.stringify(Array.from(descriptor))]
        );

        // Créer l'authentification biométrique
        const authId = uuidv4();
        await pool.query(
          'INSERT INTO Authentification (id, utilisateur_id, type_utilisateur, face_biometrics_id) VALUES (?, ?, ?, ?)',
          [authId, id, 'patient', faceId]
        );
      } catch (faceErr) {
        console.error('Erreur traitement visage:', faceErr.message);
        // Ne pas bloquer la création si échec de la reconnaissance faciale
      }
    }

    res.status(201).json({ 
      id,
      message: 'Patient créé avec succès' + (faceImage ? ' (avec reconnaissance faciale)' : '')
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

const updatePatient = async (req, res) => {
  const { nom, prenom, date_naissance, adresse } = req.body;
  
  try {
    await pool.query(
      'UPDATE Patient SET nom = ?, prenom = ?, date_naissance = ?, adresse = ? WHERE id = ?',
      [nom, prenom, date_naissance, adresse, req.params.id]
    );
    
    res.json({ message: 'Patient mis à jour avec succès' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

const deletePatient = async (req, res) => {
  try {
    // Suppression en cascade grâce aux FOREIGN KEY constraints
    await pool.query('DELETE FROM Patient WHERE id = ?', [req.params.id]);
    
    res.json({ message: 'Patient supprimé avec succès' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

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
    const faceId = uuidv4();

    // Enregistrer dans FaceBiometrics
    await pool.query(
      'INSERT INTO FaceBiometrics (id, patient_id, descriptor) VALUES (?, ?, ?)',
      [faceId, patientId, JSON.stringify(Array.from(descriptor))]
    );

    // Mettre à jour ou créer l'authentification
    const [auth] = await pool.query(
      'SELECT id FROM Authentification WHERE utilisateur_id = ?', 
      [patientId]
    );
    
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

module.exports = {
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
  registerFace
};
