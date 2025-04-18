import os
from dotenv import load_dotenv

basedir = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(basedir, '.env'))

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'une-cle-secrete-tres-secure'
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://duchesse:passer@localhost/systemdb'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    FACE_DATA_PATH = os.path.join(basedir, 'app/static/faces')
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'super-secret-jwt-key'
    JWT_ACCESS_TOKEN_EXPIRES = 3600  # 1 heure