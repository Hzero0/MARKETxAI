/**
 * MOCK SERVICE: Sentiment Analysis
 * 
 * IMPORTANT FOR AI DEVELOPER:
 * Replace this service with your NLP / VADER / BERT / LLM Sentiment Analysis pipeline.
 */

import { INITIAL_SENTIMENT_DATA } from './mockData';

export const sentimentService = {
  /**
   * Retrieves sentiment analysis data and customer feedback mentions.
   * @param {Object} filters - { platform, dateRange, sentiment }
   * @returns {Promise<Object>} Mock sentiment analysis payload
   */
  async getSentimentData(filters = {}) {
    await new Promise((resolve) => setTimeout(resolve, 500));

    let filteredComments = [...INITIAL_SENTIMENT_DATA.comments];

    if (filters.platform && filters.platform !== "All") {
      filteredComments = filteredComments.filter(c => c.platform === filters.platform);
    }
    if (filters.sentiment && filters.sentiment !== "All") {
      filteredComments = filteredComments.filter(c => c.sentiment.toLowerCase() === filters.sentiment.toLowerCase());
    }

    return {
      success: true,
      isDemo: true,
      overall: INITIAL_SENTIMENT_DATA.overall,
      trend: INITIAL_SENTIMENT_DATA.trend,
      comments: filteredComments,
      summaryText: "Customer sentiment remains overwhelmingly positive (68%) with strong brand satisfaction driven by ease-of-use and ROI."
    };
  }
};
