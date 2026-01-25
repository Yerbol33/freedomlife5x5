import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { t, Language } from '@/lib/translations';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { hapticFeedback } from '@/lib/telegram';
import { Check, Globe, User, Sparkles } from 'lucide-react';

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
          <div className="card-premium rounded-2xl p-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center">
                <User className="w-7 h-7 text-gold" />
              </div>
              <div>
                <div className="font-semibold text-foreground">{profile.full_name}</div>
                <div className="text-sm text-gold">#{profile.agent_number}</div>
              </div>
            </div>
          </div>
        )}

        {/* Language Settings */}
        <div className="card-premium rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-border/50 flex items-center gap-3">
            <Globe className="w-5 h-5 text-gold" />
            <h3 className="font-semibold text-foreground">{t('change_language', language)}</h3>
          </div>
          <div className="divide-y divide-border/50">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                disabled={isUpdating}
                className="w-full p-4 flex items-center justify-between hover:bg-gold/5 transition-colors disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <span className="text-foreground">{lang.label}</span>
                  <span className="text-sm text-muted-foreground">{lang.sublabel}</span>
                </div>
                {language === lang.code && (
                  <div className="w-6 h-6 rounded-full bg-gold flex items-center justify-center">
                    <Check className="w-4 h-4 text-background" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* App Info */}
        <div className="text-center py-6">
          <div className="inline-flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-gold" />
            <span className="font-display text-lg text-gold">Freedom Life 5×5</span>
          </div>
          <div className="text-sm text-muted-foreground">v1.0</div>
        </div>
      </div>
    </AppLayout>
  );
}
