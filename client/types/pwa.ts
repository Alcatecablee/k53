export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export interface PWAStatus {
  isInstalled: boolean;
  isOnline: boolean;
  canInstall: boolean;
  hasServiceWorker: boolean;
  notificationsEnabled: boolean;
}

export interface OfflineData {
  scenarios: any[];
  progress: any;
  achievements: any[];
  user: any;
  timestamp: number;
}

export interface SyncQueue {
  type: 'progress' | 'achievement' | 'scenario';
  data: any;
  timestamp: number;
}

export interface PWAStatusData {
  isInstalled: boolean;
  isOnline: boolean;
  hasServiceWorker: boolean;
  notificationsEnabled: boolean;
  offlineDataStatus: {
    hasData: boolean;
    lastUpdate: Date | null;
  };
  syncQueueStatus: {
    pendingItems: number;
    lastSync: Date | null;
  };
  cacheStatus: {
    staticCache: boolean;
    dynamicCache: boolean;
    apiCache: boolean;
  };
}

// Extend Window interface for PWA events
declare global {
  interface Window {
    deferredPrompt: BeforeInstallPromptEvent | null;
  }
} 