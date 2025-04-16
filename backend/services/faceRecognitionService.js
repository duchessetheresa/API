const tf = require('@tensorflow/tfjs');
const faceapi = require('face-api.js');
const canvas = require('canvas');
const path = require('path');
const { Canvas, Image, ImageData } = canvas;

// Configuration initiale
let modelsLoaded = false;
let tfInitialized = false;

// Initialisation asynchrone de TensorFlow
async function initializeTF() {
  if (!tfInitialized) {
    // D'abord importer le backend CPU
    require('@tensorflow/tfjs-backend-cpu');
    
    // Ensuite seulement configurer le backend
    await tf.setBackend('cpu');
    await tf.ready();
    tfInitialized = true;
    console.log('TensorFlow initialisé avec backend CPU');
  }
}

// Configure face-api.js to use canvas
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

async function loadModels() {
  if (modelsLoaded) return;
  
  await initializeTF(); // Attendre l'initialisation de TF
  
  console.log('Chargement des modèles de reconnaissance faciale...');
  const modelsPath = path.join(__dirname, '../../models');
  
  try {
    await Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromDisk(modelsPath),
      faceapi.nets.faceLandmark68Net.loadFromDisk(modelsPath),
      faceapi.nets.faceRecognitionNet.loadFromDisk(modelsPath)
    ]);
    
    modelsLoaded = true;
    console.log('Modèles chargés avec succès');
  } catch (err) {
    console.error('Erreur de chargement des modèles:', err);
    throw new Error('Échec du chargement des modèles');
  }
}

async function detectAndExtractFace(imageBuffer) {
  try {
    await loadModels();
    
    const img = await canvas.loadImage(imageBuffer);
    const detectionOptions = new faceapi.SsdMobilenetv1Options({
      minConfidence: 0.5
    });

    const detections = await faceapi.detectSingleFace(img, detectionOptions)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detections) {
      throw new Error('Aucun visage détecté - assurez-vous que le visage est bien visible');
    }
    
    return detections.descriptor;
  } catch (err) {
    console.error('Erreur de détection faciale:', err);
    throw new Error(`Échec de la détection faciale: ${err.message}`);
  }
}

async function compareFaces(descriptor1, descriptor2, threshold = 0.6) {
  try {
    await loadModels();
    const distance = faceapi.euclideanDistance(descriptor1, descriptor2);
    console.log(`Distance de comparaison faciale: ${distance}`);
    return distance < threshold;
  } catch (err) {
    console.error('Erreur de comparaison faciale:', err);
    throw new Error(`Échec de la comparaison faciale: ${err.message}`);
  }
}

module.exports = {
  initializeTF,
  loadModels,
  detectAndExtractFace,
  compareFaces,
  getModelsStatus: () => modelsLoaded,
  getTFStatus: () => tfInitialized
};
