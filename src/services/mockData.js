// Clean Data Models & AI Service Integration Placeholders

export const EMPTY_STARTUP_PROFILE = {
  businessName: "",
  productName: "",
  industry: "",
  businessDescription: "",
  targetAudience: "",
  location: "",
  marketingObjective: "",
  marketingBudget: 0,
  preferredPlatforms: [],
  brandTone: "Professional",
  website: "",
  contactEmail: "",
  contactPhone: ""
};

export const DEFAULT_STARTUP_PROFILE = EMPTY_STARTUP_PROFILE;

export const INITIAL_CAMPAIGNS = [];
export const INITIAL_CUSTOMER_SEGMENTS = [];
export const INITIAL_SENTIMENT_DATA = {
  overall: { positive: 0, neutral: 0, negative: 0 },
  trend: [],
  comments: []
};
export const INITIAL_RECOMMENDATIONS = [];
export const INITIAL_COMPETITORS = [];
export const INITIAL_FEEDBACKS = [];
export const INITIAL_ANALYTICS = {
  summary: {
    totalReach: "0",
    impressions: "0",
    engagementRate: "0.0%",
    totalClicks: "0",
    conversions: "0",
    conversionRate: "0.0%",
    ctr: "0.0%",
    totalSpend: "$0",
    costPerAcquisition: "$0.00"
  },
  monthlyData: [],
  platformBreakdown: []
};

// Integration Service Placeholders for Future AI/ML Developers
export const aiService = {
  async generateMarketingContent(params) {
    return {
      status: "not_implemented",
      message: "AI content generation module not connected yet. Integration point ready for future AI developer."
    };
  },
  async analyzeSentiment(feedbackList) {
    return {
      status: "not_implemented",
      message: "Sentiment AI analysis engine not connected yet."
    };
  },
  async predictCampaign(campaignParams) {
    return {
      status: "not_implemented",
      message: "Campaign prediction ML model not connected yet."
    };
  },
  async generateRecommendations(profile) {
    return {
      status: "not_implemented",
      message: "Recommendation engine not connected yet."
    };
  }
};
