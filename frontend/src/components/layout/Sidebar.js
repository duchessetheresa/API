import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { isAuthenticated, isProfessional } from '../../services/auth';

const AppSidebar = () => {
  const authenticated = isAuthenticated();
  const professional = isProfessional();

  if (!authenticated) return null;

  return (
    <div className="sidebar bg-light" style={{ width: '250px', minHeight: '100vh' }}>
      <Nav className="flex-column p-3">
        <Nav.Item className="mb-3">
          <h5>Navigation</h5>
        </Nav.Item>
        
        <Nav.Link as={Link} to="/dashboard" className="mb-2">
          Tableau de bord
        </Nav.Link>
        
        <Nav.Link as={Link} to="/patients" className="mb-2">
          Patients
        </Nav.Link>
        
        <Nav.Link as={Link} to="/professionals" className="mb-2">
          Professionnels
        </Nav.Link>
        
        {professional && (
          <Nav.Link as={Link} to="/records" className="mb-2">
            Dossiers Médicaux
          </Nav.Link>
        )}
        
        <hr className="my-2" />
        
        <Nav.Link as={Link} to="/settings" className="mb-2">
          Paramètres
        </Nav.Link>
      </Nav>
    </div>
  );
};

export default AppSidebar;