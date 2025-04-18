def test_create_compte_rendu(client, session):
    # Création d'un patient et de son dossier
    patient_response = client.post('/api/patients', json={
        'nom': 'Record',
        'prenom': 'Test',
        'date_naissance': '1990-01-01'
    })
    dossier_id = patient_response.json['dossier_medical']['id']
    
    # Création d'un professionnel
    professional_response = client.post('/api/professionals', json={
        'nom': 'Dr. Compte',
        'specialite': 'Rendu'
    })
    professional_id = professional_response.json['id']
    
    # Création d'un compte rendu
    cr_data = {
        'contenu': 'Examen de routine',
        'auteur_id': professional_id,
        'traitements': [
            {
                'description': 'Traitement test',
                'medicament': 'Medicament A',
                'posologie': '1 comprimé par jour',
                'duree': '7 jours'
            }
        ]
    }
    response = client.post('/api/records/compte-rendu', json={
        **cr_data,
        'dossier_id': dossier_id
    })
    assert response.status_code == 201
    
    # Vérification du compte rendu créé
    response = client.get(f'/api/records/dossier/{dossier_id}')
    assert len(response.json['comptes_rendus']) == 1
    assert response.json['comptes_rendus'][0]['traitements'][0]['medicament'] == 'Medicament A'