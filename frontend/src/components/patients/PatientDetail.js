import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, ListGroup, Badge, Button, Spinner, Tab, Tabs, Alert } from 'react-bootstrap';
import api from '../../services/api';

const PatientDetail = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await api.get(`/patients/${id}`);
        setPatient(response.data);
      } catch (err) {
        setError('Erreur lors du chargement du patient');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPatient();
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

  if (!patient) {
    return <Alert variant="warning">Patient non trouvé</Alert>;
  }

  return (
    <div className="patient-detail">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Détails du Patient</h2>
        <div>
          <Button as={Link} to="/patients" variant="secondary" className="me-2">
            Retour
          </Button>
          <Button as={Link} to={`/patients/${id}/edit`} variant="primary">
            Modifier
          </Button>
        </div>
      </div>
      
      <Card>
        <Card.Body>
          <Tabs defaultActiveKey="info" className="mb-3">
            <Tab eventKey="info" title="Informations">
              <div className="row mt-3">
                <div className="col-md-6">
                  <h5>Identité</h5>
                  <ListGroup>
                    <ListGroup.Item>
                      <strong>Nom:</strong> {patient.nom}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Prénom:</strong> {patient.prenom}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Date de naissance:</strong> {patient.date_naissance}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Adresse:</strong> {patient.adresse || 'Non renseignée'}
                    </ListGroup.Item>
                  </ListGroup>
                </div>
                
                <div className="col-md-6">
                  <h5>Dossier Médical</h5>
                  {patient.dossier_medical ? (
                    <ListGroup>
                      <ListGroup.Item>
                        <strong>Allergies:</strong> {patient.dossier_medical.allergies || 'Aucune'}
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <strong>Historique:</strong> {patient.dossier_medical.historique_soins || 'Aucun historique'}
                      </ListGroup.Item>
                    </ListGroup>
                  ) : (
                    <Alert variant="warning">Aucun dossier médical trouvé</Alert>
                  )}
                </div>
              </div>
            </Tab>
            
            <Tab eventKey="records" title="Comptes Rendus">
              <div className="mt-3">
                {patient.dossier_medical && patient.dossier_medical.comptes_rendus ? (
                  <ListGroup>
                    {patient.dossier_medical.comptes_rendus.map(cr => (
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

export default PatientDetail;