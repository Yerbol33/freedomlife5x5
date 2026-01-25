import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { t, Language } from '@/lib/translations';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { hapticFeedback } from '@/lib/telegram';
import { Check, Globe } from 'lucide-react';

export function SettingsScreen() {
  const { language, updateLanguage, profile } = useApp();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleLanguageChange = async (newLang: Language) => {
    if (newLang === language || isUpdating) return;
    
    hapticFeedback('medium');
    setIsUpdating(true);
    
    try {
      await updateLanguage(newLang);
      hapticFeedback('success');
    } catch {
      hapticFeedback('error');
    } finally {
      setIsUpdating(false);
    }
  };

  const languages = [
    { code: 'ru' as Language, label: '🇷🇺 Русский', sublabel: 'Russian' },
    { code: 'kk' as Language, label: '🇰🇿 Қазақша', sublabel: 'Kazakh' },
  ];

  return (
    <AppLayout>
      <PageHeader title={t('settings', language)} />

      <div className="p-4 space-y-4 animate-fade-in">
        {/* Profile Info */}
        {profile && (
          <div className="card-gradient rounded-2xl p-4 border border-border">
            <div className="font-semibold text-foreground">{profile.full_name}</div>
            <div className="text-sm text-muted-foreground mt-1">
              #{profile.agent_number}
            </div>
          </div>
        )}

        {/* Language Settings */}
        <div className="rounded-2xl border border-border overflow-hidden">
          <div className="p-4 bg-card border-b border-border flex items-center gap-3">
            <Globe className="w-5 h-5 text-muted-foreground" />
            <h3 className="font-semibold text-foreground">{t('change_language', language)}</h3>
          </div>
          <div className="divide-y divide-border">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                disabled={isUpdating}
                className="w-full p-4 flex items-center justify-between hover:bg-secondary/30 transition-colors disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <span className="text-foreground">{lang.label}</span>
                  <span className="text-sm text-muted-foreground">{lang.sublabel}</span>
                </div>
                {language === lang.code && (
                  <Check className="w-5 h-5 text-primary" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* App Info */}
        <div className="text-center text-sm text-muted-foreground py-4">
          Freedom Life 5×5 v1.0
        </div>
      </div>
    </AppLayout>
  );
}
