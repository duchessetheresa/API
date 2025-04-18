import React, { useState } from 'react';
import TreatmentForm from './TreatmentForm'; 
import { Form, Button, Card, Spinner, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const recordSchema = Yup.object().shape({
  contenu: Yup.string().required('Le contenu est requis'),
  auteur_id: Yup.string().required("L'ID de l'auteur est requis")
});

const RecordForm = () => {
  const { dossierId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const formik = useFormik({
    initialValues: {
      contenu: '',
      auteur_id: '',
      traitements: []
    },
    validationSchema: recordSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError('');
      
      try {
        await api.post('/records/compte-rendu', {
          ...values,
          dossier_id: dossierId
        });
        navigate(`/records/${dossierId}`);
      } catch (err) {
        setError(err.response?.data?.message || 'Erreur lors de la création');
      } finally {
        setLoading(false);
      }
    }
  });

  return (
    <Card className="p-4">
      <h2 className="mb-4">Nouveau Compte Rendu</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Form onSubmit={formik.handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Contenu *</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            name="contenu"
            value={formik.values.contenu}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={formik.touched.contenu && formik.errors.contenu}
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.contenu}
          </Form.Control.Feedback>
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label>ID du Professionnel *</Form.Label>
          <Form.Control
            type="text"
            name="auteur_id"
            value={formik.values.auteur_id}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={formik.touched.auteur_id && formik.errors.auteur_id}
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.auteur_id}
          </Form.Control.Feedback>
        </Form.Group>
        
        <h5 className="mt-4 mb-3">Traitements Prescrits</h5>
        
        <div className="mb-4">
          <TreatmentForm 
            onAddTreatment={(treatment) => {
              formik.setFieldValue('traitements', [...formik.values.traitements, treatment]);
            }}
          />
          
          {formik.values.traitements.length > 0 && (
            <div className="mt-3">
              <h6>Traitements ajoutés:</h6>
              <ul className="list-group">
                {formik.values.traitements.map((t, index) => (
                  <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{t.medicament}</strong> - {t.posologie} ({t.duree})
                      {t.description && <div><small>{t.description}</small></div>}
                    </div>
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => {
                        const newTreatments = [...formik.values.traitements];
                        newTreatments.splice(index, 1);
                        formik.setFieldValue('traitements', newTreatments);
                      }}
                    >
                      ×
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <div className="d-flex justify-content-end gap-2">
          <Button 
            variant="secondary" 
            onClick={() => navigate(`/records/${dossierId}`)}
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
              'Enregistrer'
            )}
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default RecordForm;