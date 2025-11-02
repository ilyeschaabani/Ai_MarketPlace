/**
 * Configuration des endpoints de l'API
 * 
 * IMPORTANT: 
 * - Le service VOITURE utilise le backend MySQL sur le port 5000
 * - Le service CAR LISTING reste séparé et utilise d'autres endpoints
 */

// Backend pour le service VOITURES (MySQL)
export const VOITURE_API_BASE_URL = process.env.NEXT_PUBLIC_VOITURE_API_URL || 'http://localhost:5000';

// Endpoints pour le service VOITURES
export const VOITURE_ENDPOINTS = {
  // CRUD Operations
  getAll: `${VOITURE_API_BASE_URL}/api/voitures`,
  getByMatricule: (matricule: string) => `${VOITURE_API_BASE_URL}/api/voitures/${matricule}`,
  create: `${VOITURE_API_BASE_URL}/api/voitures`,
  update: (matricule: string) => `${VOITURE_API_BASE_URL}/api/voitures/${matricule}`,
  delete: (matricule: string) => `${VOITURE_API_BASE_URL}/api/voitures/${matricule}`,
  
  // Statistiques et recherche
  count: `${VOITURE_API_BASE_URL}/api/voitures/stats/count`,
  search: `${VOITURE_API_BASE_URL}/api/voitures/search/filter`,
};

// Configuration des headers par défaut
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

// Timeout pour les requêtes (en millisecondes)
export const REQUEST_TIMEOUT = 10000;
