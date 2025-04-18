def test_create_professional(client, session):
    # Création d'un établissement
    etablissement_data = {
        'nom': 'Hôpital Test',
        'adresse': '456 Medical Street',
        'type': 'Hospital'
    }
    response = client.post('/api/etablissements', json=etablissement_data)
    etablissement_id = response.json['id']
    
    # Création d'un professionnel
    professional_data = {
        'nom': 'Dr. Smith',
        'specialite': 'Cardiologie',
        'etablissement_id': etablissement_id
    }
    response = client.post('/api/professionals', json=professional_data)
    assert response.status_code == 201
    assert response.json['id'] is not None
    
    # Vérification de l'association
    response = client.get(f'/api/professionals/{response.json["id"]}')
    assert response.json['etablissement']['id'] == etablissement_id

def test_get_professionals(client, session):
    # Création de plusieurs professionnels
    for i in range(2):
        client.post('/api/professionals', json={
            'nom': f'Dr. Test{i}',
            'specialite': f'Specialite {i}'
        })
    
    response = client.get('/api/professionals')
    assert response.status_code == 200
    assert len(response.json) == 2