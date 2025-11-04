/**
 * @file db.js
 * @description Configuration et initialisation de la base de données MySQL
 * @version 2.1.1
 * @created 2024-11-03
 * @updated 2024-11-03 - Correction syntaxe MariaDB
 * @context Application de vente de voitures d'occasion (Acheteur/Vendeur)
 */

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
 * Crée la base de données et la table des voitures si elles n'existent pas
 */
async function initializeDatabase() {
  let connection;
  try {
    console.log('🔄 Initialisation de la base de données...');
    // First, connect without selecting a database to create it if needed
    const tempPool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      waitForConnections: true,
      connectionLimit: 10
    });
    
    const tempConnection = await tempPool.getConnection();
    
    // Create database if it doesn't exist
    const dbName = process.env.DB_NAME || 'marketplace_db';
    await tempConnection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    console.log(`✓ Base de données '${dbName}' créée ou vérifiée avec succès`);
    
    tempConnection.release();
    await tempPool.end();
    
    // Now connect to the actual database
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
  
      const createAnnoncesTableQuery = `
      CREATE TABLE IF NOT EXISTS annonces (
        id INT AUTO_INCREMENT PRIMARY KEY,
        id_voiture INT NOT NULL,
        annee INT,
        puissance VARCHAR(50),
        marque VARCHAR(100),
        carburant VARCHAR(50),
        transmission VARCHAR(50),
        odometer INT COMMENT 'Kilométrage du véhicule',
        notRepairedDamage BOOLEAN DEFAULT FALSE COMMENT 'Dommages non réparés',
        fraud_prediction INT DEFAULT NULL COMMENT 'Prédiction de fraude (0=normal, 1=fraude)',
        fraud_probability DECIMAL(5,4) DEFAULT NULL COMMENT 'Probabilité de fraude (0-1)',
        fraud_level VARCHAR(20) DEFAULT NULL COMMENT 'Niveau de fraude (low, medium, high)',
        date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (id_voiture) REFERENCES voitures(id) ON DELETE CASCADE,
        INDEX idx_id_voiture (id_voiture),
        INDEX idx_marque (marque),
        INDEX idx_odometer (odometer),
        INDEX idx_fraud_prediction (fraud_prediction)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;
    
    await connection.query(createAnnoncesTableQuery);
    console.log('✅ Table annonces créée ou vérifiée avec succès');
    // ========== CRÉATION TABLE APPOINTMENTS (VERSION CORRIGÉE) ==========
const createAppointmentsTableQuery = `
  CREATE TABLE IF NOT EXISTS appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id INT NOT NULL,
    buyer_name VARCHAR(100) NOT NULL,
    buyer_phone VARCHAR(20) NOT NULL,
    appointment_date DATETIME NOT NULL,
    status ENUM('scheduled', 'completed', 'cancelled', 'no_show') DEFAULT 'scheduled',
    notes TEXT,
    seller_name VARCHAR(100),
    seller_phone VARCHAR(20),
    seller_email VARCHAR(150),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_appointment_date (appointment_date),
    INDEX idx_status (status),
    INDEX idx_vehicle_id (vehicle_id),
    FOREIGN KEY (vehicle_id) REFERENCES voitures(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;
    
    await connection.query(createAppointmentsTableQuery);
    console.log('✓ Table appointments créée ou vérifiée avec succès');
    
    
    connection.release();
    console.log('✅ Base de données initialisée avec succès');
    return true;
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation de la base de données:', error.message);
    if (connection) connection.release();
    throw error;
  }
}
/**
 * Tester la connexion à la base de données
 */
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connexion à la base de données réussie');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Erreur de connexion à la base de données:', error.message);
    return false;
  }
}
/**
 * Fermer le pool de connexions
 */
async function closePool() {
  try {
    await pool.end();
    console.log('✅ Pool de connexions fermé');
  } catch (error) {
    console.error('❌ Erreur lors de la fermeture du pool:', error.message);
  }
}
module.exports = {
  pool,
  initializeDatabase,
  testConnection,
  closePool
};
