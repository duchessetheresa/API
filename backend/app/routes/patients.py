from flask import Blueprint, request, jsonify
from app import db
from app.models import Patient, DossierMedical
from flask_jwt_extended import jwt_required
import uuid
from datetime import datetime

# Modification ici - utilisation de patients_bp au lieu de bp
patients_bp = Blueprint('patients', __name__)

@patients_bp.route('/', methods=['GET'])
@jwt_required()
def get_patients():
    patients = Patient.query.all()
    return jsonify([{
        'id': p.id,
        'nom': p.nom,
        'prenom': p.prenom,
        'date_naissance': p.date_naissance.isoformat() if p.date_naissance else None,
        'adresse': p.adresse
    } for p in patients]), 200

@patients_bp.route('/', methods=['POST'])
@jwt_required()
def create_patient():
    data = request.get_json()
    
    if not all(field in data for field in ['nom', 'prenom', 'date_naissance']):
        return jsonify({'error': 'Données manquantes'}), 400
    
    try:
        patient = Patient(
            id=str(uuid.uuid4()),
            nom=data['nom'],
            prenom=data['prenom'],
            date_naissance=datetime.strptime(data['date_naissance'], '%Y-%m-%d').date(),
            adresse=data.get('adresse'),
            donnees_biometriques=data.get('donnees_biometriques', '{}')
        )
        
        dossier = DossierMedical(
            id=str(uuid.uuid4()),
            patient_id=patient.id,
            historique_soins='',
            allergies=''
        )
        
        db.session.add(patient)
        db.session.add(dossier)
        db.session.commit()
        
        return jsonify({
            'message': 'Patient créé avec succès',
            'id': patient.id
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@patients_bp.route('/<string:patient_id>', methods=['GET'])
@jwt_required()
def get_patient(patient_id):
    patient = Patient.query.get_or_404(patient_id)
    dossier = DossierMedical.query.filter_by(patient_id=patient_id).first()
    
    return jsonify({
        'id': patient.id,
        'nom': patient.nom,
        'prenom': patient.prenom,
        'date_naissance': patient.date_naissance.isoformat() if patient.date_naissance else None,
        'adresse': patient.adresse,
        'dossier_medical': {
            'id': dossier.id if dossier else None,
            'allergies': dossier.allergies if dossier else None,
            'historique_soins': dossier.historique_soins if dossier else None
        }
    }), 200