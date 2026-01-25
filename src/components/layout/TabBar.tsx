import { useLocation, useNavigate } from 'react-router-dom';
import { TrendingUp, Users, BarChart3, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApp } from '@/contexts/AppContext';
import { t } from '@/lib/translations';
import { hapticFeedback } from '@/lib/telegram';

interface TabItem {
  path: string;
  labelKey: 'nav_progress' | 'nav_team' | 'nav_stats' | 'nav_settings';
  icon: React.ComponentType<{ className?: string }>;
  requiresStudents?: boolean;
}

const tabs: TabItem[] = [
  { path: '/cabinet', labelKey: 'nav_progress', icon: TrendingUp },
  { path: '/team', labelKey: 'nav_team', icon: Users, requiresStudents: true },
  { path: '/stats', labelKey: 'nav_stats', icon: BarChart3, requiresStudents: true },
  { path: '/settings', labelKey: 'nav_settings', icon: Settings },
];

export function TabBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { language, profile } = useApp();

  const hasStudents = (profile?.students_count ?? 0) > 0 || (profile?.students?.length ?? 0) > 0;

  const visibleTabs = tabs.filter(tab => !tab.requiresStudents || hasStudents);

  const handleTabClick = (path: string) => {
    hapticFeedback('light');
    navigate(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass border-t border-gold/10 safe-area-bottom z-40">
      <div className="flex items-center justify-around h-16">
        {visibleTabs.map((tab) => {
          const isActive = location.pathname.startsWith(tab.path);
          const Icon = tab.icon;

          return (
            <button
              key={tab.path}
              onClick={() => handleTabClick(tab.path)}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all duration-300',
                isActive 
                  ? 'text-gold' 
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <div className={cn(
                'p-1.5 rounded-xl transition-all duration-300',
                isActive && 'bg-gold/10'
              )}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-medium">
                {t(tab.labelKey, language)}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
