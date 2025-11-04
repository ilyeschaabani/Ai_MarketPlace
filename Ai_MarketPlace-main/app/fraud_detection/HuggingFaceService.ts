import axios from 'axios';

export interface AIAnalysisResult {
  success: boolean;
  data: {
    isSuspicious: boolean;
    sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
    sentimentScore: number;
    fraudScore: number;
    redFlags: string[];
    recommendations: string[];
  };
  error?: string;
}

/**
 * Hugging Face AI Service for fraud detection
 * Calls through Next.js API route to avoid CORS issues
 */
export const huggingFaceService = {
  /**
   * Analyze car listing description using AI sentiment analysis
   * Detects fraud patterns and suspicious wording
   */
  analyzeDescription: async (description: string): Promise<AIAnalysisResult> => {
    try {
      // Step 1: Call our API route (not Hugging Face directly)
      const response = await axios.post('/api/ai/analyze-description', {
        description
      });

      if (!response.data.success) {
        throw new Error(response.data.error || 'AI analysis failed');
      }

      const sentimentData = response.data.data;
      const sentiment = sentimentData.label;
      const sentimentScore = sentimentData.score;
      const isNegative = sentiment === 'NEGATIVE';

      // Step 2: Detect fraud patterns with regex
      const redFlags: string[] = [];
      const recommendations: string[] = [];

      // Urgency tactics
      if (/urgent|hurry|today only|limited time|act now|don't miss|last chance/i.test(description)) {
        redFlags.push('⚠️ Urgency tactics detected');
        recommendations.push('Remove pressure language');
      }

      // Unrealistic claims
      if (/brand new|never used|perfect condition|mint condition|flawless/i.test(description)) {
        redFlags.push('⚠️ Unrealistic claims for used car');
        recommendations.push('Be realistic about condition');
      }

      // Too good to be true
      if (/steal|bargain|unbelievable|amazing deal|incredible price/i.test(description)) {
        redFlags.push('⚠️ "Too good to be true" language');
        recommendations.push('Avoid exaggerated claims');
      }

      // Contact info in description (against policy)
      if (/\d{3}[-.\s]?\d{3}[-.\s]?\d{4}|whatsapp|telegram|email me/i.test(description)) {
        redFlags.push('⚠️ Contact information in description');
        recommendations.push('Remove contact details (use platform messaging)');
      }

      // Too short description
      if (description.length < 50) {
        redFlags.push('⚠️ Description too short (less than 50 characters)');
        recommendations.push('Add more details about the vehicle');
      }

      // Too long (spam)
      if (description.length > 2000) {
        redFlags.push('⚠️ Description unusually long');
        recommendations.push('Keep description concise and relevant');
      }

      // Excessive caps
      const capsRatio = (description.match(/[A-Z]/g) || []).length / description.length;
      if (capsRatio > 0.3) {
        redFlags.push('⚠️ Excessive capital letters (shouting)');
        recommendations.push('Use normal capitalization');
      }

      // Step 3: Calculate fraud score
      let fraudScore = 0;
      
      // Sentiment weight (40%)
      if (isNegative) {
        fraudScore += 0.4;
      } else if (sentimentScore > 0.95) {
        // Too positive = suspicious (might be fake/exaggerated)
        fraudScore += 0.2;
      }
      
      // Red flags weight (60%)
      fraudScore += Math.min(redFlags.length * 0.15, 0.6);

      // Cap at 1.0
      fraudScore = Math.min(fraudScore, 1.0);

      const isSuspicious = fraudScore > 0.5;

      return {
        success: true,
        data: {
          isSuspicious,
          sentiment: sentiment as 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL',
          sentimentScore,
          fraudScore: Math.round(fraudScore * 100) / 100, // Round to 2 decimals
          redFlags,
          recommendations
        }
      };

    } catch (error: any) {
      console.error('Hugging Face service error:', error.response?.data || error.message);
      
      // Return graceful fallback with only regex-based detection
      const redFlags: string[] = [];
      const recommendations: string[] = [];

      // Still do regex checks even if AI fails
      if (/urgent|hurry|today only/i.test(description)) {
        redFlags.push('⚠️ Urgency tactics detected');
        recommendations.push('Remove pressure language');
      }

      if (/brand new|perfect condition/i.test(description)) {
        redFlags.push('⚠️ Unrealistic claims');
        recommendations.push('Be realistic');
      }

      if (description.length < 50) {
        redFlags.push('⚠️ Description too short');
        recommendations.push('Add more details');
      }

      const fallbackFraudScore = Math.min(redFlags.length * 0.2, 0.8);

      return {
        success: false,
        data: {
          isSuspicious: fallbackFraudScore > 0.5,
          sentiment: 'NEUTRAL',
          sentimentScore: 0,
          fraudScore: fallbackFraudScore,
          redFlags,
          recommendations
        },
        error: error.response?.data?.error || error.message || 'AI analysis unavailable - using basic checks'
      };
    }
  },

  /**
   * Batch analyze multiple descriptions
   */
  analyzeMultipleDescriptions: async (descriptions: string[]): Promise<AIAnalysisResult[]> => {
    const results = await Promise.all(
      descriptions.map(desc => huggingFaceService.analyzeDescription(desc))
    );
    return results;
  }
};

export default huggingFaceService;