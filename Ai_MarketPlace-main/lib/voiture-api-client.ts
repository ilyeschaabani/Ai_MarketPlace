/**
 * Client API pour le service VOITURES (Backend MySQL sur port 5000)
 * 
 * IMPORTANT: Ce service est séparé du service Car Listing
 * Ne pas confondre avec les endpoints des car listings
 */

import { VOITURE_ENDPOINTS, DEFAULT_HEADERS, REQUEST_TIMEOUT } from './api-config';
import { Voiture, VoitureApiResponse, VoitureSearchCriteria } from './types';

class VoitureApiClient {
  private baseURL: string;
  private headers: HeadersInit;

  constructor() {
    this.baseURL = VOITURE_ENDPOINTS.getAll.replace('/api/voitures', '');
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
   * GET - Récupérer toutes les voitures
   */
  async getAllVoitures(): Promise<VoitureApiResponse> {
    try {
      const response = await this.fetchWithTimeout(VOITURE_ENDPOINTS.getAll);
      return this.handleResponse<VoitureApiResponse>(response);
    } catch (error) {
      console.error('Erreur lors de la récupération des voitures:', error);
      throw error;
    }
  }

  /**
   * GET - Récupérer une voiture par son matricule
   */
  async getVoitureByMatricule(matricule: string): Promise<VoitureApiResponse> {
    try {
      const response = await this.fetchWithTimeout(
        VOITURE_ENDPOINTS.getByMatricule(matricule)
      );
      return this.handleResponse<VoitureApiResponse>(response);
    } catch (error) {
      console.error(`Erreur lors de la récupération de la voiture ${matricule}:`, error);
      throw error;
    }
  }

  /**
   * POST - Créer une nouvelle voiture
   */
  async createVoiture(voiture: Omit<Voiture, 'id' | 'date_creation' | 'date_modification'>): Promise<VoitureApiResponse> {
    try {
      const response = await this.fetchWithTimeout(VOITURE_ENDPOINTS.create, {
        method: 'POST',
        body: JSON.stringify(voiture),
      });
      return this.handleResponse<VoitureApiResponse>(response);
    } catch (error) {
      console.error('Erreur lors de la création de la voiture:', error);
      throw error;
    }
  }

  /**
   * PUT - Mettre à jour une voiture
   */
  async updateVoiture(
    matricule: string,
    voiture: Partial<Voiture>
  ): Promise<VoitureApiResponse> {
    try {
      const response = await this.fetchWithTimeout(
        VOITURE_ENDPOINTS.update(matricule),
        {
          method: 'PUT',
          body: JSON.stringify(voiture),
        }
      );
      return this.handleResponse<VoitureApiResponse>(response);
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la voiture ${matricule}:`, error);
      throw error;
    }
  }

  /**
   * DELETE - Supprimer une voiture
   */
  async deleteVoiture(matricule: string): Promise<VoitureApiResponse> {
    try {
      const response = await this.fetchWithTimeout(
        VOITURE_ENDPOINTS.delete(matricule),
        {
          method: 'DELETE',
        }
      );
      return this.handleResponse<VoitureApiResponse>(response);
    } catch (error) {
      console.error(`Erreur lors de la suppression de la voiture ${matricule}:`, error);
      throw error;
    }
  }

  /**
   * GET - Compter le nombre de voitures
   */
  async countVoitures(): Promise<VoitureApiResponse> {
    try {
      const response = await this.fetchWithTimeout(VOITURE_ENDPOINTS.count);
      return this.handleResponse<VoitureApiResponse>(response);
    } catch (error) {
      console.error('Erreur lors du comptage des voitures:', error);
      throw error;
    }
  }

  /**
   * GET - Rechercher des voitures avec des critères
   */
  async searchVoitures(criteria: VoitureSearchCriteria): Promise<VoitureApiResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(criteria).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });

      const url = `${VOITURE_ENDPOINTS.search}?${queryParams.toString()}`;
      const response = await this.fetchWithTimeout(url);
      return this.handleResponse<VoitureApiResponse>(response);
    } catch (error) {
      console.error('Erreur lors de la recherche de voitures:', error);
      throw error;
    }
  }

  /**
   * Vérifier la disponibilité de l'API
   */
  async checkHealth(): Promise<boolean> {
    try {
      const response = await this.fetchWithTimeout(this.baseURL);
      return response.ok;
    } catch (error) {
      console.error('Le backend voiture n\'est pas disponible:', error);
      return false;
    }
  }
}

// Export d'une instance unique (singleton)
export const voitureApiClient = new VoitureApiClient();

// Export de la classe pour les tests
export default VoitureApiClient;
