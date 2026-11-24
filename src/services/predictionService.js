/**
 * MOCK SERVICE: Campaign Performance Prediction
 * 
 * IMPORTANT FOR AI DEVELOPER:
 * Replace the prediction logic with your ML regression/classification model
 * or predictive analytics endpoint.
 */

export const predictionService = {
  /**
   * Predicts campaign performance metrics based on budget, platform, and audience parameters.
   * @param {Object} params - { campaignName, budget, platform, targetAudience, durationDays, objective }
   * @returns {Promise<Object>} Mock prediction result
   */
  async predictCampaign(params) {
    const budget = Number(params.budget) || 5000;
    const duration = Number(params.durationDays) || 30;
    const platform = params.platform || "LinkedIn";

    // Simulate ML model inference delay (800ms)
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Dynamic mock score calculation logic for realistic preview output
    const baseScore = Math.min(95, Math.max(62, Math.round(70 + (budget / 500) + (duration / 5))));
    const expectedReach = Math.round(budget * 4.8 + duration * 150);
    const expectedClicks = Math.round(expectedReach * 0.045);
    const estimatedConversions = Math.round(expectedClicks * 0.072);
    const estimatedCTR = "4.5%";
    const estimatedConversionRate = "7.2%";

    let recommendationTip = "Increase allocation on short-form visual content to maximize engagement.";
    if (platform === "LinkedIn") {
      recommendationTip = "Leverage executive thought leadership posts and target mid-to-senior operations managers for optimal lead capture.";
    } else if (platform === "Instagram") {
      recommendationTip = "Incorporate 15-second Reel previews highlighting key software benefits to drive higher click-throughs.";
    } else if (platform === "X/Twitter") {
      recommendationTip = "Run targeted thread campaigns with actionable productivity tips and immediate sign-up links.";
    }

    return {
      success: true,
      isDemo: true,
      predictionScore: baseScore,
      rating: baseScore > 80 ? "Excellent" : baseScore > 70 ? "Good" : "Average",
      metrics: {
        expectedReach: expectedReach.toLocaleString(),
        expectedClicks: expectedClicks.toLocaleString(),
        estimatedConversions: estimatedConversions.toLocaleString(),
        estimatedCTR,
        estimatedConversionRate,
        estimatedCAC: `$${(budget / Math.max(1, estimatedConversions)).toFixed(2)}`
      },
      recommendation: recommendationTip,
      breakdown: [
        { metric: "Audience Relevance", score: Math.min(98, baseScore + 4) },
        { metric: "Budget Sufficiency", score: Math.min(95, baseScore - 2) },
        { metric: "Platform Alignment", score: Math.min(96, baseScore + 3) },
        { metric: "Ad Creative Impact", score: Math.min(92, baseScore - 1) }
      ],
      modelInfo: {
        name: "Mock-ML-CampaignPredictor-v2",
        accuracy: "89.4% cross-validation"
      }
    };
  }
};
