import React from 'react';
import { Container, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Records = () => {
  return (
    <Container className="py-4">
      <h2 className="mb-4">Dossiers Médicaux</h2>
      <Alert variant="info">
        Sélectionnez un patient pour accéder à son dossier médical. 
        Vous pouvez <Link to="/patients">parcourir la liste des patients</Link>.
      </Alert>
    </Container>
  );
};

export default Records;