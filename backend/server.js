require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const upload = multer();

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuration de la base de données
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Middleware d'authentification
const authenticate = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'Accès non autorisé' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token invalide' });
  }
};

// Routes d'authentification
app.post('/api/auth/login', async (req, res) => {
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

    const token = jwt.sign(
      { id: user.id, type: user.type_utilisateur },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

// Routes Patients
app.get('/api/patients', authenticate, async (req, res) => {
  try {
    const [patients] = await pool.query('SELECT * FROM Patient');
    res.json(patients);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

app.post('/api/patients', authenticate, upload.single('faceImage'), async (req, res) => {
  const { nom, prenom, date_naissance, adresse } = req.body;
  const id = uuidv4();

  try {
    await pool.query(
      'INSERT INTO Patient (id, nom, prenom, date_naissance, adresse) VALUES (?, ?, ?, ?, ?)',
      [id, nom, prenom, date_naissance, adresse]
    );

    // Création du dossier médical
    const dossierId = uuidv4();
    await pool.query(
      'INSERT INTO DossierMedical (id, patient_id) VALUES (?, ?)',
      [dossierId, id]
    );

    // Gestion de l'image faciale si fournie
    if (req.file) {
      // Ici vous ajouteriez le traitement de l'image faciale
      // et l'enregistrement dans FaceBiometrics
    }

    res.status(201).json({ id });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

// Routes Dossiers Médicaux
app.get('/api/dossiers/:patientId', authenticate, async (req, res) => {
  try {
    const [dossier] = await pool.query(
      'SELECT * FROM DossierMedical WHERE patient_id = ?',
      [req.params.patientId]
    );
    
    if (dossier.length === 0) {
      return res.status(404).json({ message: 'Dossier non trouvé' });
    }

    // Récupérer les données associées
    const [comptesRendus] = await pool.query(
      'SELECT * FROM CompteRendu WHERE dossier_id = ?',
      [dossier[0].id]
    );

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
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

// Routes Comptes Rendus
app.post('/api/comptes-rendus', authenticate, async (req, res) => {
  const { dossier_id, contenu } = req.body;
  const id = uuidv4();
  const date = new Date().toISOString().slice(0, 10);

  try {
    await pool.query(
      'INSERT INTO CompteRendu (id, date, contenu, auteur_id, dossier_id) VALUES (?, ?, ?, ?, ?)',
      [id, date, contenu, req.user.id, dossier_id]
    );

    res.status(201).json({ id });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

// Routes Traitements
app.post('/api/traitements', authenticate, async (req, res) => {
  const { dossier_id, description, medicament, posologie, duree } = req.body;
  const id = uuidv4();

  try {
    await pool.query(
      'INSERT INTO Traitement (id, description, medicament, posologie, duree, dossier_id) VALUES (?, ?, ?, ?, ?, ?)',
      [id, description, medicament, posologie, duree, dossier_id]
    );

    res.status(201).json({ id });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

// Route de vérification de santé
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Erreur serveur');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
