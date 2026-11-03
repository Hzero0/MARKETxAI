import React, { createContext, useContext, useState, useEffect } from 'react';
import { storageUtils } from '../utils/storageUtils';
import { mongoService } from '../services/mongoService';
import { useAuth } from './AuthContext';

const CampaignContext = createContext(null);

export const CampaignProvider = ({ children }) => {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState(() => storageUtils.getCampaigns());
  const [loading, setLoading] = useState(false);

  const userId = user?.id || 'usr-demo-01';

  // Sync campaigns from MongoDB when user logs in or mounts
  useEffect(() => {
    let isMounted = true;
    const loadDbCampaigns = async () => {
      if (!userId) return;
      setLoading(true);
      try {
        console.log(`📡 CampaignContext loading campaigns from MongoDB for user: ${userId}`);
        const dbCampaigns = await mongoService.getCampaigns(userId);
        if (isMounted && Array.isArray(dbCampaigns)) {
          const formatted = dbCampaigns.map(c => ({
            id: c.id || c._id,
            _id: c._id || c.id,
            name: c.name || 'Untitled Campaign',
            product: c.product || '',
            objective: c.objective || 'Brand Awareness',
            status: c.status || 'Draft',
            platform: c.platform || (Array.isArray(c.platforms) && c.platforms.length > 0 ? c.platforms[0] : 'LinkedIn'),
            platforms: c.platforms || (c.platform ? [c.platform] : ['LinkedIn']),
            budget: c.budget || 0,
            targetAudience: c.targetAudience || c.target_audience || '',
            durationDays: c.durationDays || c.duration_days || 30,
            metrics: c.metrics || { reach: 0, impressions: 0, clicks: 0, conversions: 0 },
            description: c.description || '',
            startDate: c.startDate || '',
            endDate: c.endDate || '',
            createdAt: c.createdAt || c.created_at || new Date().toISOString()
          }));
          setCampaigns(formatted);
          storageUtils.saveCampaigns(formatted);
          console.log(`✅ CampaignContext set ${formatted.length} campaigns from MongoDB`);
        }
      } catch (err) {
        console.error("❌ Error loading campaigns from MongoDB:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadDbCampaigns();
    return () => { isMounted = false; };
  }, [userId]);

  const addCampaign = async (newCamp) => {
    const tempId = crypto.randomUUID();
    const createdObj = {
      id: tempId,
      status: newCamp.status || "Draft",
      metrics: newCamp.metrics || { reach: 0, impressions: 0, clicks: 0, conversions: 0 },
      createdAt: new Date().toISOString(),
      ...newCamp
    };

    // Immediate UI update & local storage update
    const updated = [createdObj, ...campaigns.filter(c => c.id !== createdObj.id)];
    setCampaigns(updated);

    // Sync with MongoDB DB
    try {
      const saved = await mongoService.saveCampaign(userId, createdObj);
      if (saved && (saved.id || saved._id)) {
        const formattedSaved = {
          ...createdObj,
          ...saved,
          id: saved.id || saved._id,
          _id: saved._id || saved.id,
          platforms: saved.platforms || (saved.platform ? [saved.platform] : createdObj.platforms || ['LinkedIn'])
        };
        const syncedList = [formattedSaved, ...campaigns.filter(c => c.id !== tempId && c.id !== formattedSaved.id)];
        setCampaigns(syncedList);
        storageUtils.saveCampaigns(syncedList);
        return formattedSaved;
      }
    } catch (err) {
      console.error("❌ Error syncing new campaign to MongoDB:", err);
    }

    storageUtils.saveCampaigns(updated);
    return createdObj;
  };

  const updateCampaign = async (id, updatedFields) => {
    const target = campaigns.find(c => c.id === id || c._id === id);
    if (!target) return;
    const merged = { ...target, ...updatedFields, id, _id: target._id || id };

    const updated = campaigns.map((c) => ((c.id === id || c._id === id) ? merged : c));
    setCampaigns(updated);
    storageUtils.saveCampaigns(updated);

    try {
      const saved = await mongoService.saveCampaign(userId, merged);
      if (saved && (saved.id || saved._id)) {
        const finalObj = { ...merged, ...saved, id: saved.id || saved._id, _id: saved._id || saved.id };
        const finalUpdated = campaigns.map((c) => ((c.id === id || c._id === id) ? finalObj : c));
        setCampaigns(finalUpdated);
        storageUtils.saveCampaigns(finalUpdated);
      }
    } catch (err) {
      console.error("❌ Error updating campaign in MongoDB:", err);
    }
  };

  const deleteCampaign = async (id) => {
    const updated = campaigns.filter((c) => c.id !== id && c._id !== id);
    setCampaigns(updated);
    storageUtils.saveCampaigns(updated);

    try {
      await mongoService.deleteCampaign(id);
    } catch (err) {
      console.error("❌ Error deleting campaign from MongoDB:", err);
    }
  };

  const duplicateCampaign = async (id) => {
    const original = campaigns.find((c) => c.id === id || c._id === id);
    if (!original) return;

    const copy = {
      ...original,
      id: undefined,
      _id: undefined,
      name: `${original.name} (Copy)`,
      status: "Draft",
      createdAt: new Date().toISOString()
    };
    return await addCampaign(copy);
  };

  return (
    <CampaignContext.Provider
      value={{
        campaigns,
        loading,
        addCampaign,
        updateCampaign,
        deleteCampaign,
        duplicateCampaign
      }}
    >
      {children}
    </CampaignContext.Provider>
  );
};

export const useCampaigns = () => {
  const context = useContext(CampaignContext);
  if (!context) {
    throw new Error('useCampaigns must be used within CampaignProvider');
  }
  return context;
};

