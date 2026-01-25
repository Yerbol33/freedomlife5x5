import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Language } from '@/lib/translations';
import { UserProfile, getProfile, updateLanguage as apiUpdateLanguage } from '@/lib/api';
import { getTelegramUserId, initTelegramWebApp } from '@/lib/telegram';

interface AppState {
  telegramId: string | null;
  language: Language;
  profile: UserProfile | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
}

interface AppContextType extends AppState {
  setLanguage: (lang: Language) => void;
  setProfile: (profile: UserProfile | null) => void;
  refreshProfile: () => Promise<void>;
  updateLanguage: (newLang: Language) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'freedom_life_language';
const PROFILE_CACHE_KEY = 'freedom_life_profile_cache';

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>({
    telegramId: null,
    language: 'ru',
    profile: null,
    isLoading: true,
    isInitialized: false,
    error: null,
  });

  // Initialize app
  useEffect(() => {
    const init = async () => {
      // Initialize Telegram WebApp
      initTelegramWebApp();
      
      // Get Telegram user ID
      const telegramId = getTelegramUserId();
      
      // Get cached language
      const cachedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language | null;
      
      // Get cached profile
      let cachedProfile: UserProfile | null = null;
      try {
        const cached = localStorage.getItem(PROFILE_CACHE_KEY);
        if (cached) {
          cachedProfile = JSON.parse(cached);
        }
      } catch {
        // Ignore parse errors
      }

      setState(prev => ({
        ...prev,
        telegramId,
        language: cachedLanguage || cachedProfile?.language || 'ru',
        profile: cachedProfile,
        isLoading: !!telegramId,
      }));

      // Fetch fresh profile if we have telegram_id
      if (telegramId) {
        try {
          const profile = await getProfile({ telegram_id: telegramId });
          
          if (profile) {
            localStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(profile));
            localStorage.setItem(LANGUAGE_STORAGE_KEY, profile.language);
          }
          
          setState(prev => ({
            ...prev,
            profile,
            language: profile?.language || prev.language,
            isLoading: false,
            isInitialized: true,
          }));
        } catch {
          setState(prev => ({
            ...prev,
            isLoading: false,
            isInitialized: true,
            error: 'network_error',
          }));
        }
      } else {
        setState(prev => ({
          ...prev,
          isLoading: false,
          isInitialized: true,
        }));
      }
    };

    init();
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    setState(prev => ({ ...prev, language: lang }));
  }, []);

  const setProfile = useCallback((profile: UserProfile | null) => {
    if (profile) {
      localStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(profile));
      localStorage.setItem(LANGUAGE_STORAGE_KEY, profile.language);
    } else {
      localStorage.removeItem(PROFILE_CACHE_KEY);
    }
    setState(prev => ({ 
      ...prev, 
      profile,
      language: profile?.language || prev.language,
    }));
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!state.telegramId) return;
    
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const profile = await getProfile({ telegram_id: state.telegramId });
      
      if (profile) {
        localStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(profile));
        localStorage.setItem(LANGUAGE_STORAGE_KEY, profile.language);
      }
      
      setState(prev => ({
        ...prev,
        profile,
        language: profile?.language || prev.language,
        isLoading: false,
      }));
    } catch {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'network_error',
      }));
    }
  }, [state.telegramId]);

  const updateLanguageHandler = useCallback(async (newLang: Language) => {
    if (!state.telegramId) {
      setLanguage(newLang);
      return;
    }

    try {
      await apiUpdateLanguage({ telegram_id: state.telegramId, new_language: newLang });
      setLanguage(newLang);
      
      // Update cached profile
      if (state.profile) {
        const updatedProfile = { ...state.profile, language: newLang };
        localStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(updatedProfile));
        setState(prev => ({ ...prev, profile: updatedProfile }));
      }
    } catch {
      // Still update locally even if API fails
      setLanguage(newLang);
    }
  }, [state.telegramId, state.profile, setLanguage]);

  return (
    <AppContext.Provider
      value={{
        ...state,
        setLanguage,
        setProfile,
        refreshProfile,
        updateLanguage: updateLanguageHandler,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
