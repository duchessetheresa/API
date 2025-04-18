import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Button } from 'react-bootstrap';

const FaceCapture = ({ onCapture }) => {
  const webcamRef = useRef(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [imgSrc, setImgSrc] = useState(null);
  const [error, setError] = useState(null);

  const capture = useCallback(() => {
    try {
      const imageSrc = webcamRef.current?.getScreenshot();
      if (!imageSrc) {
        throw new Error('Could not capture image');
      }
      
      setImgSrc(imageSrc);
      
      // Convertir l'image en blob pour l'envoi au serveur
      fetch(imageSrc)
        .then(res => {
          if (!res.ok) throw new Error('Network response was not ok');
          return res.blob();
        })
        .then(blob => {
          onCapture(blob);
        })
        .catch(err => {
          console.error('Error converting image to blob:', err);
          setError('Failed to process image');
        });
    } catch (err) {
      console.error('Capture error:', err);
      setError('Failed to capture image');
    }
  }, [webcamRef, onCapture]);

  const startCamera = () => {
    setError(null);
    setIsCameraOn(true);
  };

  const stopCamera = () => {
    setIsCameraOn(false);
    setImgSrc(null);
  };

  return (
    <div className="face-capture">
      {isCameraOn ? (
        <>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="w-100 mb-2"
            videoConstraints={{
              facingMode: 'user',
              width: 640,
              height: 480
            }}
          />
          <div className="d-flex gap-2 mb-2">
            <Button variant="success" onClick={capture}>
              Capturer
            </Button>
            <Button variant="danger" onClick={stopCamera}>
              Arrêter
            </Button>
          </div>
        </>
      ) : (
        <Button variant="primary" onClick={startCamera}>
          Activer la caméra
        </Button>
      )}
      
      {imgSrc && (
        <div className="mt-2">
          <h6>Image capturée:</h6>
          <img 
            src={imgSrc} 
            alt="Captured face" 
            className="img-thumbnail"
            style={{ maxWidth: '100%' }}
          />
        </div>
      )}
      
      {error && (
        <div className="text-danger mt-2">{error}</div>
      )}
    </div>
  );
};

export default FaceCapture;