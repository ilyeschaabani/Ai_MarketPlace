/**
 * Client API pour le service d'embedding
 * Permet de calculer la similarité entre voitures via leurs embeddings
 */

const EMBEDDING_SERVICE_URL = process.env.NEXT_PUBLIC_EMBEDDING_SERVICE_URL || 'http://localhost:5555';

interface EmbeddingCandidate {
  id: string;
  embedding: number[];
}

interface SimilarityRequest {
  seed: {
    embedding: number[];
  };
  candidates: EmbeddingCandidate[];
  k?: number;
}

interface SimilarityResult {
  id: string;
  similarity: number;
}

interface SimilarityResponse {
  topk: SimilarityResult[];
}

/**
 * Calcule les voitures les plus similaires à une voiture de référence
 * en utilisant la similarité cosinus des embeddings
 */
export async function findSimilarCars(
  seedEmbedding: number[],
  candidates: EmbeddingCandidate[],
  k: number = 10
): Promise<SimilarityResult[]> {
  try {
    const url = `${EMBEDDING_SERVICE_URL.replace(/\/+$/, '')}/v1/similar`;
    
    console.log('🔍 Calling embedding service:', url);
    console.log('📊 Seed embedding length:', seedEmbedding.length);
    console.log('👥 Candidates count:', candidates.length);
    
    const payload: SimilarityRequest = {
      seed: { embedding: seedEmbedding },
      candidates,
      k
    };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000); // 15s timeout

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        mode: 'cors',
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeout);

      console.log('✅ Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('❌ Error response:', errorData);
        throw new Error(errorData?.error || `HTTP ${response.status}`);
      }

      const data: SimilarityResponse = await response.json();
      console.log('📈 Similar cars found:', data.topk?.length || 0);
      return data.topk || [];
    } finally {
      clearTimeout(timeout);
    }
  } catch (error) {
    console.error('💥 Erreur lors du calcul de similarité:', error);
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
    }
    throw error;
  }
}

/**
 * Vérifie la disponibilité du service d'embedding
 */
export async function checkEmbeddingServiceHealth(): Promise<boolean> {
  try {
    const url = `${EMBEDDING_SERVICE_URL.replace(/\/+$/, '')}/health`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    try {
      const response = await fetch(url, {
        headers: {
          'ngrok-skip-browser-warning': 'true',
        },
        signal: controller.signal
      });
      return response.ok;
    } finally {
      clearTimeout(timeout);
    }
  } catch (error) {
    console.error('Service d\'embedding non disponible:', error);
    return false;
  }
}

/**
 * Récupère les recommandations du marché externe
 * Utilise l'endpoint /v1/recommend qui compare avec car_embeddings.json
 */
export async function getExternalRecommendations(embedding: number[]): Promise<any[]> {
  const url = `${EMBEDDING_SERVICE_URL.replace(/\/+$/, '')}/v1/recommend`;
  
  console.log('🌐 Fetching external market recommendations from:', url);
  
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'ngrok-skip-browser-warning': 'true',
      },
      mode: 'cors',
      body: JSON.stringify({
        seed: {
          embedding: embedding
        }
      }),
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('❌ External recommendations error:', errorData);
      throw new Error(errorData?.error || `HTTP ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ External recommendations received:', data.topk?.length || 0, 'cars');
    
    return data.topk || [];
  } catch (error) {
    console.error('💥 Error fetching external recommendations:', error);
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
