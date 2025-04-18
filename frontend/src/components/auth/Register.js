import React, { useState } from 'react';
import { Form, Button, Alert, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import FaceCapture from './FaceCapture';
import api from '../../services/api';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    user_type: 'patient'
  });
  const [faceImage, setFaceImage] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFaceCapture = (blob) => {
    setFaceImage(blob);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('username', formData.username);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('user_type', formData.user_type);
      formDataToSend.append('face_image', faceImage, 'face.jpg');
      
      await api.post('/auth/register', formDataToSend);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <Card className="p-4 shadow" style={{ width: '400px' }}>
        <h2 className="text-center mb-4">Inscription</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Nom d'utilisateur</Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Mot de passe</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Type d'utilisateur</Form.Label>
            <Form.Select
              name="user_type"
              value={formData.user_type}
              onChange={handleChange}
            >
              <option value="patient">Patient</option>
              <option value="professionnel">Professionnel de santé</option>
            </Form.Select>
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Reconnaissance faciale</Form.Label>
            <FaceCapture onCapture={handleFaceCapture} />
          </Form.Group>
          
          <Button 
            variant="primary" 
            type="submit" 
            className="w-100"
            disabled={!faceImage || loading}
          >
            {loading ? 'Inscription en cours...' : "S'inscrire"}
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default Register;