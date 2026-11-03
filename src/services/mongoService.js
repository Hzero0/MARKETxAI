/**
 * MongoDB Integration Service
 * Communicates with the Express Node/MongoDB backend server (http://localhost:5000/api)
 */

import { storageUtils } from '../utils/storageUtils';

export const mongoService = {
  // Check if Express backend is running
  async checkHealth() {
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        const data = await res.json();
        return data.status === 'ok';
      }
      return false;
    } catch {
      return false;
    }
  },

  // --------------------------------------------------------
  // AUTHENTICATION
  // --------------------------------------------------------
  async register(name, email, password) {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      return data;
    } catch (err) {
      console.warn('MongoDB Backend offline, falling back to client auth:', err.message);
      return null;
    }
  },

  async login(email, password) {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      return data;
    } catch (err) {
      console.warn('MongoDB Backend offline, falling back to client auth:', err.message);
      return null;
    }
  },

  // --------------------------------------------------------
  // STARTUP PROFILE DB OPERATIONS
  // --------------------------------------------------------
  async getStartupProfile(userId) {
    try {
      const res = await fetch(`/api/startup/${userId}`);
      if (res.ok) {
        const data = await res.json();
        return data.userId ? data : storageUtils.getStartupProfile();
      }
    } catch (err) {
      console.warn('Error fetching profile from MongoDB:', err.message);
    }
    return storageUtils.getStartupProfile();
  },

  async saveStartupProfile(userId, profileData) {
    storageUtils.saveStartupProfile(profileData);
    try {
      const res = await fetch('/api/startup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...profileData })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('Error saving profile to MongoDB:', err.message);
    }
    return profileData;
  },

  // --------------------------------------------------------
  // CAMPAIGNS DB OPERATIONS
  // --------------------------------------------------------
  async getCampaigns(userId) {
    try {
      console.log(`📡 mongoService.getCampaigns fetching GET /api/campaigns/${userId}`);
      const res = await fetch(`/api/campaigns/${userId}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          console.log(`✅ mongoService.getCampaigns received ${data.length} items from MongoDB`);
          return data;
        }
      } else {
        console.error(`❌ mongoService.getCampaigns HTTP error status: ${res.status}`);
      }
    } catch (err) {
      console.error('❌ Error fetching campaigns from MongoDB backend:', err.message);
    }
    return storageUtils.getCampaigns();
  },

  async saveCampaign(userId, campaign) {
    try {
      console.log('📡 mongoService.saveCampaign sending request to POST /api/campaigns:', { userId, ...campaign });
      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...campaign })
      });
      if (res.ok) {
        const saved = await res.json();
        console.log('✅ mongoService.saveCampaign received response from server:', saved);
        return saved;
      } else {
        const errorData = await res.json().catch(() => ({}));
        console.error('❌ mongoService.saveCampaign failed with status:', res.status, errorData);
        throw new Error(errorData.error || `HTTP error ${res.status}`);
      }
    } catch (err) {
      console.error('❌ mongoService.saveCampaign exception:', err.message);
      throw err;
    }
  },

  async deleteCampaign(campaignId) {
    try {
      console.log(`📡 mongoService.deleteCampaign sending request to DELETE /api/campaigns/${campaignId}`);
      const res = await fetch(`/api/campaigns/${campaignId}`, { method: 'DELETE' });
      if (res.ok) {
        const data = await res.json();
        console.log(`✅ mongoService.deleteCampaign deleted ${campaignId} from MongoDB`);
        return data;
      } else {
        console.error(`❌ mongoService.deleteCampaign HTTP error status: ${res.status}`);
      }
    } catch (err) {
      console.error('❌ mongoService.deleteCampaign exception:', err.message);
      throw err;
    }
  }
};
