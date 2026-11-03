/**
 * MOCK SERVICE: Marketing Content Generator
 * 
 * IMPORTANT FOR AI DEVELOPER:
 * Replace the return value in `generateContent` with a call to your LLM API 
 * (e.g. OpenAI GPT-4, Gemini, Claude, or custom fine-tuned model endpoint).
 * Do not change the function signatures or returned object structure to keep UI compatible.
 */

import { MOCK_CONTENT_TEMPLATES } from './mockData';

export const marketingService = {
  /**
   * Generates mock marketing content based on user inputs.
   * @param {Object} params - { contentType, platform, product, targetAudience, tone, keywords, instructions }
   * @returns {Promise<Object>} Simulated AI content result
   */
  async generateContent(params) {
    const { contentType = "Social Media Post", tone = "Professional", platform = "LinkedIn", product = "PulseFlow AI Suite" } = params;
    
    // Simulate artificial network / AI inference delay (700ms)
    await new Promise((resolve) => setTimeout(resolve, 700));

    const categoryTemplates = MOCK_CONTENT_TEMPLATES[contentType] || MOCK_CONTENT_TEMPLATES["Social Media Post"];
    const toneTemplates = categoryTemplates[tone] || categoryTemplates["Professional"] || categoryTemplates[Object.keys(categoryTemplates)[0]];

    // Pick a template variant based on random index or fallback
    const randomIndex = Math.floor(Math.random() * toneTemplates.length);
    let selectedText = toneTemplates[randomIndex] || toneTemplates[0];

    // Inject product name dynamically if present
    if (product) {
      selectedText = selectedText.replace(/PulseFlow AI Suite/g, product);
    }

    return {
      success: true,
      content: selectedText,
      contentType,
      platform,
      tone,
      timestamp: new Date().toISOString(),
      isDemo: true,
      metadata: {
        tokensGenerated: 142,
        modelName: "Mock-LLM-v1 (Pre-rendered Demo)",
        confidenceScore: 0.94
      }
    };
  }
};
