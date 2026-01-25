import { useApp } from '@/contexts/AppContext';
import { t, TranslationKey } from '@/lib/translations';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Users, CheckCircle, AlertTriangle, XCircle, Sparkles } from 'lucide-react';

export function StatsScreen() {
  const { language, profile } = useApp();

  const students = profile?.students || [];
  const totalStudents = students.length;
  
  const activeCount = students.filter(s => s.activity_status === 'ok').length;
  const warningCount = students.filter(s => s.activity_status === 'warning').length;
  const inactiveCount = students.filter(s => s.activity_status === 'error').length;

  const stageLabels: Record<string, TranslationKey> = {
    novice: 'stage_novice',
    mentor: 'stage_mentor',
    leader: 'stage_leader',
    completed: 'stage_completed',
  };

  const stageCounts = {
    novice: students.filter(s => s.program_stage === 'novice').length,
    mentor: students.filter(s => s.program_stage === 'mentor').length,
    leader: students.filter(s => s.program_stage === 'leader').length,
    completed: students.filter(s => s.program_stage === 'completed').length,
  };

  const reportStats = {
    done: 12,
    partial: 5,
    missed: 3,
  };

  return (
    <AppLayout>
      <PageHeader title={t('statistics', language)} />

      <div className="p-4 space-y-4 animate-fade-in">
        {/* Overview Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="card-premium rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-gold" />
              </div>
            </div>
            <div className="text-2xl font-display font-bold text-gold">{totalStudents}</div>
            <div className="text-sm text-muted-foreground">{t('total_students', language)}</div>
          </div>

          <div className="card-premium rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-success/10 border border-success/20 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-success" />
              </div>
            </div>
            <div className="text-2xl font-display font-bold text-success">{activeCount}</div>
            <div className="text-sm text-muted-foreground">{t('active_students', language)}</div>
          </div>

          <div className="card-premium rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-warning/10 border border-warning/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-warning" />
              </div>
            </div>
            <div className="text-2xl font-display font-bold text-warning">{warningCount}</div>
            <div className="text-sm text-muted-foreground">{t('warning_students', language)}</div>
          </div>

          <div className="card-premium rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center justify-center">
                <XCircle className="w-5 h-5 text-destructive" />
              </div>
            </div>
            <div className="text-2xl font-display font-bold text-destructive">{inactiveCount}</div>
            <div className="text-sm text-muted-foreground">{t('inactive_students', language)}</div>
          </div>
        </div>

        {/* By Stages */}
        <div className="card-premium rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-border/50 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-gold" />
            <h3 className="font-semibold text-foreground">{t('by_stages', language)}</h3>
          </div>
          <div className="divide-y divide-border/50">
            {Object.entries(stageCounts).map(([stage, count]) => {
              const percent = totalStudents > 0 ? Math.round((count / totalStudents) * 100) : 0;
              return (
                <div key={stage} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-foreground">{t(stageLabels[stage], language)}</span>
                    <span className="text-sm text-gold">{count} ({percent}%)</span>
                  </div>
                  <div className="progress-bar h-1.5">
                    <div 
                      className="progress-bar-fill" 
                      style={{ width: `${percent}%` }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reports 7 Days */}
        <div className="card-premium rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-border/50 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-gold" />
            <h3 className="font-semibold text-foreground">{t('reports_7_days', language)}</h3>
          </div>
          <div className="p-4 grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-14 h-14 mx-auto rounded-xl bg-success/10 border border-success/20 flex items-center justify-center mb-2">
                <CheckCircle className="w-7 h-7 text-success" />
              </div>
              <div className="text-xl font-display font-bold text-foreground">{reportStats.done}</div>
              <div className="text-xs text-muted-foreground">{t('done', language)}</div>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 mx-auto rounded-xl bg-warning/10 border border-warning/20 flex items-center justify-center mb-2">
                <AlertTriangle className="w-7 h-7 text-warning" />
              </div>
              <div className="text-xl font-display font-bold text-foreground">{reportStats.partial}</div>
              <div className="text-xs text-muted-foreground">{t('partial', language)}</div>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 mx-auto rounded-xl bg-destructive/10 border border-destructive/20 flex items-center justify-center mb-2">
                <XCircle className="w-7 h-7 text-destructive" />
              </div>
              <div className="text-xl font-display font-bold text-foreground">{reportStats.missed}</div>
              <div className="text-xs text-muted-foreground">{t('missed', language)}</div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
