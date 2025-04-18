import pytest
from app import create_app, db as _db
from config import Config

class TestConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://duchesse:passer@localhost/systemdb_test'
    WTF_CSRF_ENABLED = False
    # Désactive la reconnaissance faciale pour les tests
    SKIP_FACE_RECOGNITION = True

@pytest.fixture(scope='session')
def app():
    app = create_app(TestConfig)
    with app.app_context():
        yield app

@pytest.fixture(scope='session')
def db(app):
    _db.create_all()
    yield _db
    _db.drop_all()

@pytest.fixture(scope='function')
def client(app):
    return app.test_client()

@pytest.fixture(scope='function')
def session(db):
    connection = db.engine.connect()
    transaction = connection.begin()

    options = dict(bind=connection, binds={})
    session = db.create_scoped_session(options=options)

    db.session = session

    yield session

    transaction.rollback()
    connection.close()
    session.remove()