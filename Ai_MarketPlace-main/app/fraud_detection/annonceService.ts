import axios, { AxiosError } from 'axios';
import type { Annonce, CreateAnnonceData, AnnonceResponse } from '@/types/annonce';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/annonces';

// Error handler helper
const handleError = (error: any): never => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<any>;
    throw new Error(
      axiosError.response?.data?.message || 
      axiosError.message || 
      'Une erreur est survenue'
    );
  }
  throw error;
};

export const annonceService = {
  /**
   * Create a new annonce with fraud detection
   * @param data - Annonce data to create
   * @returns Promise with annonce and fraud detection results
   */
  createAnnonce: async (data: CreateAnnonceData): Promise<AnnonceResponse> => {
    try {
      const response = await axios.post<AnnonceResponse>(API_URL, data);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  /**
   * Get all public annonces (excludes fraudulent ones)
   * @returns Promise with array of legitimate annonces
   */
  getAllAnnonces: async (): Promise<{ success: boolean; data: Annonce[] }> => {
    try {
      const response = await axios.get<{ success: boolean; data: Annonce[] }>(API_URL);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  /**
   * Get a single annonce by ID
   * @param id - Annonce ID
   * @returns Promise with single annonce
   */
  getAnnonceById: async (id: number): Promise<{ success: boolean; data: Annonce }> => {
    try {
      const response = await axios.get<{ success: boolean; data: Annonce }>(
        `${API_URL}/${id}`
      );
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  /**
   * Get all annonces for a specific voiture
   * @param voitureId - Voiture ID
   * @returns Promise with array of annonces
   */
  getAnnoncesByVoiture: async (voitureId: number): Promise<{ success: boolean; data: Annonce[] }> => {
    try {
      const response = await axios.get<{ success: boolean; data: Annonce[] }>(
        `${API_URL}/voiture/${voitureId}`
      );
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  /**
   * Search annonces with filters
   * @param criteria - Search criteria object
   * @returns Promise with filtered annonces
   */
  searchAnnonces: async (criteria: {
    marque?: string;
    carburant?: string;
    odometerMin?: number;
    odometerMax?: number;
    prixMin?: number;
    prixMax?: number;
    anneeMin?: number;
    anneeMax?: number;
  }): Promise<{ success: boolean; data: Annonce[] }> => {
    try {
      const response = await axios.post<{ success: boolean; data: Annonce[] }>(
        `${API_URL}/search`,
        criteria
      );
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  /**
   * Update an existing annonce
   * @param id - Annonce ID
   * @param data - Partial annonce data to update
   * @returns Promise with updated annonce
   */
  updateAnnonce: async (
    id: number,
    data: Partial<CreateAnnonceData>
  ): Promise<AnnonceResponse> => {
    try {
      const response = await axios.put<AnnonceResponse>(
        `${API_URL}/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  /**
   * Delete an annonce
   * @param id - Annonce ID
   * @returns Promise with deletion confirmation
   */
  deleteAnnonce: async (id: number): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await axios.delete<{ success: boolean; message: string }>(
        `${API_URL}/${id}`
      );
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  // ==================== ADMIN ONLY ENDPOINTS ====================

  /**
   * ADMIN: Get all annonces including fraudulent ones
   * @returns Promise with all annonces
   */
  getAdminAnnonces: async (): Promise<{ success: boolean; data: Annonce[] }> => {
    try {
      const response = await axios.get<{ success: boolean; data: Annonce[] }>(
        `${API_URL}/admin/all`
      );
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  /**
   * ADMIN: Get only fraudulent annonces
   * @returns Promise with fraudulent annonces
   */
  getFraudulentAnnonces: async (): Promise<{ success: boolean; data: Annonce[] }> => {
    try {
      const response = await axios.get<{ success: boolean; data: Annonce[] }>(
        `${API_URL}/admin/frauduleuses`
      );
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  /**
   * ADMIN: Get fraud statistics
   * @returns Promise with fraud statistics
   */
  getFraudStatistics: async (): Promise<{
    success: boolean;
    data: {
      total: number;
      fraudulent: number;
      legitimate: number;
      fraudRate: number;
      byLevel: {
        low: number;
        medium: number;
        high: number;
      };
    };
  }> => {
    try {
      const response = await axios.get(
        `${API_URL}/admin/statistics`
      );
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  /**
   * ADMIN: Manually override fraud detection
   * @param id - Annonce ID
   * @param isFraud - Manual fraud override value
   * @returns Promise with updated annonce
   */
  overrideFraudDetection: async (
    id: number,
    isFraud: boolean
  ): Promise<AnnonceResponse> => {
    try {
      const response = await axios.patch<AnnonceResponse>(
        `${API_URL}/admin/${id}/fraud-override`,
        { is_fraud: isFraud }
      );
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  // ==================== UTILITY METHODS ====================

  /**
   * Check if backend API is reachable
   * @returns Promise with health status
   */
  healthCheck: async (): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await axios.get<{ success: boolean; message: string }>(
        `${API_URL.replace('/api/annonces', '')}/health`
      );
      return response.data;
    } catch (error) {
      return { success: false, message: 'Backend is unreachable' };
    }
  },

  /**
   * Get fraud detection model info
   * @returns Promise with model information
   */
  getModelInfo: async (): Promise<{
    success: boolean;
    data: {
      model: string;
      version: string;
      accuracy: number;
      lastTrained: string;
    };
  }> => {
    try {
      const response = await axios.get(
        `${API_URL}/model-info`
      );
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },
};

// Default export
export default annonceService;