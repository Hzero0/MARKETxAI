import React, { createContext, useContext, useState, useEffect } from 'react';
import { storageUtils } from '../utils/storageUtils';
import { EMPTY_STARTUP_PROFILE } from '../services/mockData';
import { mongoService } from '../services/mongoService';
import { useAuth } from './AuthContext';

const StartupContext = createContext(null);

export const StartupProvider = ({ children }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(() => storageUtils.getStartupProfile());

  const userId = user?.id || 'usr-demo-01';

  useEffect(() => {
    let isMounted = true;
    const fetchDbProfile = async () => {
      if (!userId) return;
      try {
        const dbProfile = await mongoService.getStartupProfile(userId);
        if (isMounted && dbProfile && dbProfile.userId) {
          const formatted = {
            name: dbProfile.name || profile.name || '',
            tagline: dbProfile.tagline || profile.tagline || '',
            industry: dbProfile.industry || profile.industry || '',
            stage: dbProfile.stage || profile.stage || '',
            budget: dbProfile.budget || profile.budget || 0,
            brandTone: dbProfile.brand_tone || dbProfile.brandTone || profile.brandTone || 'Professional',
            targetLocation: dbProfile.target_location || dbProfile.targetLocation || profile.targetLocation || '',
            website: dbProfile.website || profile.website || ''
          };
          setProfile(formatted);
          storageUtils.saveStartupProfile(formatted);
        }
      } catch (err) {
        console.error("Error fetching startup profile from MongoDB:", err);
      }
    };

    fetchDbProfile();
    return () => { isMounted = false; };
  }, [userId]);

  const updateProfile = async (updatedData) => {
    const newProfile = { ...profile, ...updatedData };
    setProfile(newProfile);
    storageUtils.saveStartupProfile(newProfile);

    if (userId) {
      try {
        await mongoService.saveStartupProfile(userId, newProfile);
      } catch (err) {
        console.error("Error saving startup profile to MongoDB:", err);
      }
    }
    return newProfile;
  };

  const resetProfile = async () => {
    setProfile(EMPTY_STARTUP_PROFILE);
    storageUtils.saveStartupProfile(EMPTY_STARTUP_PROFILE);
    if (userId) {
      try {
        await mongoService.saveStartupProfile(userId, EMPTY_STARTUP_PROFILE);
      } catch (err) {
        console.error("Error resetting profile in MongoDB:", err);
      }
    }
    return EMPTY_STARTUP_PROFILE;
  };

  return (
    <StartupContext.Provider
      value={{
        profile,
        updateProfile,
        resetProfile
      }}
    >
      {children}
    </StartupContext.Provider>
  );
};

export const useStartup = () => {
  const context = useContext(StartupContext);
  if (!context) {
    throw new Error('useStartup must be used within StartupProvider');
  }
  return context;
};

