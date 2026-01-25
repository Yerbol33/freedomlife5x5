import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { hapticFeedback } from '@/lib/telegram';

interface PageHeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, showBack, onBack, rightAction, className }: PageHeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    hapticFeedback('light');
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <header className={cn('sticky top-0 z-30 glass border-b border-gold/10', className)}>
      <div className="flex items-center justify-between h-14 px-4">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {showBack && (
            <button
              onClick={handleBack}
              className="p-1.5 -ml-1.5 rounded-lg text-gold hover:bg-gold/10 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          <h1 className="text-lg font-display font-semibold text-foreground truncate">{title}</h1>
        </div>
        {rightAction && (
          <div className="flex-shrink-0 ml-2">
            {rightAction}
          </div>
        )}
      </div>
    </header>
  );
}
