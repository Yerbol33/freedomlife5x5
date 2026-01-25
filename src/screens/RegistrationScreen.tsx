import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { t, TranslationKey } from '@/lib/translations';
import { registerAgent, RegisterRequest, getProfile } from '@/lib/api';
import { hapticFeedback } from '@/lib/telegram';
import { Loader } from '@/components/ui/Loader';
import { ChevronLeft, User, Users, Phone, Target, Hash } from 'lucide-react';

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
        
        const profile = await getProfile({ telegram_id: telegramId });
        if (profile) {
          setProfile(profile);
        }
        
        onSuccess();
      } else {
        hapticFeedback('error');
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

  const inputFields: Array<{
    key: keyof typeof formData;
    icon: typeof Hash;
    label: string;
    placeholder: string;
    type?: string;
  }> = [
    { key: 'agent_number', icon: Hash, label: 'agent_number', placeholder: 'agent_number_placeholder' },
    { key: 'mentor_number', icon: Users, label: 'mentor_number', placeholder: 'mentor_number_placeholder' },
    { key: 'full_name', icon: User, label: 'full_name', placeholder: 'full_name_placeholder' },
    { key: 'phone', icon: Phone, label: 'phone', placeholder: 'phone_placeholder', type: 'tel' },
    { key: 'goal', icon: Target, label: 'goal', placeholder: 'goal_placeholder' },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'var(--gradient-bg)' }}>
      {/* Header */}
      <header className="sticky top-0 z-30 glass border-b border-gold/10">
        <div className="flex items-center h-14 px-4">
          <button
            onClick={onBack}
            className="p-1.5 -ml-1.5 rounded-lg text-gold hover:bg-gold/10 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-display font-semibold text-foreground ml-2">
            {t('registration', language)}
          </h1>
        </div>
      </header>

      <div className="p-4 animate-fade-in">
        {/* Brand header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center">
            <span className="text-3xl">🚀</span>
          </div>
          <h2 className="font-display text-xl text-gold">Freedom Life 5×5</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {inputFields.map(({ key, icon: Icon, label, placeholder, type }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <Icon className="w-4 h-4 text-gold/70" />
                {t(label as TranslationKey, language)}
              </label>
              <input
                type={type || 'text'}
                value={formData[key]}
                onChange={(e) => handleInputChange(key, e.target.value)}
                placeholder={t(placeholder as TranslationKey, language)}
                className="w-full px-4 py-3.5 rounded-xl bg-card/50 border border-border focus:border-gold/50 focus:ring-1 focus:ring-gold/30 outline-none transition-all text-foreground placeholder:text-muted-foreground"
              />
              {errors[key] && (
                <p className="mt-1.5 text-sm text-destructive">{errors[key]}</p>
              )}
            </div>
          ))}

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
            className="w-full py-4 rounded-xl btn-gold font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all mt-6"
          >
            {isSubmitting ? (
              <>
                <Loader size="sm" className="border-background/30 border-t-background" />
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
