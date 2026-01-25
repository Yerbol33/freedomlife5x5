import { useApp } from '@/contexts/AppContext';
import { Language, t } from '@/lib/translations';
import { hapticFeedback } from '@/lib/telegram';

interface LanguageSelectScreenProps {
  onComplete: () => void;
}

export function LanguageSelectScreen({ onComplete }: LanguageSelectScreenProps) {
  const { setLanguage, language } = useApp();

  const handleSelectLanguage = (lang: Language) => {
    hapticFeedback('medium');
    setLanguage(lang);
    onComplete();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ background: 'var(--gradient-bg)' }}>
      <div className="w-full max-w-sm animate-fade-in">
        {/* Logo / Brand */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center glow-gold">
            <span className="text-5xl">🚀</span>
          </div>
          <h1 className="text-3xl font-display font-bold text-gold mb-2">Freedom Life 5×5</h1>
          <p className="text-muted-foreground">{t('select_language', language)}</p>
        </div>

        {/* Language buttons */}
        <div className="space-y-4">
          <button
            onClick={() => handleSelectLanguage('ru')}
            className="w-full p-5 rounded-2xl card-premium hover:border-gold/30 transition-all flex items-center gap-4 group"
          >
            <span className="text-4xl">🇷🇺</span>
            <div className="text-left">
              <div className="font-semibold text-lg text-foreground group-hover:text-gold transition-colors">
                Русский
              </div>
              <div className="text-sm text-muted-foreground">Russian</div>
            </div>
          </button>

          <button
            onClick={() => handleSelectLanguage('kk')}
            className="w-full p-5 rounded-2xl card-premium hover:border-gold/30 transition-all flex items-center gap-4 group"
          >
            <span className="text-4xl">🇰🇿</span>
            <div className="text-left">
              <div className="font-semibold text-lg text-foreground group-hover:text-gold transition-colors">
                Қазақша
              </div>
              <div className="text-sm text-muted-foreground">Kazakh</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
