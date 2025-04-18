from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from config import Config

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Initialisation des extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    
    # Importation et enregistrement des blueprints
    from app.routes.auth import auth_bp
    from app.routes.patients import patients_bp
    from app.routes.professionals import professionals_bp
    from app.routes.records import records_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(patients_bp, url_prefix='/api/patients')
    app.register_blueprint(professionals_bp, url_prefix='/api/professionals')
    app.register_blueprint(records_bp, url_prefix='/api/records')
    
    # Route racine
    @app.route('/')
    def index():
        return jsonify({
            'message': 'API Médicale',
            'endpoints': {
                'auth': '/api/auth',
                'patients': '/api/patients',
                'professionals': '/api/professionals',
                'records': '/api/records'
            }
        })
    
    # Gestion des erreurs
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Endpoint non trouvé'}), 404
    
    return app

from app import models