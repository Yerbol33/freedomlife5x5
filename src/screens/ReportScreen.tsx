import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { t } from '@/lib/translations';
import { PageHeader } from '@/components/layout/PageHeader';
import { Loader } from '@/components/ui/Loader';
import { submitDailyReport, FormField } from '@/lib/api';
import { hapticFeedback } from '@/lib/telegram';
import { CheckCircle } from 'lucide-react';

export function ReportScreen() {
  const { language, profile, telegramId, refreshProfile } = useApp();
  const navigate = useNavigate();
  
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Default form schema if not provided by backend
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
        
        // Refresh profile after short delay
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
          <label key={field.id} className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border cursor-pointer hover:bg-secondary/30 transition-colors">
            <input
              type="checkbox"
              checked={!!answers[field.id]}
              onChange={(e) => handleFieldChange(field.id, e.target.checked)}
              className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
            />
            <span className="text-foreground">{field.label}</span>
          </label>
        );

      case 'textarea':
        return (
          <div key={field.id}>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              {field.label}
            </label>
            <textarea
              value={String(answers[field.id] || '')}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-xl bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
            />
          </div>
        );

      case 'text':
        return (
          <div key={field.id}>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              {field.label}
            </label>
            <input
              type="text"
              value={String(answers[field.id] || '')}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            />
          </div>
        );

      case 'number':
        return (
          <div key={field.id}>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              {field.label}
            </label>
            <input
              type="number"
              value={String(answers[field.id] || '')}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            />
          </div>
        );

      case 'select':
        return (
          <div key={field.id}>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              {field.label}
            </label>
            <select
              value={String(answers[field.id] || '')}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
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
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center animate-fade-in">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-success/10 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-success" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">{t('report_submitted', language)}</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHeader 
        title={t('daily_report', language)} 
        showBack 
        onBack={() => navigate('/cabinet')} 
      />

      <div className="p-4 animate-fade-in">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Day indicator */}
          <div className="text-center py-4">
            <div className="text-sm text-muted-foreground">{t('day_of_program', language)}</div>
            <div className="text-2xl font-bold text-primary">{profile?.day_program || 1}</div>
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
            className="w-full py-4 rounded-xl btn-gradient font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all hover:opacity-90"
          >
            {isSubmitting ? (
              <>
                <Loader size="sm" className="border-white/30 border-t-white" />
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
