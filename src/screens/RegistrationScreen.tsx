import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { t, TranslationKey } from '@/lib/translations';
import { registerAgent, RegisterRequest, getProfile } from '@/lib/api';
import { hapticFeedback } from '@/lib/telegram';
import { Loader } from '@/components/ui/Loader';
import { ChevronLeft } from 'lucide-react';

interface RegistrationScreenProps {
  onSuccess: () => void;
  onBack: () => void;
}

export function RegistrationScreen({ onSuccess, onBack }: RegistrationScreenProps) {
  const { language, telegramId, setProfile } = useApp();
  
  const [formData, setFormData] = useState({
    agent_number: '',
    mentor_number: '',
    full_name: '',
    phone: '',
    goal: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.agent_number.trim()) {
      newErrors.agent_number = t('field_required', language);
    }
    if (!formData.mentor_number.trim()) {
      newErrors.mentor_number = t('field_required', language);
    }
    if (!formData.full_name.trim()) {
      newErrors.full_name = t('field_required', language);
    }
    if (!formData.phone.trim()) {
      newErrors.phone = t('field_required', language);
    }
    if (!formData.goal.trim()) {
      newErrors.goal = t('field_required', language);
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !telegramId) {
      hapticFeedback('error');
      return;
    }

    setIsSubmitting(true);
    setApiError(null);

    try {
      const requestData: RegisterRequest = {
        telegram_id: telegramId,
        agent_number: formData.agent_number.trim(),
        mentor_number: formData.mentor_number.trim(),
        full_name: formData.full_name.trim(),
        phone: formData.phone.trim(),
        goal: formData.goal.trim(),
        language,
      };

      const response = await registerAgent(requestData);

      if (response.status === 'success') {
        hapticFeedback('success');
        
        // Fetch updated profile
        const profile = await getProfile({ telegram_id: telegramId });
        if (profile) {
          setProfile(profile);
        }
        
        onSuccess();
      } else {
        hapticFeedback('error');
        // Try to translate error reason
        const reason = response.reason || 'invalid_data';
        const translatedError = t(reason as TranslationKey, language);
        setApiError(translatedError !== reason ? translatedError : reason);
      }
    } catch {
      hapticFeedback('error');
      setApiError(t('network_error', language));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center h-14 px-4">
          <button
            onClick={onBack}
            className="p-1 -ml-1 text-primary hover:text-primary/80 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold ml-2">{t('registration', language)}</h1>
        </div>
      </header>

      <div className="p-4 animate-fade-in">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Agent Number */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              {t('agent_number', language)}
            </label>
            <input
              type="text"
              value={formData.agent_number}
              onChange={(e) => handleInputChange('agent_number', e.target.value)}
              placeholder={t('agent_number_placeholder', language)}
              className="w-full px-4 py-3 rounded-xl bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            />
            {errors.agent_number && (
              <p className="mt-1 text-sm text-destructive">{errors.agent_number}</p>
            )}
          </div>

          {/* Mentor Number */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              {t('mentor_number', language)}
            </label>
            <input
              type="text"
              value={formData.mentor_number}
              onChange={(e) => handleInputChange('mentor_number', e.target.value)}
              placeholder={t('mentor_number_placeholder', language)}
              className="w-full px-4 py-3 rounded-xl bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            />
            {errors.mentor_number && (
              <p className="mt-1 text-sm text-destructive">{errors.mentor_number}</p>
            )}
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              {t('full_name', language)}
            </label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) => handleInputChange('full_name', e.target.value)}
              placeholder={t('full_name_placeholder', language)}
              className="w-full px-4 py-3 rounded-xl bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            />
            {errors.full_name && (
              <p className="mt-1 text-sm text-destructive">{errors.full_name}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              {t('phone', language)}
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder={t('phone_placeholder', language)}
              className="w-full px-4 py-3 rounded-xl bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-destructive">{errors.phone}</p>
            )}
          </div>

          {/* Goal */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              {t('goal', language)}
            </label>
            <input
              type="text"
              value={formData.goal}
              onChange={(e) => handleInputChange('goal', e.target.value)}
              placeholder={t('goal_placeholder', language)}
              className="w-full px-4 py-3 rounded-xl bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            />
            {errors.goal && (
              <p className="mt-1 text-sm text-destructive">{errors.goal}</p>
            )}
          </div>

          {/* API Error */}
          {apiError && (
            <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              {apiError}
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
              t('register', language)
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
