import { cn } from '@/lib/utils';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Loader({ size = 'md', className }: LoaderProps) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div
      className={cn(
        'rounded-full border-primary/20 border-t-primary animate-spin',
        sizeClasses[size],
        className
      )}
    />
  );
}

export function FullScreenLoader() {
  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4">
        <Loader size="lg" />
        <div className="text-muted-foreground animate-pulse-soft">Freedom Life 5×5</div>
      </div>
    </div>
  );
}
