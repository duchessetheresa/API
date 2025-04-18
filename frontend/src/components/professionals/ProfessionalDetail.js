import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, ListGroup, Button, Spinner, Alert } from 'react-bootstrap';
import api from '../../services/api';

const ProfessionalDetail = () => {
  const { id } = useParams();
  const [professional, setProfessional] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfessional = async () => {
      try {
        const response = await api.get(`/professionals/${id}`);
        setProfessional(response.data);
      } catch (err) {
        setError('Erreur lors du chargement du professionnel');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfessional();
  }, [id]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!professional) {
    return <Alert variant="warning">Professionnel non trouvé</Alert>;
  }

  return (
    <div className="professional-detail">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Détails du Professionnel</h2>
        <Button as={Link} to="/professionals" variant="secondary">
          Retour
        </Button>
      </div>
      
      <Card>
        <Card.Body>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <strong>Nom:</strong> {professional.nom}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Spécialité:</strong> {professional.specialite}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Établissement:</strong> {professional.etablissement?.nom || 'Non spécifié'}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Adresse de l'établissement:</strong> {professional.etablissement?.adresse || 'Non spécifiée'}
            </ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ProfessionalDetail;