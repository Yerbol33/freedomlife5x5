import { useApp } from '@/contexts/AppContext';
import { t, TranslationKey } from '@/lib/translations';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { useNavigate } from 'react-router-dom';
import { Play, CheckCircle, Circle, FileText } from 'lucide-react';
import { hapticFeedback } from '@/lib/telegram';

export function CabinetScreen() {
  const { language, profile } = useApp();
  const navigate = useNavigate();

  if (!profile) {
    return null;
  }

  const dayProgram = profile.day_program || 1;
  const stage = profile.program_stage || 'novice';
  const status = profile.program_status || 'active';
  const dayContent = profile.day_content;

  const stageLabels: Record<string, TranslationKey> = {
    novice: 'stage_novice',
    mentor: 'stage_mentor',
    leader: 'stage_leader',
    completed: 'stage_completed',
  };

  const statusLabels: Record<string, TranslationKey> = {
    active: 'status_active',
    paused: 'status_paused',
    completed: 'status_completed',
  };

  const handleFillReport = () => {
    hapticFeedback('medium');
    navigate('/report');
  };

  const handleWatchVideo = () => {
    if (dayContent?.video_link) {
      hapticFeedback('light');
      window.open(dayContent.video_link, '_blank');
    }
  };

  const progressPercent = Math.round((dayProgram / 90) * 100);

  return (
    <AppLayout>
      <PageHeader title={t('my_progress', language)} />

      <div className="p-4 space-y-4 animate-fade-in">
        {/* Day Progress Card */}
        <div className="card-gradient rounded-2xl p-5 border border-border">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm text-muted-foreground">{t('day_of_program', language)}</div>
              <div className="text-3xl font-bold text-primary">{dayProgram}<span className="text-lg text-muted-foreground">/90</span></div>
            </div>
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">{progressPercent}%</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
          </div>

          {/* Stage and Status */}
          <div className="flex gap-4 mt-4">
            <div className="flex-1 p-3 rounded-xl bg-secondary/50">
              <div className="text-xs text-muted-foreground">{t('stage', language)}</div>
              <div className="font-semibold text-foreground">{t(stageLabels[stage], language)}</div>
            </div>
            <div className="flex-1 p-3 rounded-xl bg-secondary/50">
              <div className="text-xs text-muted-foreground">{t('status', language)}</div>
              <div className="font-semibold text-foreground">{t(statusLabels[status], language)}</div>
            </div>
          </div>
        </div>

        {/* Day Content */}
        {dayContent && (
          <div className="rounded-2xl border border-border overflow-hidden">
            <div className="p-4 bg-card">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                {t('todays_content', language)}
              </h3>
              <h2 className="text-lg font-bold text-foreground">{dayContent.title}</h2>
              {dayContent.description && (
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {dayContent.description}
                </p>
              )}
            </div>

            {/* Video Button */}
            {dayContent.video_link && (
              <button
                onClick={handleWatchVideo}
                className="w-full p-4 bg-secondary/30 hover:bg-secondary/50 transition-colors flex items-center gap-3 border-t border-border"
              >
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <Play className="w-4 h-4 text-primary-foreground ml-0.5" />
                </div>
                <span className="font-medium text-foreground">{t('watch_video', language)}</span>
              </button>
            )}

            {/* Tasks */}
            {dayContent.tasks && dayContent.tasks.length > 0 && (
              <div className="p-4 border-t border-border">
                <h4 className="text-sm font-semibold text-muted-foreground mb-3">{t('tasks', language)}</h4>
                <ul className="space-y-2">
                  {dayContent.tasks.map((task, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Circle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-foreground">{task}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Fill Report Button */}
        <button
          onClick={handleFillReport}
          className="w-full py-4 rounded-xl btn-gradient font-semibold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-all"
        >
          <FileText className="w-5 h-5" />
          {t('fill_report', language)}
        </button>
      </div>
    </AppLayout>
  );
}
