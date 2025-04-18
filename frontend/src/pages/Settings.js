import React from 'react';
import { Card, Form, Button, Container } from 'react-bootstrap';

const Settings = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Logique de sauvegarde des paramètres
  };

  return (
    <Container className="py-4">
      <h2 className="mb-4">Paramètres</h2>
      
      <Card className="shadow">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Notifications</Form.Label>
              <Form.Check 
                type="switch"
                id="notifications-switch"
                label="Activer les notifications"
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Thème</Form.Label>
              <Form.Select>
                <option>Clair</option>
                <option>Sombre</option>
                <option>Automatique</option>
              </Form.Select>
            </Form.Group>
            
            <Button variant="primary" type="submit">
              Enregistrer les paramètres
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Settings;