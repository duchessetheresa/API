import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, ListGroup, Badge, Button, Spinner, Tab, Tabs, Alert } from 'react-bootstrap';
import api from '../../services/api';

const MedicalRecord = () => {
  const { dossierId } = useParams();
  const [dossier, setDossier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDossier = async () => {
      try {
        const response = await api.get(`/records/dossier/${dossierId}`);
        setDossier(response.data);
      } catch (err) {
        setError('Erreur lors du chargement du dossier');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDossier();
  }, [dossierId]);

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

  if (!dossier) {
    return <Alert variant="warning">Dossier médical non trouvé</Alert>;
  }

  return (
    <div className="medical-record">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Dossier Médical</h2>
        <div>
          <Button 
            as={Link} 
            to={`/records/${dossierId}/new`} 
            variant="primary"
            className="me-2"
          >
            Ajouter un compte rendu
          </Button>
          <Button 
            as={Link} 
            to={`/patients/${dossier.patient_id}`} 
            variant="secondary"
          >
            Retour au patient
          </Button>
        </div>
      </div>
      
      <Card>
        <Card.Body>
          <Tabs defaultActiveKey="info" className="mb-3">
            <Tab eventKey="info" title="Informations">
              <div className="row mt-3">
                <div className="col-md-6">
                  <h5>Allergies</h5>
                  <p>{dossier.allergies || 'Aucune allergie connue'}</p>
                </div>
                <div className="col-md-6">
                  <h5>Historique des Soins</h5>
                  <p>{dossier.historique_soins || 'Aucun historique'}</p>
                </div>
              </div>
            </Tab>
            
            <Tab eventKey="comptes-rendus" title="Comptes Rendus">
              <div className="mt-3">
                {dossier.comptes_rendus && dossier.comptes_rendus.length > 0 ? (
                  <ListGroup>
                    {dossier.comptes_rendus.map(cr => (
                      <ListGroup.Item key={cr.id}>
                        <div className="d-flex justify-content-between">
                          <div>
                            <h5>{new Date(cr.date).toLocaleDateString()}</h5>
                            <p>{cr.contenu}</p>
                            {cr.traitements && cr.traitements.length > 0 && (
                              <div>
                                <h6>Traitements:</h6>
                                <ul>
                                  {cr.traitements.map(t => (
                                    <li key={t.id}>
                                      {t.medicament} - {t.posologie} ({t.duree})
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                          <Badge bg="secondary">Auteur: {cr.auteur_id}</Badge>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                ) : (
                  <Alert variant="info">Aucun compte rendu disponible</Alert>
                )}
              </div>
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
    </div>
  );
};

export default MedicalRecord;