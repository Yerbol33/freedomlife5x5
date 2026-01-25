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
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm animate-fade-in">
        {/* Logo / Brand */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
            <span className="text-4xl">🚀</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Freedom Life 5×5</h1>
          <p className="text-muted-foreground">{t('select_language', language)}</p>
        </div>

        {/* Language buttons */}
        <div className="space-y-3">
          <button
            onClick={() => handleSelectLanguage('ru')}
            className="w-full p-4 rounded-xl bg-card border border-border hover:border-primary/50 hover:bg-primary/5 transition-all flex items-center gap-4 group"
          >
            <span className="text-3xl">🇷🇺</span>
            <div className="text-left">
              <div className="font-semibold text-foreground group-hover:text-primary transition-colors">
                Русский
              </div>
              <div className="text-sm text-muted-foreground">Russian</div>
            </div>
          </button>

          <button
            onClick={() => handleSelectLanguage('kk')}
            className="w-full p-4 rounded-xl bg-card border border-border hover:border-primary/50 hover:bg-primary/5 transition-all flex items-center gap-4 group"
          >
            <span className="text-3xl">🇰🇿</span>
            <div className="text-left">
              <div className="font-semibold text-foreground group-hover:text-primary transition-colors">
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
