"""empty message

Revision ID: 3f4b56a60409
Revises: 
Create Date: 2025-04-18 16:44:03.431788

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = '3f4b56a60409'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('Authentification',
    sa.Column('id', sa.String(length=36), nullable=False),
    sa.Column('utilisateur_id', sa.String(length=36), nullable=True),
    sa.Column('type_utilisateur', sa.Enum('patient', 'professionnel'), nullable=True),
    sa.Column('biometrie', mysql.LONGTEXT(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('Etablissement',
    sa.Column('id', sa.String(length=36), nullable=False),
    sa.Column('nom', sa.String(length=100), nullable=True),
    sa.Column('adresse', sa.String(length=255), nullable=True),
    sa.Column('type', sa.String(length=50), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('GouvernanceDesDonnees',
    sa.Column('id', sa.String(length=36), nullable=False),
    sa.Column('regles_partage', mysql.LONGTEXT(), nullable=True),
    sa.Column('politique_acces', mysql.LONGTEXT(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('Patient',
    sa.Column('id', sa.String(length=36), nullable=False),
    sa.Column('nom', sa.String(length=100), nullable=True),
    sa.Column('prenom', sa.String(length=100), nullable=True),
    sa.Column('date_naissance', sa.Date(), nullable=True),
    sa.Column('adresse', sa.String(length=255), nullable=True),
    sa.Column('donnees_biometriques', mysql.LONGTEXT(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('DossierMedical',
    sa.Column('id', sa.String(length=36), nullable=False),
    sa.Column('patient_id', sa.String(length=36), nullable=True),
    sa.Column('historique_soins', mysql.LONGTEXT(), nullable=True),
    sa.Column('allergies', mysql.LONGTEXT(), nullable=True),
    sa.ForeignKeyConstraint(['patient_id'], ['Patient.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('ProfessionnelSante',
    sa.Column('id', sa.String(length=36), nullable=False),
    sa.Column('nom', sa.String(length=100), nullable=True),
    sa.Column('specialite', sa.String(length=100), nullable=True),
    sa.Column('etablissement_id', sa.String(length=36), nullable=True),
    sa.ForeignKeyConstraint(['etablissement_id'], ['Etablissement.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('APIInteroperable',
    sa.Column('id', sa.String(length=36), nullable=False),
    sa.Column('dossier_id', sa.String(length=36), nullable=True),
    sa.Column('cible_etablissement_id', sa.String(length=36), nullable=True),
    sa.Column('date_envoi', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['cible_etablissement_id'], ['Etablissement.id'], ),
    sa.ForeignKeyConstraint(['dossier_id'], ['DossierMedical.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('CompteRendu',
    sa.Column('id', sa.String(length=36), nullable=False),
    sa.Column('date', sa.DateTime(), nullable=True),
    sa.Column('contenu', mysql.LONGTEXT(), nullable=True),
    sa.Column('auteur_id', sa.String(length=36), nullable=True),
    sa.Column('dossier_id', sa.String(length=36), nullable=True),
    sa.ForeignKeyConstraint(['auteur_id'], ['ProfessionnelSante.id'], ),
    sa.ForeignKeyConstraint(['dossier_id'], ['DossierMedical.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('Traitement',
    sa.Column('id', sa.String(length=36), nullable=False),
    sa.Column('description', mysql.LONGTEXT(), nullable=True),
    sa.Column('medicament', sa.String(length=100), nullable=True),
    sa.Column('posologie', sa.String(length=100), nullable=True),
    sa.Column('duree', sa.String(length=100), nullable=True),
    sa.Column('compte_rendu_id', sa.String(length=36), nullable=True),
    sa.ForeignKeyConstraint(['compte_rendu_id'], ['CompteRendu.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('Traitement')
    op.drop_table('CompteRendu')
    op.drop_table('APIInteroperable')
    op.drop_table('ProfessionnelSante')
    op.drop_table('DossierMedical')
    op.drop_table('Patient')
    op.drop_table('GouvernanceDesDonnees')
    op.drop_table('Etablissement')
    op.drop_table('Authentification')
    # ### end Alembic commands ###
