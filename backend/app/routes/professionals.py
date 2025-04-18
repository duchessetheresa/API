from flask import Blueprint, request, jsonify
from app import db
from app.models import ProfessionnelSante, Etablissement
from flask_jwt_extended import jwt_required
import uuid

# Modification ici - utilisation de professionals_bp au lieu de bp
professionals_bp = Blueprint('professionals', __name__)

@professionals_bp.route('/', methods=['GET'])
@jwt_required()
def get_professionals():
    professionals = ProfessionnelSante.query.all()
    return jsonify([{
        'id': p.id,
        'nom': p.nom,
        'specialite': p.specialite,
        'etablissement': {
            'id': p.etablissement.id if p.etablissement else None,
            'nom': p.etablissement.nom if p.etablissement else None
        } if p.etablissement else None
    } for p in professionals]), 200

@professionals_bp.route('/', methods=['POST'])
@jwt_required()
def create_professional():
    data = request.get_json()
    
    if not all(field in data for field in ['nom', 'specialite']):
        return jsonify({'error': 'Données manquantes'}), 400
    
    professional = ProfessionnelSante(
        id=str(uuid.uuid4()),
        nom=data['nom'],
        specialite=data['specialite'],
        etablissement_id=data.get('etablissement_id')
    )
    
    db.session.add(professional)
    db.session.commit()
    
    return jsonify({
        'message': 'Professionnel créé avec succès',
        'id': professional.id
    }), 201

@professionals_bp.route('/<string:professional_id>', methods=['GET'])
@jwt_required()
def get_professional(professional_id):
    professional = ProfessionnelSante.query.get_or_404(professional_id)
    
    return jsonify({
        'id': professional.id,
        'nom': professional.nom,
        'specialite': professional.specialite,
        'etablissement': {
            'id': professional.etablissement.id if professional.etablissement else None,
            'nom': professional.etablissement.nom if professional.etablissement else None
        } if professional.etablissement else None
    }), 200