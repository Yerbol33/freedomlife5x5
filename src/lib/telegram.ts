// Telegram WebApp API integration

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        initData: string;
        initDataUnsafe: {
          user?: {
            id: number;
            first_name?: string;
            last_name?: string;
            username?: string;
            language_code?: string;
          };
          auth_date?: number;
          hash?: string;
        };
        ready: () => void;
        expand: () => void;
        close: () => void;
        MainButton: {
          text: string;
          color: string;
          textColor: string;
          isVisible: boolean;
          isActive: boolean;
          show: () => void;
          hide: () => void;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
          setText: (text: string) => void;
          enable: () => void;
          disable: () => void;
        };
        BackButton: {
          isVisible: boolean;
          show: () => void;
          hide: () => void;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
        };
        HapticFeedback: {
          impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
          notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
          selectionChanged: () => void;
        };
        themeParams: {
          bg_color?: string;
          text_color?: string;
          hint_color?: string;
          link_color?: string;
          button_color?: string;
          button_text_color?: string;
          secondary_bg_color?: string;
        };
        colorScheme: 'light' | 'dark';
        isExpanded: boolean;
        viewportHeight: number;
        viewportStableHeight: number;
        headerColor: string;
        backgroundColor: string;
        setHeaderColor: (color: string) => void;
        setBackgroundColor: (color: string) => void;
        openTelegramLink: (url: string) => void;
        openLink: (url: string, options?: { try_instant_view?: boolean }) => void;
        showPopup: (params: { title?: string; message: string; buttons?: Array<{ id?: string; type?: string; text?: string }> }, callback?: (buttonId: string) => void) => void;
        showAlert: (message: string, callback?: () => void) => void;
        showConfirm: (message: string, callback?: (confirmed: boolean) => void) => void;
      };
    };
  }
}

export function getTelegramWebApp() {
  return window.Telegram?.WebApp;
}

export function getTelegramUserId(): string | null {
  const webApp = getTelegramWebApp();
  const userId = webApp?.initDataUnsafe?.user?.id;
  
  if (userId) {
    return String(userId);
  }
  
  // For development/testing outside Telegram
  // In production, this should return null
  if (import.meta.env.DEV) {
    console.warn('Running outside Telegram WebApp - using mock telegram_id');
    return 'dev_user_12345';
  }
  
  return null;
}

export function getTelegramUserName(): string | null {
  const webApp = getTelegramWebApp();
  const user = webApp?.initDataUnsafe?.user;
  
  if (user) {
    return [user.first_name, user.last_name].filter(Boolean).join(' ') || user.username || null;
  }
  
  return null;
}

export function initTelegramWebApp() {
  const webApp = getTelegramWebApp();
  
  if (webApp) {
    webApp.ready();
    webApp.expand();
    
    // Set header color to match our design
    webApp.setHeaderColor('#ffffff');
    webApp.setBackgroundColor('#ffffff');
  }
}

export function hapticFeedback(type: 'success' | 'error' | 'warning' | 'light' | 'medium' | 'heavy') {
  const webApp = getTelegramWebApp();
  
  if (webApp?.HapticFeedback) {
    if (type === 'success' || type === 'error' || type === 'warning') {
      webApp.HapticFeedback.notificationOccurred(type);
    } else {
      webApp.HapticFeedback.impactOccurred(type);
    }
  }
}

export function openTelegramChat(userId: string) {
  const webApp = getTelegramWebApp();
  
  if (webApp) {
    webApp.openTelegramLink(`https://t.me/${userId}`);
  } else {
    window.open(`https://t.me/${userId}`, '_blank');
  }
}
