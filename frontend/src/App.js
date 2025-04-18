import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Records from './pages/Records';
import Settings from './pages/Settings';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import PatientDetail from './components/patients/PatientDetail';
import PatientForm from './components/patients/PatientForm';
import MedicalRecord from './components/records/MedicalRecord';
import RecordForm from './components/records/RecordForm';
import PrivateRoute from './routes';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        
        <div className="d-flex flex-grow-1">
          <Sidebar />
          
          <Container fluid className="main-content py-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />
              
              <Route path="/patients" element={
                <PrivateRoute>
                  <Patients />
                </PrivateRoute>
              } />
              
              <Route path="/patients/new" element={
                <PrivateRoute>
                  <PatientForm />
                </PrivateRoute>
              } />
              
              <Route path="/patients/:id" element={
                <PrivateRoute>
                  <PatientDetail />
                </PrivateRoute>
              } />
              
              <Route path="/patients/:id/edit" element={
                <PrivateRoute>
                  <PatientForm />
                </PrivateRoute>
              } />
              
              <Route path="/records/:dossierId" element={
                <PrivateRoute>
                  <MedicalRecord />
                </PrivateRoute>
              } />
              
              <Route path="/records/:dossierId/new" element={
                <PrivateRoute>
                  <RecordForm />
                </PrivateRoute>
              } />
              
              <Route path="/records" element={
                <PrivateRoute>
                  <Records />
                </PrivateRoute>
              } />
              
              <Route path="/settings" element={
                <PrivateRoute>
                  <Settings />
                </PrivateRoute>
              } />
            </Routes>
          </Container>
        </div>
        
        <Footer />
      </div>
    </Router>
  );
};

export default App;