import React, { useEffect, useState } from 'react';
import { Table, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const ProfessionalList = () => {
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        const response = await api.get('/professionals');
        setProfessionals(response.data);
      } catch (error) {
        console.error('Error fetching professionals:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfessionals();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div className="professional-list">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Liste des Professionnels de Santé</h2>
        <Button as={Link} to="/professionals/new" variant="primary">
          Ajouter un professionnel
        </Button>
      </div>
      
      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>Nom</th>
            <th>Spécialité</th>
            <th>Établissement</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {professionals.map(professional => (
            <tr key={professional.id}>
              <td>{professional.nom}</td>
              <td>{professional.specialite}</td>
              <td>{professional.etablissement?.nom || 'Non spécifié'}</td>
              <td>
                <Button 
                  as={Link} 
                  to={`/professionals/${professional.id}`} 
                  variant="info" 
                  size="sm"
                >
                  Voir
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ProfessionalList;