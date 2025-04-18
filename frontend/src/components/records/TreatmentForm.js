import React, { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';

const TreatmentForm = ({ onAddTreatment }) => {
  const [treatment, setTreatment] = useState({
    description: '',
    medicament: '',
    posologie: '',
    duree: ''
  });

  const handleChange = (e) => {
    setTreatment({
      ...treatment,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (treatment.medicament && treatment.posologie) {
      onAddTreatment(treatment);
      setTreatment({
        description: '',
        medicament: '',
        posologie: '',
        duree: ''
      });
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row className="mb-3">
        <Col md={12}>
          <Form.Group>
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="description"
              value={treatment.description}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
      </Row>
      
      <Row className="mb-3">
        <Col md={4}>
          <Form.Group>
            <Form.Label>Médicament *</Form.Label>
            <Form.Control
              type="text"
              name="medicament"
              value={treatment.medicament}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>Posologie *</Form.Label>
            <Form.Control
              type="text"
              name="posologie"
              value={treatment.posologie}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>Durée</Form.Label>
            <Form.Control
              type="text"
              name="duree"
              value={treatment.duree}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
        <Col md={2} className="d-flex align-items-end">
          <Button 
            variant="outline-primary" 
            type="submit"
            className="w-100"
            disabled={!treatment.medicament || !treatment.posologie}
          >
            Ajouter
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default TreatmentForm;