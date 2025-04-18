import React from 'react';
import { Container, Navbar } from 'react-bootstrap';

const AppFooter = () => {
  return (
    <Navbar bg="dark" variant="dark" fixed="bottom" style={{ height: '40px' }}>
      <Container className="justify-content-center py-1">  {/* Réduction du padding */}
        <Navbar.Text className="small">  {/* Texte plus petit */}
          &copy; {new Date().getFullYear()} Système Médical - Tous droits réservés
        </Navbar.Text>
      </Container>
    </Navbar>
  );
};

export default AppFooter;