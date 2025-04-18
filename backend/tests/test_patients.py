import pytest
from datetime import date

def test_create_patient(client, session):
    patient_data = {
        'nom': 'Doe',
        'prenom': 'John',
        'date_naissance': '1990-01-01',
        'adresse': '123 Test Street',
        'donnees_biometriques': '{}'
    }
    
    response = client.post('/api/patients', json=patient_data)
    assert response.status_code == 201
    assert 'id' in response.json
    
    # Vérification que le dossier médical a été créé
    patient_id = response.json['id']
    response = client.get(f'/api/patients/{patient_id}')
    assert response.status_code == 200
    assert response.json['dossier_medical'] is not None

def test_get_patients(client, session):
    # Création de plusieurs patients pour le test
    for i in range(3):
        client.post('/api/patients', json={
            'nom': f'Test{i}',
            'prenom': 'User',
            'date_naissance': '1990-01-01',
            'adresse': f'{i} Test Street'
        })
    
    response = client.get('/api/patients')
    assert response.status_code == 200
    assert len(response.json) == 3

def test_update_patient_dossier(client, session):
    # Création d'un patient
    response = client.post('/api/patients', json={
        'nom': 'Update',
        'prenom': 'Test',
        'date_naissance': '1990-01-01'
    })
    patient_id = response.json['id']
    
    # Récupération du dossier
    response = client.get(f'/api/patients/{patient_id}')
    dossier_id = response.json['dossier_medical']['id']
    
    # Mise à jour du dossier
    update_data = {
        'allergies': 'Penicillin',
        'historique_soins': 'Première consultation'
    }
    response = client.put(f'/api/records/dossier/{dossier_id}/update', json=update_data)
    assert response.status_code == 200
    
    # Vérification des modifications
    response = client.get(f'/api/patients/{patient_id}')
    assert response.json['dossier_medical']['allergies'] == 'Penicillin'
    assert response.json['dossier_medical']['historique_soins'] == 'Première consultation'