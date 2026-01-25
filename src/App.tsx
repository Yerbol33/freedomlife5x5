import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from '@/contexts/AppContext';
import { FullScreenLoader } from '@/components/ui/Loader';
import { LanguageSelectScreen } from '@/screens/LanguageSelectScreen';
import { RegistrationScreen } from '@/screens/RegistrationScreen';
import { CabinetScreen } from '@/screens/CabinetScreen';
import { ReportScreen } from '@/screens/ReportScreen';
import { TeamScreen } from '@/screens/TeamScreen';
import { StudentDetailScreen } from '@/screens/StudentDetailScreen';
import { StatsScreen } from '@/screens/StatsScreen';
import { SettingsScreen } from '@/screens/SettingsScreen';

type AppScreen = 'loading' | 'language' | 'registration' | 'main';

function AppContent() {
  const { isLoading, isInitialized, profile, telegramId } = useApp();
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('loading');
  const [languageSelected, setLanguageSelected] = useState(false);

  useEffect(() => {
    if (!isInitialized) {
      setCurrentScreen('loading');
      return;
    }

    // Check if language was already selected (from localStorage)
    const savedLang = localStorage.getItem('freedom_life_language');
    
    if (profile) {
      // User is registered, go to main app
      setCurrentScreen('main');
    } else if (!savedLang && !languageSelected) {
      // First time user, show language selection
      setCurrentScreen('language');
    } else {
      // Language selected but not registered
      setCurrentScreen('registration');
    }
  }, [isInitialized, profile, languageSelected]);

  if (isLoading && !isInitialized) {
    return <FullScreenLoader />;
  }

  if (currentScreen === 'language') {
    return (
      <LanguageSelectScreen 
        onComplete={() => {
          setLanguageSelected(true);
          setCurrentScreen('registration');
        }} 
      />
    );
  }

  if (currentScreen === 'registration') {
    return (
      <RegistrationScreen 
        onSuccess={() => setCurrentScreen('main')}
        onBack={() => {
          setLanguageSelected(false);
          setCurrentScreen('language');
        }}
      />
    );
  }

  // Main app with routing
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/cabinet" replace />} />
      <Route path="/cabinet" element={<CabinetScreen />} />
      <Route path="/report" element={<ReportScreen />} />
      <Route path="/team" element={<TeamScreen />} />
      <Route path="/student/:studentId" element={<StudentDetailScreen />} />
      <Route path="/stats" element={<StatsScreen />} />
      <Route path="/settings" element={<SettingsScreen />} />
      <Route path="*" element={<Navigate to="/cabinet" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
