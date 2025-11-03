/**
 * Contrôleur pour la gestion des rendez-vous
 */
const db = require('../db');

class Appointment {
  constructor(vehicle_id, buyer_name, buyer_phone, appointment_date, status, notes, seller_name, seller_phone, seller_email) {
    this.vehicle_id = vehicle_id;
    this.buyer_name = buyer_name;
    this.buyer_phone = buyer_phone;
    this.appointment_date = appointment_date;
    this.status = status;
    this.notes = notes;
    this.seller_name = seller_name;
    this.seller_phone = seller_phone;
    this.seller_email = seller_email;
  }

  toJSON() {
    return {
      vehicle_id: this.vehicle_id,
      buyer_name: this.buyer_name,
      buyer_phone: this.buyer_phone,
      appointment_date: this.appointment_date,
      status: this.status,
      notes: this.notes,
      seller_name: this.seller_name,
      seller_phone: this.seller_phone,
      seller_email: this.seller_email
    };
  }
}

class AppointmentController {
  /**
   * Créer un rendez-vous
   */
  async createAppointment(req, res) {
    try {
      const { vehicle_id, buyer_name, buyer_phone, appointment_date, status, notes, seller_name, seller_phone, seller_email } = req.body;

      if (!vehicle_id || !buyer_name || !buyer_phone || !appointment_date) {
        return res.status(400).json({
          success: false,
          message: 'vehicle_id, buyer_name, buyer_phone et appointment_date requis'
        });
      }

      const query = `
        INSERT INTO appointments 
        (vehicle_id, buyer_name, buyer_phone, appointment_date, status, notes, seller_name, seller_phone, seller_email)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const [result] = await db.pool.execute(query, [
        vehicle_id, buyer_name, buyer_phone, appointment_date, 
        status || 'scheduled', notes || null,
        seller_name || null, seller_phone || null, seller_email || null
      ]);

      const appointment = new Appointment(
        vehicle_id, buyer_name, buyer_phone, appointment_date, 
        status || 'scheduled', notes || null,
        seller_name || null, seller_phone || null, seller_email || null
      );

      res.status(201).json({
        success: true,
        message: '✅ Rendez-vous créé',
        data: appointment
      });

    } catch (error) {
      console.error('❌ Erreur création:', error.message);
      res.status(500).json({
        success: false,
        message: `Erreur: ${error.message}`
      });
    }
  }

  /**
   * Récupérer tous les rendez-vous
   */
  async getAllAppointments(req, res) {
    try {
      const { status, vehicle_id } = req.query;
      
      let query = 'SELECT * FROM appointments WHERE 1=1';
      const params = [];

      if (status) {
        query += ' AND status = ?';
        params.push(status);
      }

      if (vehicle_id) {
        query += ' AND vehicle_id = ?';
        params.push(vehicle_id);
      }

      query += ' ORDER BY appointment_date DESC';

      const [rows] = await db.pool.execute(query, params);

      const appointments = rows.map(row => new Appointment(
        row.vehicle_id, row.buyer_name, row.buyer_phone, 
        row.appointment_date, row.status, row.notes,
        row.seller_name, row.seller_phone, row.seller_email
      ));

      res.json({ 
        success: true, 
        data: appointments,
        count: appointments.length
      });

    } catch (error) {
      console.error('❌ Erreur récupération:', error.message);
      res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  }

  /**
   * Récupérer un rendez-vous par ID
   */
  async getAppointmentById(req, res) {
    try {
      const { id } = req.params;

      const [rows] = await db.pool.execute('SELECT * FROM appointments WHERE id = ?', [id]);
      
      if (!rows[0]) {
        return res.status(404).json({ 
          success: false, 
          message: 'Rendez-vous non trouvé' 
        });
      }

      const data = rows[0];
      const appointment = new Appointment(
        data.vehicle_id, data.buyer_name, data.buyer_phone, 
        data.appointment_date, data.status, data.notes,
        data.seller_name, data.seller_phone, data.seller_email
      );

      res.json({ 
        success: true, 
        data: appointment 
      });

    } catch (error) {
      console.error('❌ Erreur recherche:', error.message);
      res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  }

  /**
   * Modifier un rendez-vous
   */
  async updateAppointment(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const allowedFields = [
        'vehicle_id', 'buyer_name', 'buyer_phone', 'appointment_date', 'status', 'notes',
        'seller_name', 'seller_phone', 'seller_email'
      ];

      const fields = [];
      const values = [];

      Object.keys(updateData).forEach(key => {
        if (allowedFields.includes(key)) {
          fields.push(`${key} = ?`);
          values.push(updateData[key]);
        }
      });

      if (fields.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Aucun champ valide à mettre à jour'
        });
      }

      values.push(id);
      const query = `UPDATE appointments SET ${fields.join(', ')} WHERE id = ?`;

      const [result] = await db.pool.execute(query, values);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Rendez-vous non trouvé'
        });
      }

      // Récupérer le rendez-vous mis à jour
      const [rows] = await db.pool.execute('SELECT * FROM appointments WHERE id = ?', [id]);
      const data = rows[0];
      const appointment = new Appointment(
        data.vehicle_id, data.buyer_name, data.buyer_phone, 
        data.appointment_date, data.status, data.notes,
        data.seller_name, data.seller_phone, data.seller_email
      );

      res.json({ 
        success: true, 
        message: '✅ Rendez-vous mis à jour',
        data: appointment 
      });

    } catch (error) {
      console.error('❌ Erreur mise à jour:', error.message);
      res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  }

  /**
   * Supprimer un rendez-vous
   */
  async deleteAppointment(req, res) {
    try {
      const { id } = req.params;

      const [result] = await db.pool.execute('DELETE FROM appointments WHERE id = ?', [id]);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Rendez-vous non trouvé'
        });
      }

      res.json({ 
        success: true, 
        message: '✅ Rendez-vous supprimé' 
      });

    } catch (error) {
      console.error('❌ Erreur suppression:', error.message);
      res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  }
}

module.exports = AppointmentController;