const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('./services/faceRecognitionService').initializeTF()
  .catch(err => console.error('Erreur initialisation TF:', err));

require('dotenv').config();

// Import des routes
const authRoutes = require('./routes/authRoutes');
const patientRoutes = require('./routes/patientRoutes');
const professionnelRoutes = require('./routes/professionnelRoutes');
const etablissementRoutes = require('./routes/etablissementRoutes');
const dossierMedicalRoutes = require('./routes/dossierMedicalRoutes');
const compteRenduRoutes = require('./routes/compteRenduRoutes');
const traitementRoutes = require('./routes/traitementRoutes');
const faceAuthRoutes = require('./routes/faceAuthRoutes');

const app = express();

// Configuration Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use('/models', express.static(path.join(__dirname, '../public/models')));

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/professionnels', professionnelRoutes);
app.use('/api/etablissements', etablissementRoutes);
app.use('/api/dossiers', dossierMedicalRoutes);
app.use('/api/comptes-rendus', compteRenduRoutes);
app.use('/api/traitements', traitementRoutes);
app.use('/api/face-auth', faceAuthRoutes);

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Erreur serveur',
    message: process.env.NODE_ENV === 'development' ? err.message : null
  });
});

// Route 404
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint non trouvé' });
});

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
  console.log(`Environnement: ${process.env.NODE_ENV || 'development'}`);
});

// Gestion propre des arrêts
process.on('SIGTERM', () => {
  console.log('Fermeture du serveur...');
  server.close(() => {
    console.log('Serveur arrêté');
    process.exit(0);
  });
});

module.exports = server;
