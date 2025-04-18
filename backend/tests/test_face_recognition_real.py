import pytest
import io
import os
from unittest.mock import patch
from app.services.face_recognition import FaceRecognitionService

@pytest.mark.skipif(
    os.environ.get('SKIP_FACE_RECOGNITION_TESTS') == '1',
    reason="Besoin des dépendances de reconnaissance faciale"
)
class TestFaceRecognitionReal:
    @pytest.fixture(autouse=True)
    def setup(self, tmp_path):
        self.tmp_path = tmp_path
        self.face_service = FaceRecognitionService()
        
    def test_face_registration_real(self):
        # Création d'une image factice
        dummy_image = io.BytesIO()
        dummy_image.write(b'dummy image data')
        dummy_image.seek(0)
        
        user_id = 'test_user_real_123'
        result = self.face_service.register_face(user_id, dummy_image)
        assert result is True

    def test_face_verification_real(self):
        dummy_image = io.BytesIO()
        dummy_image.write(b'dummy image data')
        dummy_image.seek(0)
        
        user_id = 'test_user_real_123'
        self.face_service.register_face(user_id, dummy_image)
        
        dummy_image.seek(0)
        verified_id = self.face_service.verify_face(dummy_image)
        assert verified_id == user_id