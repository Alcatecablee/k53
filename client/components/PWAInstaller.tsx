import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Download, Smartphone, Wifi, WifiOff, Bell, BellOff, X } from 'lucide-react';
import { BeforeInstallPromptEvent, PWAStatus } from '../types/pwa';

export const PWAInstaller: React.FC = () => {
  const [pwaStatus, setPwaStatus] = useState<PWAStatus>({
    isInstalled: false,
    isOnline: true,
    canInstall: false,
    hasServiceWorker: false,
    notificationsEnabled: false
  });
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    initializePWA();
    checkOnlineStatus();
    checkNotificationPermission();
    
    // Listen for online/offline events
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const initializePWA = async () => {
    try {
      // Check if app is installed
      const isInstalled = window.matchMedia('(display-mode: standalone)').matches ||
                         (window.navigator as any).standalone === true;
      
      // Check if service worker is registered
      const hasServiceWorker = 'serviceWorker' in navigator;
      
      // Register service worker
      if (hasServiceWorker) {
        const registration = await navigator.serviceWorker.register('/sw.js');
        
        // Listen for service worker updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New service worker available
                showUpdateNotification();
              }
            });
          }
        });
      }

      setPwaStatus(prev => ({
        ...prev,
        isInstalled,
        hasServiceWorker
      }));

      // Listen for beforeinstallprompt event
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        setDeferredPrompt(e as BeforeInstallPromptEvent);
        setPwaStatus(prev => ({ ...prev, canInstall: true }));
        setShowInstallPrompt(true);
      });

      // Listen for appinstalled event
      window.addEventListener('appinstalled', () => {
        setPwaStatus(prev => ({ ...prev, isInstalled: true, canInstall: false }));
        setShowInstallPrompt(false);
        setDeferredPrompt(null);
      });

    } catch (error) {
      console.error('PWA initialization failed:', error);
    }
  };

  const checkOnlineStatus = () => {
    setPwaStatus(prev => ({ ...prev, isOnline: navigator.onLine }));
  };

  const checkNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = Notification.permission;
      setPwaStatus(prev => ({ 
        ...prev, 
        notificationsEnabled: permission === 'granted' 
      }));
    }
  };

  const handleOnline = () => {
    setPwaStatus(prev => ({ ...prev, isOnline: true }));
  };

  const handleOffline = () => {
    setPwaStatus(prev => ({ ...prev, isOnline: false }));
  };

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
          console.log('PWA installed successfully');
        } else {
          console.log('PWA installation dismissed');
        }
        
        setDeferredPrompt(null);
        setShowInstallPrompt(false);
      } catch (error) {
        console.error('PWA installation failed:', error);
      }
    }
  };

  const requestNotificationPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      setPwaStatus(prev => ({ 
        ...prev, 
        notificationsEnabled: permission === 'granted' 
      }));
      
      if (permission === 'granted') {
        // Subscribe to push notifications
        await subscribeToPushNotifications();
      }
    } catch (error) {
      console.error('Notification permission request failed:', error);
    }
  };

  const subscribeToPushNotifications = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const vapidKey = process.env.VITE_VAPID_PUBLIC_KEY;
      
      if (!vapidKey) {
        return; // VAPID key not available
      }
      
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidKey
      });
      
      // Send subscription to server
      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription)
      });
      
      // Push notification subscription successful
    } catch (error) {
      // Push notification subscription failed
    }
  };

  const showUpdateNotification = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.active?.postMessage({ type: 'SKIP_WAITING' });
      });
    }
  };

  const sendTestNotification = async () => {
    if ('serviceWorker' in navigator && pwaStatus.notificationsEnabled) {
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification('SuperK53', {
        body: 'Test notification from SuperK53!',
        icon: '/images/pwa/icon-192x192.svg',
        badge: '/images/pwa/icon-72x72.svg'
      });
    }
  };

  if (pwaStatus.isInstalled) {
    return (
      <Dialog open={showInstallPrompt} onOpenChange={setShowInstallPrompt}>
        <DialogContent className="sm:max-w-md bg-slate-800 border border-black">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-slate-50">
              <Smartphone className="h-5 w-5 text-slate-50" />
              SuperK53 Installed
            </DialogTitle>
            <DialogDescription className="text-slate-300">
              The app is installed and ready to use offline
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">Status</span>
              <Badge variant="secondary">Installed</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">Connection</span>
              <div className="flex items-center gap-2">
                {pwaStatus.isOnline ? (
                  <Wifi className="h-4 w-4 text-green-500" />
                ) : (
                  <WifiOff className="h-4 w-4 text-red-500" />
                )}
                <Badge variant={pwaStatus.isOnline ? "default" : "destructive"}>
                  {pwaStatus.isOnline ? "Online" : "Offline"}
                </Badge>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">Notifications</span>
              <div className="flex items-center gap-2">
                {pwaStatus.notificationsEnabled ? (
                  <Bell className="h-4 w-4 text-green-500" />
                ) : (
                  <BellOff className="h-4 w-4 text-red-500" />
                )}
                <Badge variant={pwaStatus.notificationsEnabled ? "default" : "secondary"}>
                  {pwaStatus.notificationsEnabled ? "Enabled" : "Disabled"}
                </Badge>
              </div>
            </div>
            {!pwaStatus.notificationsEnabled && (
              <Button 
                onClick={requestNotificationPermission}
                variant="outline"
                size="sm"
                className="w-full border-black text-slate-50 hover:bg-slate-700"
              >
                Enable Notifications
              </Button>
            )}
            {pwaStatus.notificationsEnabled && (
              <Button 
                onClick={sendTestNotification}
                variant="outline"
                size="sm"
                className="w-full border-black text-slate-50 hover:bg-slate-700"
              >
                Test Notification
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!showInstallPrompt) {
    return null;
  }

  return (
    <Dialog open={showInstallPrompt} onOpenChange={setShowInstallPrompt}>
      <DialogContent className="sm:max-w-md bg-slate-800 border border-black">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-slate-50">
            <Download className="h-5 w-5 text-slate-50" />
            Install SuperK53
          </DialogTitle>
          <DialogDescription className="text-slate-300">
            Install SuperK53 as a PWA for the best experience
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-slate-50" />
              <span className="text-sm text-slate-300">Works offline</span>
            </div>
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-slate-50" />
              <span className="text-sm text-slate-300">Push notifications</span>
            </div>
            <div className="flex items-center gap-2">
              <Download className="h-4 w-4 text-slate-50" />
              <span className="text-sm text-slate-300">Fast loading</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleInstallClick} className="flex-1 bg-slate-700 text-slate-50 hover:bg-slate-600 border border-black">
              Install App
            </Button>
            <Button 
              onClick={() => setShowInstallPrompt(false)} 
              variant="outline"
              className="border-black text-slate-50 hover:bg-slate-700"
            >
              Later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 