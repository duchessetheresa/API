import * as faceapi from 'face-api.js';

export const loadModels = async () => {
  await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
  await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
  await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
};

export const detectFace = async (imageElement) => {
  const detections = await faceapi.detectAllFaces(
    imageElement, 
    new faceapi.TinyFaceDetectorOptions()
  ).withFaceLandmarks().withFaceDescriptors();
  
  return detections;
};

export const compareFaces = (descriptor1, descriptor2, threshold = 0.6) => {
  return faceapi.euclideanDistance(descriptor1, descriptor2) < threshold;
};