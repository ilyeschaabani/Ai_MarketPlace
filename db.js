const mysql = require('mysql2/promise');
require('dotenv').config();

// Configuration de la connexion MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'marketplace_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true
});

/**
 * Initialiser la base de données
 * Crée la table des voitures si elle n'existe pas
 */
async function initializeDatabase() {
  let connection;
  try {
    connection = await pool.getConnection();
    
    // Créer la table des voitures
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS voitures (
        id INT AUTO_INCREMENT PRIMARY KEY,
        matricule VARCHAR(20) UNIQUE NOT NULL,
        marque VARCHAR(100) NOT NULL,
        modele VARCHAR(100) NOT NULL,
        annee INT,
        puissance INT,
        cylindres INT,
        carburant VARCHAR(50),
        transmission VARCHAR(50),
        traction VARCHAR(50),
        prix DECIMAL(10, 2),
        -- Embedding and metadata for similarity search
        embedding JSON NULL,
        encoder_version VARCHAR(100) NULL,
        cleaned_fields JSON NULL,
        date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_matricule (matricule),
        INDEX idx_marque (marque),
        INDEX idx_prix (prix)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;
    
    await connection.query(createTableQuery);
    console.log('✓ Table voitures créée ou vérifiée avec succès');
    
    // Ensure new columns exist (safe for upgrades)
    try {
      await connection.query("ALTER TABLE voitures ADD COLUMN IF NOT EXISTS embedding JSON NULL");
      await connection.query("ALTER TABLE voitures ADD COLUMN IF NOT EXISTS encoder_version VARCHAR(100) NULL");
      await connection.query("ALTER TABLE voitures ADD COLUMN IF NOT EXISTS cleaned_fields JSON NULL");
      console.log('✓ Colonnes embedding/encoder_version/cleaned_fields vérifiées ou ajoutées');
    } catch (alterErr) {
      // Some MySQL versions might not support IF NOT EXISTS on ADD COLUMN — fallback to checking via information_schema
      console.warn('⚠️ ALTER TABLE avec IF NOT EXISTS a échoué, vérification manuelle des colonnes...');
      const colsQuery = `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'voitures'`;
      const [cols] = await connection.query(colsQuery, [process.env.DB_NAME || 'marketplace_db']);
      const existingCols = new Set(cols.map(c => c.COLUMN_NAME));
      if (!existingCols.has('embedding')) {
        await connection.query("ALTER TABLE voitures ADD COLUMN embedding JSON NULL");
      }
      if (!existingCols.has('encoder_version')) {
        await connection.query("ALTER TABLE voitures ADD COLUMN encoder_version VARCHAR(100) NULL");
      }
      if (!existingCols.has('cleaned_fields')) {
        await connection.query("ALTER TABLE voitures ADD COLUMN cleaned_fields JSON NULL");
      }
      console.log('✓ Colonnes embedding/encoder_version/cleaned_fields ajoutées via fallback');
    }
    
    connection.release();
    return true;
  } catch (error) {
    console.error('✗ Erreur lors de l\'initialisation de la base de données:', error.message);
    if (connection) connection.release();
    throw error;
  }
}

module.exports = {
  pool,
  initializeDatabase
};
