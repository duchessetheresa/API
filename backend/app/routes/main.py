from flask import Blueprint, jsonify

bp = Blueprint('main', __name__)

@bp.route('/')
def index():
    return jsonify({
        'message': 'Bienvenue sur l\'API du Système Médical',
        'routes': {
            'auth': '/api/auth',
            'patients': '/api/patients',
            'professionals': '/api/professionals',
            'records': '/api/records'
        }
    })