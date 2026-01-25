import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { t } from '@/lib/translations';
import { PageHeader } from '@/components/layout/PageHeader';
import { Loader } from '@/components/ui/Loader';
import { submitDailyReport, FormField } from '@/lib/api';
import { hapticFeedback } from '@/lib/telegram';
import { CheckCircle, Sparkles } from 'lucide-react';

export function ReportScreen() {
  const { language, profile, telegramId, refreshProfile } = useApp();
  const navigate = useNavigate();
  
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const defaultFormSchema: FormField[] = [
    { id: 'completed_tasks', type: 'checkbox', label: language === 'ru' ? 'Выполнил все задачи дня' : 'Күнделікті тапсырмаларды орындадым' },
    { id: 'watched_video', type: 'checkbox', label: language === 'ru' ? 'Посмотрел видео урок' : 'Бейне сабақты қарадым' },
    { id: 'notes', type: 'textarea', label: language === 'ru' ? 'Заметки и вопросы' : 'Жазбалар мен сұрақтар' },
  ];

  const formSchema = profile?.form_schema || defaultFormSchema;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!telegramId || !profile) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await submitDailyReport({
        telegram_id: telegramId,
        day_program: profile.day_program,
        answers,
      });

      if (response.status === 'success') {
        hapticFeedback('success');
        setIsSuccess(true);
        
        setTimeout(async () => {
          await refreshProfile();
          navigate('/cabinet');
        }, 2000);
      } else {
        hapticFeedback('error');
        setError(t('report_error', language));
      }
    } catch {
      hapticFeedback('error');
      setError(t('network_error', language));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFieldChange = (fieldId: string, value: unknown) => {
    setAnswers(prev => ({ ...prev, [fieldId]: value }));
  };

  const renderField = (field: FormField) => {
    switch (field.type) {
      case 'checkbox':
        return (
          <label key={field.id} className="flex items-center gap-4 p-4 rounded-xl card-premium cursor-pointer transition-all hover:border-gold/30">
            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
              answers[field.id] ? 'bg-gold border-gold' : 'border-muted-foreground/30'
            }`}>
              {answers[field.id] && <CheckCircle className="w-4 h-4 text-background" />}
            </div>
            <input
              type="checkbox"
              checked={!!answers[field.id]}
              onChange={(e) => handleFieldChange(field.id, e.target.checked)}
              className="sr-only"
            />
            <span className="text-foreground">{field.label}</span>
          </label>
        );

      case 'textarea':
        return (
          <div key={field.id}>
            <label className="block text-sm font-medium text-foreground mb-2">
              {field.label}
            </label>
            <textarea
              value={String(answers[field.id] || '')}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              rows={4}
              className="w-full px-4 py-3.5 rounded-xl bg-card/50 border border-border focus:border-gold/50 focus:ring-1 focus:ring-gold/30 outline-none transition-all resize-none text-foreground placeholder:text-muted-foreground"
            />
          </div>
        );

      case 'text':
        return (
          <div key={field.id}>
            <label className="block text-sm font-medium text-foreground mb-2">
              {field.label}
            </label>
            <input
              type="text"
              value={String(answers[field.id] || '')}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl bg-card/50 border border-border focus:border-gold/50 focus:ring-1 focus:ring-gold/30 outline-none transition-all text-foreground"
            />
          </div>
        );

      case 'number':
        return (
          <div key={field.id}>
            <label className="block text-sm font-medium text-foreground mb-2">
              {field.label}
            </label>
            <input
              type="number"
              value={String(answers[field.id] || '')}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl bg-card/50 border border-border focus:border-gold/50 focus:ring-1 focus:ring-gold/30 outline-none transition-all text-foreground"
            />
          </div>
        );

      case 'select':
        return (
          <div key={field.id}>
            <label className="block text-sm font-medium text-foreground mb-2">
              {field.label}
            </label>
            <select
              value={String(answers[field.id] || '')}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl bg-card/50 border border-border focus:border-gold/50 focus:ring-1 focus:ring-gold/30 outline-none transition-all text-foreground"
            >
              <option value="">--</option>
              {field.options?.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        );

      default:
        return null;
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--gradient-bg)' }}>
        <div className="text-center animate-fade-in">
          <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center glow-gold animate-glow-pulse">
            <CheckCircle className="w-12 h-12 text-gold" />
          </div>
          <h2 className="text-2xl font-display font-bold text-gold mb-2">{t('report_submitted', language)}</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--gradient-bg)' }}>
      <PageHeader 
        title={t('daily_report', language)} 
        showBack 
        onBack={() => navigate('/cabinet')} 
      />

      <div className="p-4 animate-fade-in">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Day indicator */}
          <div className="text-center py-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20">
              <Sparkles className="w-4 h-4 text-gold" />
              <span className="text-sm text-muted-foreground">{t('day_of_program', language)}</span>
              <span className="text-xl font-display font-bold text-gold">{profile?.day_program || 1}</span>
            </div>
          </div>

          {/* Form fields */}
          {formSchema.map(renderField)}

          {/* Error */}
          {error && (
            <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-xl btn-gold font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all mt-6"
          >
            {isSubmitting ? (
              <>
                <Loader size="sm" className="border-background/30 border-t-background" />
                <span>{t('loading', language)}</span>
              </>
            ) : (
              t('submit', language)
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
