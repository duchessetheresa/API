import React from 'react';
import { Card, Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../services/auth';

const Home = () => {
  const authenticated = isAuthenticated();

  return (
    <Container className="py-5">
      <div className="text-center mb-5">
        <h1 className="display-4">Bienvenue sur le Système Médical</h1>
        <p className="lead">Gestion complète des dossiers patients et professionnels de santé</p>
      </div>

      <div className="row">
        <div className="col-md-6 mb-4">
          <Card className="h-100 shadow">
            <Card.Body className="text-center">
              <Card.Title>Patients</Card.Title>
              <Card.Text>
                Gestion des dossiers patients, historique médical et prescriptions.
              </Card.Text>
              <Button as={Link} to="/patients" variant="primary">
                Accéder aux patients
              </Button>
            </Card.Body>
          </Card>
        </div>

        <div className="col-md-6 mb-4">
          <Card className="h-100 shadow">
            <Card.Body className="text-center">
              <Card.Title>Professionnels</Card.Title>
              <Card.Text>
                Liste des professionnels de santé et leurs spécialités.
              </Card.Text>
              <Button as={Link} to="/professionals" variant="primary">
                Voir les professionnels
              </Button>
            </Card.Body>
          </Card>
        </div>
      </div>

      {!authenticated && (
        <div className="text-center mt-5">
          <h4>Connectez-vous pour accéder à toutes les fonctionnalités</h4>
          <Button as={Link} to="/login" variant="success" className="me-2">
            Connexion
          </Button>
          <Button as={Link} to="/register" variant="outline-success">
            Consultation
          </Button>
        </div>
      )}
    </Container>
  );
};

export default Home;