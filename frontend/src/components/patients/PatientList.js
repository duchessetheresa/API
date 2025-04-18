import React, { useEffect, useState } from 'react';
import { Table, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await api.get('/patients');
        setPatients(response.data);
      } catch (error) {
        console.error('Error fetching patients:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPatients();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div className="patient-list">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Liste des Patients</h2>
        <Button as={Link} to="/patients/new" variant="primary">
          Ajouter un patient
        </Button>
      </div>
      
      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Date de Naissance</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map(patient => (
            <tr key={patient.id}>
              <td>{patient.nom}</td>
              <td>{patient.prenom}</td>
              <td>{patient.date_naissance}</td>
              <td>
                <Button 
                  as={Link} 
                  to={`/patients/${patient.id}`} 
                  variant="info" 
                  size="sm"
                  className="me-2"
                >
                  Voir
                </Button>
                <Button 
                  as={Link} 
                  to={`/patients/${patient.id}/edit`} 
                  variant="warning" 
                  size="sm"
                >
                  Modifier
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default PatientList;