import { AIAnalysisResult } from "@/app/fraud_detection/HuggingFaceService";

export interface Annonce {
  id: number;
  id_voiture: number;
  odometer: number;
  notRepairedDamage: boolean;
  description?: string; //hugging face attribute
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
  prix?: number;
  description?: string; //hugging face attribute
}

export interface FraudDetectionResult {
  is_fraud: boolean;
  probability: number;
  level: 'low' | 'medium' | 'high';
}

export interface AnnonceResponse {
  success: boolean;
  message: string;
  data?: Annonce;
  fraud_detection?: FraudDetectionResult;
  error?: string;
}
// ✅ ADD THIS - Enhanced Response with AI
export interface EnhancedAnnonceResponse extends AnnonceResponse {
  aiAnalysis?: AIAnalysisResult;
  combinedFraudScore?: number;
}

export interface AnnoncesListResponse {
  success: boolean;
  data?: Annonce[];
  message?: string;
  error?: string; // ✅ ADD THIS LINE
}
export interface DeleteAnnonceResponse {
  success: boolean;
  message: string;
  error?: string;
}