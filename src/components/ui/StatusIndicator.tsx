import { cn } from '@/lib/utils';

interface StatusIndicatorProps {
  status: 'ok' | 'warning' | 'error';
  size?: 'sm' | 'md';
  showLabel?: boolean;
  className?: string;
}

export function StatusIndicator({ status, size = 'md', showLabel, className }: StatusIndicatorProps) {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
  };

  const statusClasses = {
    ok: 'bg-success',
    warning: 'bg-warning',
    error: 'bg-destructive',
  };

  const labels = {
    ok: '✓',
    warning: '⚠️',
    error: '🔴',
  };

  if (showLabel) {
    return (
      <span className={cn('text-sm', className)}>
        {labels[status]}
      </span>
    );
  }

  return (
    <span
      className={cn(
        'inline-block rounded-full flex-shrink-0',
        sizeClasses[size],
        statusClasses[status],
        className
      )}
    />
  );
}
