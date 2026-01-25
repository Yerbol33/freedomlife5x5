import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { t, TranslationKey } from '@/lib/translations';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusIndicator } from '@/components/ui/StatusIndicator';
import { hapticFeedback } from '@/lib/telegram';
import { ChevronRight, Users } from 'lucide-react';
import { Student } from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';
import { ru, kk } from 'date-fns/locale';

export function TeamScreen() {
  const { language, profile } = useApp();
  const navigate = useNavigate();

  const students = profile?.students || [];

  const stageLabels: Record<string, TranslationKey> = {
    novice: 'stage_novice',
    mentor: 'stage_mentor',
    leader: 'stage_leader',
    completed: 'stage_completed',
  };

  const handleStudentClick = (student: Student) => {
    hapticFeedback('light');
    navigate(`/student/${student.telegram_id}`);
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

  return (
    <AppLayout>
      <PageHeader title={t('my_team', language)} />

      <div className="animate-fade-in">
        {students.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-center">{t('no_students', language)}</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {students.map((student) => (
              <button
                key={student.telegram_id}
                onClick={() => handleStudentClick(student)}
                className="w-full list-item text-left"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground truncate">
                      {student.full_name}
                    </span>
                    <StatusIndicator status={student.activity_status} />
                  </div>
                  <div className="text-sm text-muted-foreground mt-0.5">
                    #{student.agent_number} · {t(stageLabels[student.program_stage], language)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {t('day_of_program', language)}: {student.day_program}/90
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {t('last_activity', language)}: {formatLastActivity(student.last_activity_at)}
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              </button>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
