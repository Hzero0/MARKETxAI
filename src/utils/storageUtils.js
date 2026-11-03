/**
 * LocalStorage Manager - Pure Empty Initial Defaults & User Data Persistence
 */

import { EMPTY_STARTUP_PROFILE } from '../services/mockData';

const KEYS = {
  STARTUP: "ai_marketing_startup_profile",
  CAMPAIGNS: "ai_marketing_campaigns",
  COMPETITORS: "ai_marketing_competitors",
  FEEDBACKS: "ai_marketing_feedbacks",
  SAVED_CONTENT: "ai_marketing_saved_content",
  TARGET_AUDIENCE: "ai_marketing_target_audience",
  SETTINGS: "ai_marketing_settings",
  AUTH: "ai_marketing_auth"
};

export const storageUtils = {
  // Startup Profile
  getStartupProfile() {
    try {
      const data = localStorage.getItem(KEYS.STARTUP);
      return data ? JSON.parse(data) : EMPTY_STARTUP_PROFILE;
    } catch (e) {
      return EMPTY_STARTUP_PROFILE;
    }
  },
  saveStartupProfile(profile) {
    localStorage.setItem(KEYS.STARTUP, JSON.stringify(profile));
  },

  // Campaigns
  getCampaigns() {
    try {
      const data = localStorage.getItem(KEYS.CAMPAIGNS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },
  saveCampaigns(campaigns) {
    localStorage.setItem(KEYS.CAMPAIGNS, JSON.stringify(campaigns));
  },

  // Competitors
  getCompetitors() {
    try {
      const data = localStorage.getItem(KEYS.COMPETITORS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },
  saveCompetitors(competitors) {
    localStorage.setItem(KEYS.COMPETITORS, JSON.stringify(competitors));
  },

  // Target Audience Segments (User Defined)
  getAudienceSegments() {
    try {
      const data = localStorage.getItem(KEYS.TARGET_AUDIENCE);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },
  saveAudienceSegments(segments) {
    localStorage.setItem(KEYS.TARGET_AUDIENCE, JSON.stringify(segments));
  },

  // Feedbacks
  getFeedbacks() {
    try {
      const data = localStorage.getItem(KEYS.FEEDBACKS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },
  saveFeedbacks(feedbacks) {
    localStorage.setItem(KEYS.FEEDBACKS, JSON.stringify(feedbacks));
  },

  // Saved Content
  getSavedContent() {
    try {
      const data = localStorage.getItem(KEYS.SAVED_CONTENT);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },
  saveSavedContent(contentList) {
    localStorage.setItem(KEYS.SAVED_CONTENT, JSON.stringify(contentList));
  },

  // Auth User
  getAuthUser() {
    try {
      const data = localStorage.getItem(KEYS.AUTH);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },
  saveAuthUser(user) {
    if (!user) {
      localStorage.removeItem(KEYS.AUTH);
    } else {
      localStorage.setItem(KEYS.AUTH, JSON.stringify(user));
    }
  },

  // Clear all user-entered data
  clearAllUserData() {
    localStorage.removeItem(KEYS.STARTUP);
    localStorage.removeItem(KEYS.CAMPAIGNS);
    localStorage.removeItem(KEYS.COMPETITORS);
    localStorage.removeItem(KEYS.FEEDBACKS);
    localStorage.removeItem(KEYS.SAVED_CONTENT);
    localStorage.removeItem(KEYS.TARGET_AUDIENCE);
  }
};
