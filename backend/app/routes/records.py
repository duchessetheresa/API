from flask import Blueprint, request, jsonify
from datetime import datetime
from app import db
from app.models import DossierMedical, CompteRendu, Traitement
from flask_jwt_extended import jwt_required
import uuid

# Modification ici - utilisation de records_bp au lieu de bp
records_bp = Blueprint('records', __name__)

@records_bp.route('/dossier/<string:dossier_id>', methods=['GET'])
@jwt_required()
def get_dossier(dossier_id):
    dossier = DossierMedical.query.get_or_404(dossier_id)
    comptes_rendus = CompteRendu.query.filter_by(dossier_id=dossier_id).all()
    
    return jsonify({
        'id': dossier.id,
        'patient_id': dossier.patient_id,
        'allergies': dossier.allergies,
        'historique_soins': dossier.historique_soins,
        'comptes_rendus': [{
            'id': cr.id,
            'date': cr.date.isoformat(),
            'contenu': cr.contenu,
            'auteur_id': cr.auteur_id,
            'traitements': [{
                'id': t.id,
                'description': t.description,
                'medicament': t.medicament,
                'posologie': t.posologie,
                'duree': t.duree
            } for t in cr.traitements]
        } for cr in comptes_rendus]
    }), 200

@records_bp.route('/compte-rendu', methods=['POST'])
@jwt_required()
def create_compte_rendu():
    data = request.get_json()
    
    required_fields = ['contenu', 'auteur_id', 'dossier_id']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Données manquantes'}), 400
    
    try:
        compte_rendu = CompteRendu(
            id=str(uuid.uuid4()),
            date=datetime.utcnow(),
            contenu=data['contenu'],
            auteur_id=data['auteur_id'],
            dossier_id=data['dossier_id']
        )
        
        db.session.add(compte_rendu)
        
        # Ajout des traitements associés
        for traitement_data in data.get('traitements', []):
            traitement = Traitement(
                id=str(uuid.uuid4()),
                description=traitement_data.get('description'),
                medicament=traitement_data.get('medicament'),
                posologie=traitement_data.get('posologie'),
                duree=traitement_data.get('duree'),
                compte_rendu_id=compte_rendu.id
            )
            db.session.add(traitement)
        
        db.session.commit()
        
        return jsonify({
            'message': 'Compte rendu créé avec succès',
            'id': compte_rendu.id
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@records_bp.route('/dossier/<string:dossier_id>/update', methods=['PUT'])
@jwt_required()
def update_dossier(dossier_id):
    dossier = DossierMedical.query.get_or_404(dossier_id)
    data = request.get_json()
    
    if 'allergies' in data:
        dossier.allergies = data['allergies']
    if 'historique_soins' in data:
        dossier.historique_soins = data['historique_soins']
    
    db.session.commit()
    
    return jsonify({'message': 'Dossier médical mis à jour'}), 200