export interface Annonce {
  id: number;
  id_voiture: number;
  odometer: number;
  notRepairedDamage: boolean;
  fraud_prediction: number;
  fraud_probability: number;
  fraud_level: 'low' | 'medium' | 'high';
  date_creation: string;
  // Voiture details (joined from backend)
  marque?: string;
  modele?: string;
  matricule?: string;
  annee?: number;
  puissance?: number;
  carburant?: string;
  transmission?: string;
  prix?: number;
}

export interface CreateAnnonceData {
  id_voiture: number;
  odometer: number;
  notRepairedDamage: boolean;
}

export interface FraudDetectionResult {
  is_fraud: boolean;
  probability: number;
  level: 'low' | 'medium' | 'high';
}

export interface AnnonceResponse {
  success: boolean;
  message: string;
  data: Annonce;
  fraud_detection?: FraudDetectionResult;
  error?: string;
}

export interface AnnoncesListResponse {
  success: boolean;
  data?: Annonce[];
  message?: string;
  error?: string; // ✅ ADD THIS LINE
}