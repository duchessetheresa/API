from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from app import db
from app.models import Authentification
from app.services.face_recognition import FaceRecognitionService
import uuid
import os
from config import Config

auth_bp = Blueprint('auth', __name__)
face_service = FaceRecognitionService()

@auth_bp.route('', methods=['GET'])
def auth_info():
    return jsonify({
        'message': 'Endpoint d\'authentification',
        'available_routes': {
            'register': {'method': 'POST', 'path': '/api/auth/register'},
            'login': {'method': 'POST', 'path': '/api/auth/login'}
        }
    }), 200

@auth_bp.route('/register', methods=['POST'])
def register():
    if 'face_image' not in request.files:
        return jsonify({'error': 'Image faciale requise'}), 400
        
    face_image = request.files['face_image']
    username = request.form.get('username')
    password = request.form.get('password')
    user_type = request.form.get('user_type', 'patient')
    
    if not all([username, password]):
        return jsonify({'error': 'Nom d\'utilisateur et mot de passe requis'}), 400
    
    user_id = str(uuid.uuid4())
    
    if not face_service.register_face(user_id, face_image):
        return jsonify({'error': 'Échec de l\'enregistrement facial'}), 400
    
    auth = Authentification(
        id=str(uuid.uuid4()),
        utilisateur_id=user_id,
        type_utilisateur=user_type,
        biometrie=generate_password_hash(password)
    )
    
    db.session.add(auth)
    db.session.commit()
    
    return jsonify({
        'message': 'Utilisateur enregistré',
        'user_id': user_id
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    if 'face_image' not in request.files:
        return jsonify({'error': 'Image faciale requise'}), 400
        
    face_image = request.files['face_image']
    username = request.form.get('username')
    password = request.form.get('password')
    
    user_id = face_service.verify_face(face_image)
    if not user_id:
        return jsonify({'error': 'Authentification faciale échouée'}), 401
    
    auth = Authentification.query.filter_by(utilisateur_id=user_id).first()
    if not auth or not check_password_hash(auth.biometrie, password):
        return jsonify({'error': 'Identifiants invalides'}), 401
    
    access_token = create_access_token(identity={
        'user_id': user_id,
        'user_type': auth.type_utilisateur
    })
    
    return jsonify({
        'access_token': access_token,
        'user_id': user_id,
        'user_type': auth.type_utilisateur
    }), 200