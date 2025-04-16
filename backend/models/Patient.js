const pool = require('../config/db');

class Patient {
    static async create({ nom, prenom, date_naissance, adresse, faceImage }) {
        const id = require('uuid').v4();
        await pool.query(
            'INSERT INTO Patient (id, nom, prenom, date_naissance, adresse) VALUES (?, ?, ?, ?, ?)',
            [id, nom, prenom, date_naissance, adresse]
        );

        // Créer le dossier médical
        const dossierId = require('uuid').v4();
        await pool.query(
            'INSERT INTO DossierMedical (id, patient_id) VALUES (?, ?)',
            [dossierId, id]
        );

        return { id };
    }

    static async findByFaceDescriptor(descriptor) {
        const [rows] = await pool.query(`
            SELECT p.* FROM Patient p
            JOIN FaceBiometrics fb ON p.id = fb.patient_id
            ORDER BY (
                SELECT SQRT(SUM(POW(JSON_EXTRACT(fb.descriptor, CONCAT('$[', idx, ']') - ?))) 
                FROM (
                    SELECT 0 AS idx UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4
                    UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9
                ) AS indices
            ) ASC
            LIMIT 1
        `, [descriptor]);

        return rows[0] || null;
    }

    static async getById(id) {
        const [rows] = await pool.query('SELECT * FROM Patient WHERE id = ?', [id]);
        return rows[0];
    }
}

module.exports = Patient;
