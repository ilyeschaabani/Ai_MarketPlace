const { pool } = require('../db');

/**
 * Contrôleur pour la gestion des voitures
 * Gère les opérations CRUD et l'intégration du service d'embedding
 */
class VoitureController {
  async creerVoiture(donnees) {
    let connection;
    try {
      if (!donnees.matricule || !donnees.marque || !donnees.modele) {
        return { success: false, message: 'Erreur : matricule, marque et modele sont requis', status: 400 };
      }

      connection = await pool.getConnection();

      const [existing] = await connection.query('SELECT id FROM voitures WHERE matricule = ?', [donnees.matricule]);
      if (existing.length > 0) {
        connection.release();
        return { success: false, message: 'Erreur : une voiture avec ce matricule existe déjà', status: 409 };
      }

      // Try embedding
      let embedding = null;
      let encoder_version = null;
      let cleaned_fields = null;
      try {
        if (process.env.EMBEDDING_SERVICE_URL) {
          const base = process.env.EMBEDDING_SERVICE_URL.replace(/\/+$/, '');
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 10000);
          try {
            const resp = await fetch(`${base}/v1/embed`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ car: donnees }),
              signal: controller.signal
            });
            if (resp && resp.ok) {
              const b = await resp.json();
              embedding = b.embedding || null;
              encoder_version = b.encoder_version || null;
              cleaned_fields = b.cleaned || b.cleaned_fields || null;
            } else {
              console.warn('⚠️ Embedding service non disponible ou réponse non OK', resp && resp.status);
            }
          } finally {
            clearTimeout(timeout);
          }
        }
      } catch (err) {
        console.warn('⚠️ Erreur lors de l\'appel au service d\'embedding :', err && err.message ? err.message : err);
      }

      const [result] = await connection.query(
        `INSERT INTO voitures
          (matricule, marque, modele, annee, puissance, cylindres, carburant, transmission, traction, prix, embedding, encoder_version, cleaned_fields)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          donnees.matricule,
          donnees.marque,
          donnees.modele,
          donnees.annee || null,
          donnees.puissance || null,
          donnees.cylindres || null,
          donnees.carburant || null,
          donnees.transmission || null,
          donnees.traction || null,
          donnees.prix || null,
          embedding ? JSON.stringify(embedding) : null,
          encoder_version,
          cleaned_fields ? JSON.stringify(cleaned_fields) : null
        ]
      );

      const [nouvelleVoiture] = await connection.query('SELECT * FROM voitures WHERE id = ?', [result.insertId]);
      connection.release();

      return { success: true, message: 'Voiture créée avec succès', data: nouvelleVoiture[0], status: 201 };
    } catch (erreur) {
      if (connection) connection.release();
      return { success: false, message: 'Erreur lors de la création : ' + (erreur.message || erreur), status: 500 };
    }
  }

  async obtenirToutesLesVoitures() {
    let connection;
    try {
      connection = await pool.getConnection();
      const [voitures] = await connection.query('SELECT * FROM voitures ORDER BY date_creation DESC');
      connection.release();
      return { success: true, message: `${voitures.length} voiture(s) trouvée(s)`, data: voitures, status: 200 };
    } catch (erreur) {
      if (connection) connection.release();
      return { success: false, message: 'Erreur lors de la récupération : ' + (erreur.message || erreur), status: 500 };
    }
  }

  async obtenirVoitureParMatricule(matricule) {
    let connection;
    try {
      connection = await pool.getConnection();
      const [voitures] = await connection.query('SELECT * FROM voitures WHERE matricule = ?', [matricule]);
      connection.release();
      if (voitures.length === 0) return { success: false, message: `Aucune voiture trouvée avec le matricule : ${matricule}`, status: 404 };
      return { success: true, message: 'Voiture trouvée', data: voitures[0], status: 200 };
    } catch (erreur) {
      if (connection) connection.release();
      return { success: false, message: 'Erreur lors de la recherche : ' + (erreur.message || erreur), status: 500 };
    }
  }

  async mettreAJourVoiture(matricule, donnees) {
    let connection;
    try {
      connection = await pool.getConnection();

      const [voitureExistante] = await connection.query('SELECT * FROM voitures WHERE matricule = ?', [matricule]);
      if (voitureExistante.length === 0) {
        connection.release();
        return { success: false, message: `Aucune voiture trouvée avec le matricule : ${matricule}`, status: 404 };
      }

      const fieldsToUpdate = [];
      const values = [];
      const updatable = ['marque','modele','annee','puissance','cylindres','carburant','transmission','traction','prix'];
      updatable.forEach((f) => {
        if (donnees[f] !== undefined) {
          fieldsToUpdate.push(`${f} = ?`);
          values.push(donnees[f]);
        }
      });

      if (fieldsToUpdate.length === 0) {
        connection.release();
        return { success: true, message: 'Aucun champ à mettre à jour', data: voitureExistante[0], status: 200 };
      }

      values.push(matricule);
      const updateQuery = `UPDATE voitures SET ${fieldsToUpdate.join(', ')} WHERE matricule = ?`;
      await connection.query(updateQuery, values);

      const [voitureMiseAJour] = await connection.query('SELECT * FROM voitures WHERE matricule = ?', [matricule]);

      // Régénérer l'embedding
      try {
        if (process.env.EMBEDDING_SERVICE_URL) {
          const base = process.env.EMBEDDING_SERVICE_URL.replace(/\/+$/, '');
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 10000);
          try {
            const resp = await fetch(`${base}/v1/embed`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ car: voitureMiseAJour[0] }),
              signal: controller.signal
            });
            if (resp && resp.ok) {
              const b = await resp.json();
              const embedding = b.embedding || null;
              const encoder_version = b.encoder_version || null;
              const cleaned_fields = b.cleaned || b.cleaned_fields || null;
              await connection.query(`UPDATE voitures SET embedding = ?, encoder_version = ?, cleaned_fields = ? WHERE matricule = ?`, [
                embedding ? JSON.stringify(embedding) : null,
                encoder_version,
                cleaned_fields ? JSON.stringify(cleaned_fields) : null,
                matricule
              ]);
              const [refreshed] = await connection.query('SELECT * FROM voitures WHERE matricule = ?', [matricule]);
              connection.release();
              return { success: true, message: 'Voiture mise à jour avec succès', data: refreshed[0], status: 200 };
            }
          } finally {
            clearTimeout(timeout);
          }
        }
      } catch (embedErr) {
        console.warn('⚠️ Erreur pendant la régénération de l\'embedding :', embedErr && embedErr.message ? embedErr.message : embedErr);
      }

      connection.release();
      return { success: true, message: 'Voiture mise à jour avec succès', data: voitureMiseAJour[0], status: 200 };
    } catch (erreur) {
      if (connection) connection.release();
      return { success: false, message: 'Erreur lors de la mise à jour : ' + (erreur.message || erreur), status: 500 };
    }
  }

  async supprimerVoiture(matricule) {
    let connection;
    try {
      connection = await pool.getConnection();
      const [voitureExistante] = await connection.query('SELECT * FROM voitures WHERE matricule = ?', [matricule]);
      if (voitureExistante.length === 0) {
        connection.release();
        return { success: false, message: `Aucune voiture trouvée avec le matricule : ${matricule}`, status: 404 };
      }
      await connection.query('DELETE FROM voitures WHERE matricule = ?', [matricule]);
      connection.release();
      return { success: true, message: 'Voiture supprimée avec succès', data: voitureExistante[0], status: 200 };
    } catch (erreur) {
      if (connection) connection.release();
      return { success: false, message: 'Erreur lors de la suppression : ' + (erreur.message || erreur), status: 500 };
    }
  }

  async compterVoitures() {
    let connection;
    try {
      connection = await pool.getConnection();
      const [result] = await connection.query('SELECT COUNT(*) as total FROM voitures');
      connection.release();
      return { success: true, message: 'Nombre de voitures', data: { total: result[0].total }, status: 200 };
    } catch (erreur) {
      if (connection) connection.release();
      return { success: false, message: 'Erreur lors du comptage : ' + (erreur.message || erreur), status: 500 };
    }
  }

  async rechercherVoitures(criteres) {
    let connection;
    try {
      connection = await pool.getConnection();
      let query = 'SELECT * FROM voitures WHERE 1=1';
      const values = [];
      if (criteres.marque) { query += ' AND marque LIKE ?'; values.push(`%${criteres.marque}%`); }
      if (criteres.modele) { query += ' AND modele LIKE ?'; values.push(`%${criteres.modele}%`); }
      if (criteres.prixMin !== undefined) { query += ' AND prix >= ?'; values.push(criteres.prixMin); }
      if (criteres.prixMax !== undefined) { query += ' AND prix <= ?'; values.push(criteres.prixMax); }
      if (criteres.annee) { query += ' AND annee = ?'; values.push(criteres.annee); }
      query += ' ORDER BY date_creation DESC';
      const [voitures] = await connection.query(query, values);
      connection.release();
      return { success: true, message: `${voitures.length} voiture(s) trouvée(s)`, data: voitures, status: 200 };
    } catch (erreur) {
      if (connection) connection.release();
      return { success: false, message: 'Erreur lors de la recherche : ' + (erreur.message || erreur), status: 500 };
    }
  }
}

module.exports = VoitureController;
