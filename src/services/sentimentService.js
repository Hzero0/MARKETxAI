/**
 * Sentiment Analysis Service
 * Interacts with Node.js / Python BERT Sentiment pipeline and MongoDB
 */

import { mongoService } from './mongoService';

export const sentimentService = {
  /**
   * Retrieves sentiment analysis data and customer feedback records for the given startup user.
   * @param {string} userId - Startup identifier
   * @returns {Promise<Object>} Sentiment data with distribution metrics and feedbacks
   */
  async getSentimentData(userId) {
    const id = userId || 'usr-demo-01';
    return await mongoService.getSentimentData(id);
  },

  /**
   * Submits a customer review / feedback for BERT NLP sentiment analysis.
   * @param {Object} payload - { text, userId, rating, category, source }
   * @returns {Promise<Object>} Classified feedback record with probabilities
   */
  async analyzeFeedback(payload) {
    return await mongoService.analyzeSentiment(payload);
  },

  /**
   * Deletes a feedback item by ID.
   * @param {string} feedbackId
   */
  async deleteFeedback(feedbackId) {
    return await mongoService.deleteFeedback(feedbackId);
  }
};
