/**
 * Marketing Content & Poster Generator Service
 */

import { MOCK_CONTENT_TEMPLATES } from './mockData';
import { generatePosterData } from '../utils/posterGenerator';

export const marketingService = {
  /**
   * Generates marketing content & poster data based on user inputs.
   * @param {Object} params - { contentType, platform, product, targetAudience, tone, keywords, instructions }
   * @returns {Promise<Object>} Generated marketing content & poster
   */
  async generateContent(params) {
    const {
      contentType = "Social Media Post",
      tone = "Professional",
      platform = "LinkedIn",
      product = "PulseFlow AI Suite",
      brandName = "PulseFlow AI"
    } = params;
    
    // Simulate artificial network / AI inference delay (600ms)
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Generate full poster asset
    const poster = generatePosterData({
      brandName,
      product,
      tone,
      platform,
      posterType: contentType,
      ...params
    });

    const categoryTemplates = MOCK_CONTENT_TEMPLATES[contentType] || MOCK_CONTENT_TEMPLATES["Social Media Post"] || {};
    const toneTemplates = categoryTemplates[tone] || categoryTemplates["Professional"] || Object.values(categoryTemplates)[0] || [poster.caption];

    const randomIndex = Math.floor(Math.random() * (toneTemplates.length || 1));
    let selectedText = toneTemplates[randomIndex] || poster.caption;

    if (product) {
      selectedText = selectedText.replace(/PulseFlow AI Suite/g, product);
    }

    return {
      success: true,
      content: selectedText,
      poster,
      contentType,
      platform,
      tone,
      timestamp: new Date().toISOString(),
      metadata: {
        tokensGenerated: 168,
        modelName: "MARKETxAI-Creative-Engine-v2",
        confidenceScore: 0.98
      }
    };
  }
};
