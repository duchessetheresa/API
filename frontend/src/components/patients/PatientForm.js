import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Spinner, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const patientSchema = Yup.object().shape({
  nom: Yup.string().required('Le nom est requis'),
  prenom: Yup.string().required('Le prénom est requis'),
  date_naissance: Yup.date().required('La date de naissance est requise'),
  adresse: Yup.string(),
  donnees_biometriques: Yup.string()
});

const PatientForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEdit, setIsEdit] = useState(false);

  const formik = useFormik({
    initialValues: {
      nom: '',
      prenom: '',
      date_naissance: '',
      adresse: '',
      donnees_biometriques: '{}'
    },
    validationSchema: patientSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError('');
      
      try {
        if (isEdit) {
          await api.put(`/patients/${id}`, values);
        } else {
          await api.post('/patients', values);
        }
        navigate('/patients');
      } catch (err) {
        setError(err.response?.data?.message || 'Erreur lors de la sauvegarde');
      } finally {
        setLoading(false);
      }
    }
  });

  useEffect(() => {
    if (id) {
      setIsEdit(true);
      const fetchPatient = async () => {
        try {
          const response = await api.get(`/patients/${id}`);
          formik.setValues(response.data);
        } catch (err) {
          setError('Erreur lors du chargement du patient');
        }
      };
      fetchPatient();
    }
  }, [id]);

  return (
    <Card className="p-4">
      <h2 className="mb-4">{isEdit ? 'Modifier Patient' : 'Nouveau Patient'}</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Form onSubmit={formik.handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Nom *</Form.Label>
          <Form.Control
            type="text"
            name="nom"
            value={formik.values.nom}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={formik.touched.nom && formik.errors.nom}
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.nom}
          </Form.Control.Feedback>
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label>Prénom *</Form.Label>
          <Form.Control
            type="text"
            name="prenom"
            value={formik.values.prenom}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={formik.touched.prenom && formik.errors.prenom}
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.prenom}
          </Form.Control.Feedback>
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label>Date de Naissance *</Form.Label>
          <Form.Control
            type="date"
            name="date_naissance"
            value={formik.values.date_naissance}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={formik.touched.date_naissance && formik.errors.date_naissance}
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.date_naissance}
          </Form.Control.Feedback>
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label>Adresse</Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            name="adresse"
            value={formik.values.adresse}
            onChange={formik.handleChange}
          />
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label>Données Biométriques (JSON)</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="donnees_biometriques"
            value={formik.values.donnees_biometriques}
            onChange={formik.handleChange}
          />
        </Form.Group>
        
        <div className="d-flex justify-content-end gap-2">
          <Button 
            variant="secondary" 
            onClick={() => navigate('/patients')}
          >
            Annuler
          </Button>
          <Button 
            variant="primary" 
            type="submit" 
            disabled={loading || !formik.isValid}
          >
            {loading ? (
              <Spinner as="span" animation="border" size="sm" />
            ) : (
              isEdit ? 'Mettre à jour' : 'Créer'
            )}
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default PatientForm;