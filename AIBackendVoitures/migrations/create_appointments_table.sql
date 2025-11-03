/**
 * @file create_appointments_table.sql
 * @description Migration pour créer la table des rendez-vous de vente de voitures
 * @version 1.0.0
 * @created 2024-11-03
 * @context Application de vente de voitures d'occasion (Acheteur/Vendeur)
 */

-- =============================================
-- TABLE: appointments
-- Description: Stocke les rendez-vous entre acheteurs et vendeurs
-- Contexte: Application de vente de voitures d'occasion
-- =============================================
CREATE TABLE IF NOT EXISTS appointments (
    -- Identifiant unique
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identifiant unique du rendez-vous',
    
    -- Informations véhicule (lié à la table voitures)
    vehicle_id INT NOT NULL COMMENT 'Référence vers la table voitures',
    vehicle_matricule VARCHAR(20) NOT NULL COMMENT 'Matricule du véhicule',
    vehicle_marque VARCHAR(100) NOT NULL COMMENT 'Marque du véhicule',
    vehicle_modele VARCHAR(100) NOT NULL COMMENT 'Modèle du véhicule',
    vehicle_prix DECIMAL(10,2) COMMENT 'Prix du véhicule',
    
    -- Informations ACHETEUR (client)
    buyer_name VARCHAR(100) NOT NULL COMMENT 'Nom complet de l acheteur',
    buyer_email VARCHAR(150) NOT NULL COMMENT 'Email de l acheteur',
    buyer_phone VARCHAR(20) NOT NULL COMMENT 'Téléphone de l acheteur',
    buyer_type ENUM('particular', 'professional') DEFAULT 'particular' COMMENT 'Type d acheteur',
    
    -- Informations VENDEUR (optionnel - peut être différent du créateur du RDV)
    seller_id INT COMMENT 'Référence vers un profil vendeur si existant',
    seller_name VARCHAR(100) COMMENT 'Nom du vendeur assigné',
    seller_phone VARCHAR(20) COMMENT 'Téléphone du vendeur',
    
    -- Détails rendez-vous de vente
    appointment_date DATETIME NOT NULL COMMENT 'Date et heure du rendez-vous',
    appointment_type ENUM(
        'vehicle_viewing',     -- Visite du véhicule
        'test_drive',          -- Essai routier
        'technical_inspection', -- Inspection technique
        'price_negotiation',   -- Négociation de prix
        'contract_signing',    -- Signature de contrat
        'vehicle_delivery'     -- Livraison du véhicule
    ) DEFAULT 'vehicle_viewing' COMMENT 'Type de rendez-vous de vente',
    
    -- Statut du processus de vente
    status ENUM(
        'pending',           -- En attente de confirmation
        'confirmed',         -- Confirmé par les deux parties
        'in_progress',       -- Rendez-vous en cours
        'completed',         -- Rendez-vous terminé
        'cancelled',         -- Annulé
        'no_show',           -- Client non présenté
        'sale_pending',      -- Vente en cours de finalisation
        'sale_completed'     -- Vente finalisée
    ) DEFAULT 'pending' COMMENT 'Statut du rendez-vous et de la vente',
    
    -- Informations de suivi vente
    sale_interest_level ENUM('low', 'medium', 'high', 'very_high') DEFAULT 'medium' COMMENT 'Niveau d intérêt pour l achat',
    follow_up_required BOOLEAN DEFAULT FALSE COMMENT 'Si un suivi est nécessaire',
    next_follow_up_date DATE COMMENT 'Date du prochain suivi',
    notes TEXT COMMENT 'Notes du vendeur sur le rendez-vous',
    
    -- Prédiction ML Non-Shown (spécifique au contexte vente)
    no_show_probability FLOAT DEFAULT 0.0 COMMENT 'Probabilité de non-présentation de l acheteur (0-1)',
    prediction_confidence FLOAT DEFAULT 0.0 COMMENT 'Niveau de confiance de la prédiction ML',
    risk_level ENUM('low', 'medium', 'high') DEFAULT 'low' COMMENT 'Niveau de risque pour la vente',
    
    -- Métadonnées
    created_by INT COMMENT 'ID de l utilisateur qui a créé le rendez-vous',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Date de création',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Date de dernière modification',
    
    -- Contraintes et index
    INDEX idx_appointment_date (appointment_date) COMMENT 'Index pour recherches par date',
    INDEX idx_status (status) COMMENT 'Index pour suivi des statuts',
    INDEX idx_vehicle_id (vehicle_id) COMMENT 'Index pour jointures avec voitures',
    INDEX idx_buyer_phone (buyer_phone) COMMENT 'Index pour recherches par téléphone acheteur',
    INDEX idx_sale_interest (sale_interest_level) COMMENT 'Index pour suivi des ventes',
    FOREIGN KEY (vehicle_id) REFERENCES voitures(id) ON DELETE CASCADE COMMENT 'Clé étrangère vers voitures'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
COMMENT='Table de gestion des rendez-vous de vente entre acheteurs et vendeurs avec prédiction de non-présentation';