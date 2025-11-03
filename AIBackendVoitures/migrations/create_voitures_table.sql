-- Créer la base de données
CREATE DATABASE IF NOT EXISTS marketplace_db;

-- Utiliser la base de données
USE marketplace_db;

-- Créer la table des voitures
CREATE TABLE IF NOT EXISTS voitures (
  id INT AUTO_INCREMENT PRIMARY KEY,
  matricule VARCHAR(20) UNIQUE NOT NULL COMMENT 'Numéro de série unique de la voiture',
  marque VARCHAR(100) NOT NULL COMMENT 'Marque du véhicule',
  modele VARCHAR(100) NOT NULL COMMENT 'Modèle du véhicule',
  annee INT COMMENT 'Année de fabrication',
  puissance INT COMMENT 'Puissance en chevaux',
  cylindres INT COMMENT 'Nombre de cylindres',
  carburant VARCHAR(50) COMMENT 'Type de carburant',
  transmission VARCHAR(50) COMMENT 'Type de transmission',
  traction VARCHAR(50) COMMENT 'Type de traction',
  prix DECIMAL(10, 2) COMMENT 'Prix de la voiture',
  date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Date d\'ajout',
  date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Date de dernière modification',
  INDEX idx_matricule (matricule),
  INDEX idx_marque (marque),
  INDEX idx_prix (prix)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insérer des données de test (optionnel)
INSERT INTO voitures (matricule, marque, modele, annee, puissance, cylindres, carburant, transmission, traction, prix) VALUES
('TN001', 'Toyota', 'Corolla', 2020, 120, 4, 'Essence', 'Automatique', 'Avant', 35000),
('TN002', 'Honda', 'Civic', 2021, 140, 4, 'Essence', 'Manuel', 'Avant', 38000),
('TN003', 'BMW', 'X5', 2019, 250, 6, 'Diesel', 'Automatique', '4WD', 85000)
ON DUPLICATE KEY UPDATE matricule=matricule;
