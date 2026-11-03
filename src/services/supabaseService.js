/**
 * Supabase Integration Service
 * Manages database persistence for Auth, Startup Profile, Campaigns, Competitors, and Audiences.
 * Gracefully falls back to local storage if Supabase environment variables are missing.
 */

import { supabase, isSupabaseConfigured } from '../utils/supabaseClient';
import { storageUtils } from '../utils/storageUtils';

const isUuid = (str) => typeof str === 'string' && /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(str);

export const dbService = {
  isConfigured: isSupabaseConfigured,

  // --------------------------------------------------------
  // AUTHENTICATION
  // --------------------------------------------------------
  async signUp(email, password, fullName) {
    if (!isSupabaseConfigured) {
      return { user: storageUtils.getAuthUser(), error: null };
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName }
      }
    });
    return { data, error };
  },

  async signIn(email, password) {
    if (!isSupabaseConfigured) {
      return { user: storageUtils.getAuthUser(), error: null };
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  },

  async signOut() {
    if (!isSupabaseConfigured) {
      storageUtils.saveAuthUser(null);
      return { error: null };
    }
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async getCurrentSession() {
    if (!isSupabaseConfigured) return null;
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },

  // --------------------------------------------------------
  // STARTUP PROFILE DB OPERATIONS
  // --------------------------------------------------------
  async getStartupProfile(userId) {
    if (!isSupabaseConfigured || !isUuid(userId)) {
      return storageUtils.getStartupProfile();
    }
    const { data, error } = await supabase
      .from('startup_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching startup profile from Supabase:', error);
    }
    return data || storageUtils.getStartupProfile();
  },

  async saveStartupProfile(userId, profileData) {
    storageUtils.saveStartupProfile(profileData);

    if (!isSupabaseConfigured || !isUuid(userId)) return profileData;

    const payload = {
      user_id: userId,
      name: profileData.name || '',
      tagline: profileData.tagline || '',
      industry: profileData.industry || '',
      stage: profileData.stage || '',
      budget: profileData.budget || 0,
      brand_tone: profileData.brandTone || profileData.brand_tone || 'Professional',
      target_location: profileData.targetLocation || profileData.target_location || '',
      website: profileData.website || '',
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('startup_profiles')
      .upsert(payload, { onConflict: 'user_id' })
      .select()
      .single();

    if (error) {
      console.error('Error saving startup profile to Supabase:', error);
    }
    return data || profileData;
  },

  // --------------------------------------------------------
  // CAMPAIGNS DB OPERATIONS
  // --------------------------------------------------------
  async getCampaigns(userId) {
    if (!isSupabaseConfigured || !isUuid(userId)) {
      return storageUtils.getCampaigns();
    }
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching campaigns from Supabase:', error);
      return storageUtils.getCampaigns();
    }
    return data || [];
  },

  async saveCampaign(userId, campaign) {
    const campaignId = isUuid(campaign.id) ? campaign.id : crypto.randomUUID();
    const formattedCampaign = { ...campaign, id: campaignId };

    const existing = storageUtils.getCampaigns();
    const updated = [formattedCampaign, ...existing.filter(c => c.id !== campaignId)];
    storageUtils.saveCampaigns(updated);

    if (!isSupabaseConfigured || !isUuid(userId)) return formattedCampaign;

    const payload = {
      id: campaignId,
      user_id: userId,
      name: campaign.name || 'Untitled Campaign',
      objective: campaign.objective || 'Brand Awareness',
      status: campaign.status || 'Draft',
      platform: campaign.platform || 'LinkedIn',
      budget: Number(campaign.budget) || 0,
      target_audience: campaign.targetAudience || campaign.target_audience || '',
      duration_days: Number(campaign.durationDays || campaign.duration_days) || 30,
      metrics: campaign.metrics || {}
    };

    const { data, error } = await supabase
      .from('campaigns')
      .upsert(payload)
      .select()
      .single();

    if (error) {
      console.error('Error saving campaign to Supabase:', error);
      return formattedCampaign;
    }

    const result = {
      id: data.id,
      name: data.name,
      objective: data.objective,
      status: data.status,
      platform: data.platform,
      budget: data.budget,
      targetAudience: data.target_audience,
      durationDays: data.duration_days,
      metrics: data.metrics,
      createdAt: data.created_at
    };

    return result;
  },

  async deleteCampaign(userId, campaignId) {
    const existing = storageUtils.getCampaigns();
    storageUtils.saveCampaigns(existing.filter(c => c.id !== campaignId));

    if (!isSupabaseConfigured || !isUuid(userId) || !isUuid(campaignId)) return;

    const { error } = await supabase
      .from('campaigns')
      .delete()
      .eq('id', campaignId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error deleting campaign from Supabase:', error);
    }
  }
};
