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
  database: process.env.DB_NAME || 'gestion_voitures',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true
});

/**
 * Initialiser la base de données
 * Crée les tables voitures et appointments si elles n'existent pas
 */
async function initializeDatabase() {
  let connection;
  try {
    connection = await pool.getConnection();
    
    // ========== CRÉATION TABLE VOITURES ==========
    const createVoituresTableQuery = `
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
    
    await connection.query(createVoituresTableQuery);
    console.log('✓ Table voitures créée ou vérifiée avec succès');
    
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
    
    // ========== MISE À JOUR COLONNES VOITURES ==========
    try {
      await connection.query("ALTER TABLE voitures ADD COLUMN IF NOT EXISTS embedding JSON NULL");
      await connection.query("ALTER TABLE voitures ADD COLUMN IF NOT EXISTS encoder_version VARCHAR(100) NULL");
      await connection.query("ALTER TABLE voitures ADD COLUMN IF NOT EXISTS cleaned_fields JSON NULL");
      console.log('✓ Colonnes embedding/encoder_version/cleaned_fields vérifiées ou ajoutées');
    } catch (alterErr) {
      console.warn('⚠️ ALTER TABLE avec IF NOT EXISTS a échoué, vérification manuelle des colonnes...');
      const colsQuery = `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'voitures'`;
      const [cols] = await connection.query(colsQuery, [process.env.DB_NAME || 'gestion_voitures']);
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
    console.log('🎉 Base de données complètement initialisée');
    return true;
    
  } catch (error) {
    console.error('✗ Erreur lors de l\'initialisation de la base de données:', error.message);
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
    console.log('✓ Connexion à MySQL établie avec succès');
    connection.release();
    return true;
  } catch (error) {
    console.error('✗ Erreur de connexion à MySQL:', error.message);
    return false;
  }
}

module.exports = {
  pool,
  initializeDatabase,
  testConnection
};