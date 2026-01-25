import { ReactNode } from 'react';
import { TabBar } from './TabBar';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: ReactNode;
  hideTabBar?: boolean;
  className?: string;
}

export function AppLayout({ children, hideTabBar, className }: AppLayoutProps) {
  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <main className={cn('pb-16', hideTabBar && 'pb-0')}>
        {children}
      </main>
      {!hideTabBar && <TabBar />}
    </div>
  );
}
