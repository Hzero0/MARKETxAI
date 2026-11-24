/**
 * MOCK SERVICE: Recommendations Engine
 * 
 * IMPORTANT FOR AI DEVELOPER:
 * Replace this service with your recommendation model / RL agent / heuristic engine.
 */

import { INITIAL_RECOMMENDATIONS } from './mockData';

export const recommendationService = {
  /**
   * Retrieves personalized marketing recommendations for the active startup profile.
   * @param {Object} startupProfile 
   * @returns {Promise<Array>} List of mock recommendation cards
   */
  async getRecommendations(startupProfile = {}) {
    await new Promise((resolve) => setTimeout(resolve, 600));

    return {
      success: true,
      isDemo: true,
      recommendations: INITIAL_RECOMMENDATIONS,
      generatedAt: new Date().toISOString()
    };
  }
};
