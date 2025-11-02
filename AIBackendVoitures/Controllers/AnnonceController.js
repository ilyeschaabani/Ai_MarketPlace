const { pool } = require('../db');
const axios = require('axios');

const FRAUD_API_URL = 'http://localhost:5001/predict';

class AnnonceController {

  async detectFraud(annonceData) {
    try {
      const response = await axios.post(FRAUD_API_URL, {
        marque: annonceData.marque,
        annee: annonceData.annee,
        puissance: annonceData.puissance,
        carburant: annonceData.carburant,
        transmission: annonceData.transmission,
        odometer: annonceData.odometer,
        notRepairedDamage: annonceData.notRepairedDamage
      }, {
        timeout: 5000
      });
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la détection de fraude:', error.message);
      return null;
    }
  }

  async creerAnnonce(donnees) {
    let connection;
    try {
      if (!donnees.id_voiture) {
        return { success: false, message: 'Erreur : id_voiture est requis', status: 400 };
      }

      connection = await pool.getConnection();

      const [voiture] = await connection.query('SELECT * FROM voitures WHERE id = ?', [donnees.id_voiture]);
      if (voiture.length === 0) {
        connection.release();
        return { success: false, message: 'Erreur : voiture non trouvée', status: 404 };
      }

      const voitureData = voiture[0];
      
      const fraudDetectionData = {
        marque: donnees.marque || voitureData.marque,
        annee: donnees.annee || voitureData.annee,
        puissance: donnees.puissance || voitureData.puissance,
        carburant: donnees.carburant || voitureData.carburant,
        transmission: donnees.transmission || voitureData.transmission,
        odometer: donnees.odometer || 0,
        notRepairedDamage: donnees.notRepairedDamage || false
      };
      
      console.log('🔍 Détection de fraude en cours...');
      const fraudResult = await this.detectFraud(fraudDetectionData);
      
      let fraud_prediction = null;
      let fraud_probability = null;
      let fraud_level = null;
      
      if (fraudResult && fraudResult.success) {
        fraud_prediction = fraudResult.fraud_prediction;
        fraud_probability = fraudResult.fraud_probability;
        fraud_level = fraudResult.fraud_level;
        
        if (fraud_prediction === 1) {
          console.log(`⚠️ FRAUDE DÉTECTÉE - Annonce sera cachée (${fraud_level})`);
        } else {
          console.log(`✅ Aucune fraude - Annonce visible (${fraud_level})`);
        }
      }
      
      const [result] = await connection.query(
        `INSERT INTO annonces
          (id_voiture, annee, puissance, marque, carburant, transmission, odometer, notRepairedDamage, 
           fraud_prediction, fraud_probability, fraud_level)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          donnees.id_voiture,
          fraudDetectionData.annee,
          fraudDetectionData.puissance,
          fraudDetectionData.marque,
          fraudDetectionData.carburant,
          fraudDetectionData.transmission,
          fraudDetectionData.odometer,
          fraudDetectionData.notRepairedDamage,
          fraud_prediction,
          fraud_probability,
          fraud_level
        ]
      );

      const [nouvelleAnnonce] = await connection.query('SELECT * FROM annonces WHERE id = ?', [result.insertId]);
      connection.release();

      return { 
        success: true, 
        message: fraud_prediction === 1 
          ? '⚠️ Annonce créée mais masquée (fraude détectée)'
          : 'Annonce créée et publiée avec succès',
        data: nouvelleAnnonce[0],
        fraud_detection: fraudResult ? {
          is_fraud: fraudResult.is_fraud,
          probability: fraud_probability,
          level: fraud_level
        } : null,
        status: 201 
      };
    } catch (erreur) {
      if (connection) connection.release();
      return { success: false, message: 'Erreur lors de la création : ' + (erreur.message || erreur), status: 500 };
    }
  }

  /**
   * Obtenir toutes les annonces NON-FRAUDULEUSES (pour acheteurs)
   */
  async obtenirToutesLesAnnonces() {
    let connection;
    try {
      connection = await pool.getConnection();
      const [annonces] = await connection.query(`
        SELECT a.*, v.matricule, v.modele, v.prix 
        FROM annonces a 
        LEFT JOIN voitures v ON a.id_voiture = v.id 
        WHERE (a.fraud_prediction IS NULL OR a.fraud_prediction = 0)
        ORDER BY a.date_creation DESC
      `);
      connection.release();
      return { success: true, message: `${annonces.length} annonce(s) trouvée(s)`, data: annonces, status: 200 };
    } catch (erreur) {
      if (connection) connection.release();
      return { success: false, message: 'Erreur lors de la récupération : ' + (erreur.message || erreur), status: 500 };
    }
  }

  /**
   * Obtenir TOUTES les annonces incluant frauduleuses (admin)
   */
  async obtenirToutesLesAnnoncesAdmin() {
    let connection;
    try {
      connection = await pool.getConnection();
      const [annonces] = await connection.query(`
        SELECT a.*, v.matricule, v.modele, v.prix 
        FROM annonces a 
        LEFT JOIN voitures v ON a.id_voiture = v.id 
        ORDER BY a.date_creation DESC
      `);
      connection.release();
      return { success: true, message: `${annonces.length} annonce(s) trouvée(s)`, data: annonces, status: 200 };
    } catch (erreur) {
      if (connection) connection.release();
      return { success: false, message: 'Erreur lors de la récupération : ' + (erreur.message || erreur), status: 500 };
    }
  }

  /**
   * Obtenir les annonces FRAUDULEUSES (pour modération)
   */
  async obtenirAnnoncesFrauduleuses() {
    let connection;
    try {
      connection = await pool.getConnection();
      const [annonces] = await connection.query(`
        SELECT a.*, v.matricule, v.modele, v.prix 
        FROM annonces a 
        LEFT JOIN voitures v ON a.id_voiture = v.id 
        WHERE a.fraud_prediction = 1
        ORDER BY a.fraud_probability DESC, a.date_creation DESC
      `);
      connection.release();
      return { success: true, message: `${annonces.length} annonce(s) frauduleuse(s) trouvée(s)`, data: annonces, status: 200 };
    } catch (erreur) {
      if (connection) connection.release();
      return { success: false, message: 'Erreur lors de la récupération : ' + (erreur.message || erreur), status: 500 };
    }
  }

  async obtenirAnnonceParId(id) {
    let connection;
    try {
      connection = await pool.getConnection();
      const [annonces] = await connection.query(`
        SELECT a.*, v.matricule, v.modele, v.prix 
        FROM annonces a 
        LEFT JOIN voitures v ON a.id_voiture = v.id 
        WHERE a.id = ?
      `, [id]);
      connection.release();
      if (annonces.length === 0) return { success: false, message: `Aucune annonce trouvée avec l'id : ${id}`, status: 404 };
      return { success: true, message: 'Annonce trouvée', data: annonces[0], status: 200 };
    } catch (erreur) {
      if (connection) connection.release();
      return { success: false, message: 'Erreur lors de la recherche : ' + (erreur.message || erreur), status: 500 };
    }
  }

  async obtenirAnnoncesParVoiture(id_voiture) {
    let connection;
    try {
      connection = await pool.getConnection();
      const [annonces] = await connection.query(
        'SELECT * FROM annonces WHERE id_voiture = ? AND (fraud_prediction IS NULL OR fraud_prediction = 0)',
        [id_voiture]
      );
      connection.release();
      return { success: true, message: `${annonces.length} annonce(s) trouvée(s)`, data: annonces, status: 200 };
    } catch (erreur) {
      if (connection) connection.release();
      return { success: false, message: 'Erreur lors de la récupération : ' + (erreur.message || erreur), status: 500 };
    }
  }

  async rechercherAnnonces(criteres) {
    let connection;
    try {
      connection = await pool.getConnection();
      let query = 'SELECT a.*, v.matricule, v.modele, v.prix FROM annonces a LEFT JOIN voitures v ON a.id_voiture = v.id WHERE (a.fraud_prediction IS NULL OR a.fraud_prediction = 0)';
      const values = [];
      
      if (criteres.marque) { query += ' AND a.marque LIKE ?'; values.push(`%${criteres.marque}%`); }
      if (criteres.carburant) { query += ' AND a.carburant LIKE ?'; values.push(`%${criteres.carburant}%`); }
      if (criteres.odometerMin !== undefined) { query += ' AND a.odometer >= ?'; values.push(criteres.odometerMin); }
      if (criteres.odometerMax !== undefined) { query += ' AND a.odometer <= ?'; values.push(criteres.odometerMax); }
      if (criteres.notRepairedDamage !== undefined) { query += ' AND a.notRepairedDamage = ?'; values.push(criteres.notRepairedDamage); }
      
      query += ' ORDER BY a.date_creation DESC';
      const [annonces] = await connection.query(query, values);
      connection.release();
      return { success: true, message: `${annonces.length} annonce(s) trouvée(s)`, data: annonces, status: 200 };
    } catch (erreur) {
      if (connection) connection.release();
      return { success: false, message: 'Erreur lors de la recherche : ' + (erreur.message || erreur), status: 500 };
    }
  }

  // ... rest of methods (mettreAJourAnnonce, supprimerAnnonce) stay the same


  async mettreAJourAnnonce(id, donnees) {
    let connection;
    try {
      connection = await pool.getConnection();

      const [annonceExistante] = await connection.query('SELECT * FROM annonces WHERE id = ?', [id]);
      if (annonceExistante.length === 0) {
        connection.release();
        return { success: false, message: `Aucune annonce trouvée avec l'id : ${id}`, status: 404 };
      }

      const fieldsToUpdate = [];
      const values = [];
      const updatable = ['annee', 'puissance', 'marque', 'carburant', 'transmission', 'odometer', 'notRepairedDamage'];
      
      updatable.forEach((f) => {
        if (donnees[f] !== undefined) {
          fieldsToUpdate.push(`${f} = ?`);
          values.push(donnees[f]);
        }
      });

      if (fieldsToUpdate.length === 0) {
        connection.release();
        return { success: true, message: 'Aucun champ à mettre à jour', data: annonceExistante[0], status: 200 };
      }

      values.push(id);
      const updateQuery = `UPDATE annonces SET ${fieldsToUpdate.join(', ')} WHERE id = ?`;
      await connection.query(updateQuery, values);

      const [annonceMiseAJour] = await connection.query('SELECT * FROM annonces WHERE id = ?', [id]);
      connection.release();

      return { success: true, message: 'Annonce mise à jour avec succès', data: annonceMiseAJour[0], status: 200 };
    } catch (erreur) {
      if (connection) connection.release();
      return { success: false, message: 'Erreur lors de la mise à jour : ' + (erreur.message || erreur), status: 500 };
    }
  }

  async supprimerAnnonce(id) {
    let connection;
    try {
      connection = await pool.getConnection();
      const [annonceExistante] = await connection.query('SELECT * FROM annonces WHERE id = ?', [id]);
      if (annonceExistante.length === 0) {
        connection.release();
        return { success: false, message: `Aucune annonce trouvée avec l'id : ${id}`, status: 404 };
      }
      await connection.query('DELETE FROM annonces WHERE id = ?', [id]);
      connection.release();
      return { success: true, message: 'Annonce supprimée avec succès', data: annonceExistante[0], status: 200 };
    } catch (erreur) {
      if (connection) connection.release();
      return { success: false, message: 'Erreur lors de la suppression : ' + (erreur.message || erreur), status: 500 };
    }
  }

  async rechercherAnnonces(criteres) {
    let connection;
    try {
      connection = await pool.getConnection();
      let query = 'SELECT a.*, v.matricule, v.modele, v.prix FROM annonces a LEFT JOIN voitures v ON a.id_voiture = v.id WHERE 1=1';
      const values = [];
      
      if (criteres.marque) { query += ' AND a.marque LIKE ?'; values.push(`%${criteres.marque}%`); }
      if (criteres.carburant) { query += ' AND a.carburant LIKE ?'; values.push(`%${criteres.carburant}%`); }
      if (criteres.odometerMin !== undefined) { query += ' AND a.odometer >= ?'; values.push(criteres.odometerMin); }
      if (criteres.odometerMax !== undefined) { query += ' AND a.odometer <= ?'; values.push(criteres.odometerMax); }
      if (criteres.notRepairedDamage !== undefined) { query += ' AND a.notRepairedDamage = ?'; values.push(criteres.notRepairedDamage); }
      
      query += ' ORDER BY a.date_creation DESC';
      const [annonces] = await connection.query(query, values);
      connection.release();
      return { success: true, message: `${annonces.length} annonce(s) trouvée(s)`, data: annonces, status: 200 };
    } catch (erreur) {
      if (connection) connection.release();
      return { success: false, message: 'Erreur lors de la recherche : ' + (erreur.message || erreur), status: 500 };
    }
  }
}

module.exports = AnnonceController;