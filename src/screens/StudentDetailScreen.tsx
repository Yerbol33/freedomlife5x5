import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { t, TranslationKey } from '@/lib/translations';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusIndicator } from '@/components/ui/StatusIndicator';
import { openTelegramChat, hapticFeedback } from '@/lib/telegram';
import { MessageCircle, Copy, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ru, kk } from 'date-fns/locale';

export function StudentDetailScreen() {
  const { studentId } = useParams<{ studentId: string }>();
  const { language, profile } = useApp();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const student = profile?.students?.find(s => s.telegram_id === studentId);

  if (!student) {
    return (
      <div className="min-h-screen bg-background">
        <PageHeader title={t('student_details', language)} showBack onBack={() => navigate('/team')} />
        <div className="p-4 text-center text-muted-foreground">
          Student not found
        </div>
      </div>
    );
  }

  const stageLabels: Record<string, TranslationKey> = {
    novice: 'stage_novice',
    mentor: 'stage_mentor',
    leader: 'stage_leader',
    completed: 'stage_completed',
  };

  const formatLastActivity = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return formatDistanceToNow(date, { 
        addSuffix: true, 
        locale: language === 'kk' ? kk : ru 
      });
    } catch {
      return dateStr;
    }
  };

  const handleWriteTelegram = () => {
    hapticFeedback('light');
    openTelegramChat(student.telegram_id);
  };

  const handleCopyMessage = () => {
    const message = language === 'ru' 
      ? `Привет, ${student.full_name}! Как продвигается день ${student.day_program} программы? Есть вопросы?`
      : `Сәлем, ${student.full_name}! ${student.day_program}-күн бағдарламасы қалай өтуде? Сұрақтар бар ма?`;
    
    navigator.clipboard.writeText(message);
    hapticFeedback('success');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Mock daily actions - in real app, this would come from backend
  const dailyActions = profile?.daily_actions || [];

  return (
    <div className="min-h-screen bg-background pb-6">
      <PageHeader 
        title={t('student_details', language)} 
        showBack 
        onBack={() => navigate('/team')} 
      />

      <div className="p-4 space-y-4 animate-fade-in">
        {/* Student Info Card */}
        <div className="card-gradient rounded-2xl p-5 border border-border">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-foreground">{student.full_name}</h2>
              <div className="text-sm text-muted-foreground mt-1">
                #{student.agent_number}
              </div>
            </div>
            <StatusIndicator status={student.activity_status} showLabel />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-secondary/50">
              <div className="text-xs text-muted-foreground">{t('day_of_program', language)}</div>
              <div className="font-semibold text-foreground">{student.day_program}/90</div>
            </div>
            <div className="p-3 rounded-xl bg-secondary/50">
              <div className="text-xs text-muted-foreground">{t('stage', language)}</div>
              <div className="font-semibold text-foreground">{t(stageLabels[student.program_stage], language)}</div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-border">
            <div className="text-xs text-muted-foreground">{t('last_activity', language)}</div>
            <div className="text-sm text-foreground">{formatLastActivity(student.last_activity_at)}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleWriteTelegram}
            className="flex-1 py-3 rounded-xl btn-gradient font-medium text-white flex items-center justify-center gap-2 hover:opacity-90 transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            {t('write_telegram', language)}
          </button>
          <button
            onClick={handleCopyMessage}
            className="py-3 px-4 rounded-xl bg-secondary font-medium text-secondary-foreground flex items-center justify-center gap-2 hover:bg-secondary/80 transition-all"
          >
            {copied ? <CheckCircle className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        {copied && (
          <div className="text-center text-sm text-success animate-fade-in">
            {t('message_copied', language)}
          </div>
        )}

        {/* Report History */}
        {dailyActions.length > 0 && (
          <div className="rounded-2xl border border-border overflow-hidden">
            <div className="p-4 bg-card border-b border-border">
              <h3 className="font-semibold text-foreground">{t('report_history', language)}</h3>
            </div>
            <div className="divide-y divide-border">
              {dailyActions.slice(0, 7).map((action) => (
                <div key={action.day} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {action.status === 'done' && <CheckCircle className="w-5 h-5 text-success" />}
                    {action.status === 'partial' && <AlertCircle className="w-5 h-5 text-warning" />}
                    {action.status === 'missed' && <XCircle className="w-5 h-5 text-destructive" />}
                    <span className="text-foreground">
                      {t('day_of_program', language)} {action.day}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {t(action.status, language)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
