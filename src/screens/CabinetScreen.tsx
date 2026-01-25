import { useApp } from '@/contexts/AppContext';
import { t, TranslationKey } from '@/lib/translations';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { useNavigate } from 'react-router-dom';
import { Play, Circle, FileText, Sparkles } from 'lucide-react';
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
        <div className="card-premium rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="text-sm text-muted-foreground mb-1">{t('day_of_program', language)}</div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-display font-bold text-gold">{dayProgram}</span>
                <span className="text-lg text-muted-foreground">/90</span>
              </div>
            </div>
            <div className="w-20 h-20 rounded-2xl bg-gold/10 border border-gold/20 flex flex-col items-center justify-center glow-gold">
              <Sparkles className="w-5 h-5 text-gold mb-1" />
              <span className="text-xl font-bold text-gold">{progressPercent}%</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
          </div>

          {/* Stage and Status */}
          <div className="flex gap-3 mt-5">
            <div className="flex-1 p-3 rounded-xl bg-secondary/50 border border-border/50">
              <div className="text-xs text-muted-foreground mb-1">{t('stage', language)}</div>
              <div className="font-semibold text-foreground">{t(stageLabels[stage], language)}</div>
            </div>
            <div className="flex-1 p-3 rounded-xl bg-secondary/50 border border-border/50">
              <div className="text-xs text-muted-foreground mb-1">{t('status', language)}</div>
              <div className="font-semibold text-foreground">{t(statusLabels[status], language)}</div>
            </div>
          </div>
        </div>

        {/* Day Content */}
        {dayContent && (
          <div className="card-premium rounded-2xl overflow-hidden">
            <div className="p-4">
              <h3 className="text-xs font-semibold text-gold uppercase tracking-wider mb-2">
                {t('todays_content', language)}
              </h3>
              <h2 className="text-lg font-display font-bold text-foreground">{dayContent.title}</h2>
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
                className="w-full p-4 bg-gold/5 hover:bg-gold/10 transition-colors flex items-center gap-3 border-t border-border/50"
              >
                <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center flex-shrink-0">
                  <Play className="w-5 h-5 text-gold ml-0.5" />
                </div>
                <span className="font-medium text-foreground">{t('watch_video', language)}</span>
              </button>
            )}

            {/* Tasks */}
            {dayContent.tasks && dayContent.tasks.length > 0 && (
              <div className="p-4 border-t border-border/50">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  {t('tasks', language)}
                </h4>
                <ul className="space-y-2.5">
                  {dayContent.tasks.map((task, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Circle className="w-4 h-4 text-gold/50 mt-0.5 flex-shrink-0" />
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
          className="w-full py-4 rounded-xl btn-gold font-semibold flex items-center justify-center gap-2 transition-all"
        >
          <FileText className="w-5 h-5" />
          {t('fill_report', language)}
        </button>
      </div>
    </AppLayout>
  );
}
