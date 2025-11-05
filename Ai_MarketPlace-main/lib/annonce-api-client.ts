/**
 * Client API pour le service ANNONCES (Backend MySQL sur port 5000)
 * 
 * Ce client gère toutes les opérations liées aux annonces de voitures
 * incluant l'analyse de fraude et le calcul du risque d'assurance automatiques
 */

import { DEFAULT_HEADERS, REQUEST_TIMEOUT } from './api-config';

const ANNONCE_API_BASE_URL = process.env.NEXT_PUBLIC_VOITURE_API_URL || 'http://localhost:5000';

// Types pour les annonces
export interface AnnonceData {
  id?: number;
  voiture_id: number;
  vendeur_id: number;
  prix: number;
  description: string;
  kilometrage: number;
  etat?: string;
  localisation?: string;
  date_publication?: string;
  statut?: string;
  fraud_score?: number;
  fraud_risk_level?: string;
  fraud_indicators?: string;
  insurance_risk_score?: number;
  insurance_cost?: number;
  insurance_risk_level?: string;
  number_of_accidents?: number;
  years_of_experience?: number;
}

export interface CreateAnnonceRequest {
  id_voiture: number;
  id_vendeur: number;
  prix: number;
  description: string;
  kilometrage: number;
  etat?: string;
  localisation?: string | null;
  number_of_accidents?: number;
  years_of_experience?: number;
}

export interface AnnonceApiResponse {
  success: boolean;
  message: string;
  data?: AnnonceData | AnnonceData[];
  fraud_analysis?: {
    fraud_score: number;
    risk_level: string;
    indicators: string[];
  };
  insurance_analysis?: {
    riskScore: number;
    insuranceCost: number;
    riskLevel: string;
  };
}

class AnnonceApiClient {
  private baseURL: string;
  private headers: HeadersInit;

  constructor() {
    this.baseURL = ANNONCE_API_BASE_URL;
    this.headers = DEFAULT_HEADERS;
  }

  /**
   * Gestion des erreurs de requête
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({
        success: false,
        message: `Erreur HTTP ${response.status}`,
        status: response.status
      }));
      throw new Error(error.message || `Erreur ${response.status}`);
    }
    return response.json();
  }

  /**
   * Wrapper pour les requêtes avec timeout
   */
  private async fetchWithTimeout(url: string, options: RequestInit = {}): Promise<Response> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          ...this.headers,
          ...options.headers,
        },
      });
      return response;
    } finally {
      clearTimeout(timeout);
    }
  }

  /**
   * GET - Récupérer toutes les annonces
   */
  async getAllAnnonces(): Promise<AnnonceApiResponse> {
    try {
      const response = await this.fetchWithTimeout(`${this.baseURL}/api/annonces`);
      return this.handleResponse<AnnonceApiResponse>(response);
    } catch (error) {
      console.error('Erreur lors de la récupération des annonces:', error);
      throw error;
    }
  }

  /**
   * GET - Récupérer une annonce par ID
   */
  async getAnnonceById(id: number): Promise<AnnonceApiResponse> {
    try {
      const response = await this.fetchWithTimeout(`${this.baseURL}/api/annonces/${id}`);
      return this.handleResponse<AnnonceApiResponse>(response);
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'annonce ${id}:`, error);
      throw error;
    }
  }

  /**
   * POST - Créer une nouvelle annonce
   * IMPORTANT: Cette méthode déclenche automatiquement:
   * 1. Analyse de fraude (Fraud Detection AI)
   * 2. Calcul du risque d'assurance (Insurance Risk AI)
   * Les résultats sont stockés automatiquement dans la base de données
   */
  async createAnnonce(annonce: CreateAnnonceRequest): Promise<AnnonceApiResponse> {
    try {
      console.log('Creating annonce with data:', annonce);
      
      const response = await this.fetchWithTimeout(`${this.baseURL}/api/annonces`, {
        method: 'POST',
        body: JSON.stringify(annonce),
      });
      
      const result = await this.handleResponse<AnnonceApiResponse>(response);
      console.log('Annonce created successfully:', result);
      
      return result;
    } catch (error) {
      console.error('Erreur lors de la création de l\'annonce:', error);
      throw error;
    }
  }

  /**
   * PUT - Mettre à jour une annonce existante
   */
  async updateAnnonce(id: number, annonce: Partial<AnnonceData>): Promise<AnnonceApiResponse> {
    try {
      const response = await this.fetchWithTimeout(`${this.baseURL}/api/annonces/${id}`, {
        method: 'PUT',
        body: JSON.stringify(annonce),
      });
      return this.handleResponse<AnnonceApiResponse>(response);
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de l'annonce ${id}:`, error);
      throw error;
    }
  }

  /**
   * DELETE - Supprimer une annonce
   */
  async deleteAnnonce(id: number): Promise<AnnonceApiResponse> {
    try {
      const response = await this.fetchWithTimeout(`${this.baseURL}/api/annonces/${id}`, {
        method: 'DELETE',
      });
      return this.handleResponse<AnnonceApiResponse>(response);
    } catch (error) {
      console.error(`Erreur lors de la suppression de l'annonce ${id}:`, error);
      throw error;
    }
  }

  /**
   * GET - Récupérer les annonces d'un vendeur spécifique
   */
  async getAnnoncesByVendeur(vendeurId: number): Promise<AnnonceApiResponse> {
    try {
      const response = await this.fetchWithTimeout(`${this.baseURL}/api/annonces?vendeur_id=${vendeurId}`);
      return this.handleResponse<AnnonceApiResponse>(response);
    } catch (error) {
      console.error(`Erreur lors de la récupération des annonces du vendeur ${vendeurId}:`, error);
      throw error;
    }
  }
}

// Export singleton instance
export const annonceApiClient = new AnnonceApiClient();
