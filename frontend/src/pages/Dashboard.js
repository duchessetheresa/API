import React, { useEffect, useState } from 'react';
import { Card, Container, Row, Col, Spinner } from 'react-bootstrap';
import api from '../services/api';
import { isProfessional } from '../services/auth';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [patientsRes, professionalsRes, recordsRes] = await Promise.all([
          api.get('/patients'),
          api.get('/professionals'),
          api.get('/records')
        ]);
        
        setStats({
          patients: patientsRes.data.length,
          professionals: professionalsRes.data.length,
          records: recordsRes.data.length
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  if (loading) {
    return (
      <Container className="d-flex justify-content-center py-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h2 className="mb-4">Tableau de bord</h2>
      
      <Row className="mb-4">
        <Col md={4}>
          <Card className="text-white bg-primary mb-3">
            <Card.Body>
              <Card.Title>Patients</Card.Title>
              <Card.Text className="display-4">
                {stats?.patients || 0}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className="text-white bg-success mb-3">
            <Card.Body>
              <Card.Title>Professionnels</Card.Title>
              <Card.Text className="display-4">
                {stats?.professionals || 0}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        
        {isProfessional() && (
          <Col md={4}>
            <Card className="text-white bg-info mb-3">
              <Card.Body>
                <Card.Title>Dossiers</Card.Title>
                <Card.Text className="display-4">
                  {stats?.records || 0}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>

      <Card className="shadow">
        <Card.Body>
          <Card.Title>Activité récente</Card.Title>
          <Card.Text>
            Ici serait affichée l'activité récente du système (à implémenter)
          </Card.Text>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Dashboard;