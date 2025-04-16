const pool = require('../config/db');

class FaceBiometrics {
    static async create({ patient_id, descriptor }) {
        const id = require('uuid').v4();
        await pool.query(
            'INSERT INTO FaceBiometrics (id, patient_id, descriptor) VALUES (?, ?, ?)',
            [id, patient_id, JSON.stringify(descriptor)]
        );
        return id;
    }

    static async findByPatientId(patient_id) {
        const [rows] = await pool.query(
            'SELECT * FROM FaceBiometrics WHERE patient_id = ?',
            [patient_id]
        );
        return rows[0];
    }
}

module.exports = FaceBiometrics;
