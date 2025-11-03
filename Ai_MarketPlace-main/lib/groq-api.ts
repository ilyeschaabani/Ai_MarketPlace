/**
 * Service pour l'API Groq Cloud
 * Génère des recommandations d'achat basées sur les caractéristiques de la voiture
 */

const GROQ_API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY || '';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export interface GroqResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Génère des raisons convaincantes pour acheter une voiture
 * @param voiture - Les détails de la voiture
 * @returns Le texte généré par l'IA
 */
export async function generatePurchaseReasons(voiture: {
  marque: string;
  modele: string;
  annee?: number | null;
  prix?: number | null;
  puissance?: number | null;
  carburant?: string | null;
  transmission?: string | null;
  cylindres?: number | null;
}): Promise<string> {
  try {
    // Vérifier que l'API key est configurée
    if (!GROQ_API_KEY) {
      throw new Error('GROQ API key non configurée. Ajoutez NEXT_PUBLIC_GROQ_API_KEY dans .env.local');
    }

    // Construire le prompt avec les caractéristiques de la voiture
    const prompt = `Tu es un expert commercial automobile enthousiaste et persuasif. 

Voici les détails d'une voiture :
- Marque: ${voiture.marque}
- Modèle: ${voiture.modele}
${voiture.annee ? `- Année: ${voiture.annee}` : ''}
${voiture.prix ? `- Prix: ${voiture.prix.toLocaleString()} €` : ''}
${voiture.puissance ? `- Puissance: ${voiture.puissance} CV` : ''}
${voiture.cylindres ? `- Cylindrée: ${voiture.cylindres} cm³` : ''}
${voiture.carburant ? `- Carburant: ${voiture.carburant}` : ''}
${voiture.transmission ? `- Transmission: ${voiture.transmission}` : ''}

Génère 5 raisons convaincantes et encourageantes pour acheter cette voiture. 
Sois enthousiaste, positif et mets en avant les avantages réels de ce véhicule.
Utilise des émojis et un ton chaleureux.

IMPORTANT: Ta réponse doit être en HTML valide. Utilise exactement ce format:

<div class="ai-recommendations">
  <div class="recommendation-item">
    <h3 class="recommendation-title">🚀 Titre accrocheur de la raison 1</h3>
    <p class="recommendation-text">Explication détaillée et convaincante de cette première raison d'achat...</p>
  </div>
  <div class="recommendation-item">
    <h3 class="recommendation-title">💰 Titre accrocheur de la raison 2</h3>
    <p class="recommendation-text">Explication détaillée et convaincante de cette deuxième raison d'achat...</p>
  </div>
  <div class="recommendation-item">
    <h3 class="recommendation-title">⚡ Titre accrocheur de la raison 3</h3>
    <p class="recommendation-text">Explication détaillée et convaincante de cette troisième raison d'achat...</p>
  </div>
  <div class="recommendation-item">
    <h3 class="recommendation-title">🎯 Titre accrocheur de la raison 4</h3>
    <p class="recommendation-text">Explication détaillée et convaincante de cette quatrième raison d'achat...</p>
  </div>
  <div class="recommendation-item">
    <h3 class="recommendation-title">⭐ Titre accrocheur de la raison 5</h3>
    <p class="recommendation-text">Explication détaillée et convaincante de cette cinquième raison d'achat...</p>
  </div>
</div>

Ne retourne QUE le HTML, sans balises \`\`\`html ou texte avant/après.`;

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data: GroqResponse = await response.json();
    
    if (data.choices && data.choices.length > 0) {
      return data.choices[0].message.content;
    }

    throw new Error('Aucune réponse générée');
  } catch (error) {
    console.error('Erreur Groq API:', error);
    throw error;
  }
}

/**
 * Génère une description marketing courte
 */
export async function generateShortDescription(voiture: {
  marque: string;
  modele: string;
  annee?: number | null;
}): Promise<string> {
  try {
    const prompt = `Génère une phrase accrocheuse et enthousiasmante pour vendre une ${voiture.marque} ${voiture.modele}${voiture.annee ? ` de ${voiture.annee}` : ''}. Maximum 20 mots. Utilise un émoji.`;

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.8,
        max_tokens: 100,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data: GroqResponse = await response.json();
    
    if (data.choices && data.choices.length > 0) {
      return data.choices[0].message.content;
    }

    throw new Error('Aucune réponse générée');
  } catch (error) {
    console.error('Erreur Groq API:', error);
    throw error;
  }
}
