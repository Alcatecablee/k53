import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { 
  Smartphone, 
  Wifi, 
  WifiOff, 
  Database, 
  Download, 
  Bell, 
  BellOff,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Settings
} from 'lucide-react';
import { pwaService } from '../services/pwaService';
import { PWAStatusData } from '../types/pwa';

export const PWAStatus: React.FC = () => {
  const [status, setStatus] = useState<PWAStatusData>({
    isInstalled: false,
    isOnline: true,
    hasServiceWorker: false,
    notificationsEnabled: false,
    offlineDataStatus: { hasData: false, lastUpdate: null },
    syncQueueStatus: { pendingItems: 0, lastSync: null },
    cacheStatus: { staticCache: false, dynamicCache: false, apiCache: false }
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkPWAStatus();
    
    // Listen for online/offline events
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const checkPWAStatus = async () => {
    try {
      setIsLoading(true);
      
      // Check installation status
      const isInstalled = pwaService.isAppInstalled();
      
      // Check online status
      const isOnline = navigator.onLine;
      
      // Check service worker
      const hasServiceWorker = 'serviceWorker' in navigator;
      
      // Check notification permission
      const notificationsEnabled = Notification.permission === 'granted';
      
      // Get offline data status
      const offlineDataStatus = pwaService.getOfflineDataStatus();
      
      // Get sync queue status
      const syncQueueStatus = pwaService.getSyncQueueStatus();
      
      // Check cache status
      const cacheStatus = await checkCacheStatus();
      
      setStatus({
        isInstalled,
        isOnline,
        hasServiceWorker,
        notificationsEnabled,
        offlineDataStatus,
        syncQueueStatus,
        cacheStatus
      });
    } catch (error) {
      console.error('Failed to check PWA status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkCacheStatus = async () => {
    try {
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        return {
          staticCache: cacheNames.some(name => name.includes('superk53-static')),
          dynamicCache: cacheNames.some(name => name.includes('superk53-dynamic')),
          apiCache: cacheNames.some(name => name.includes('superk53-api'))
        };
      }
      return { staticCache: false, dynamicCache: false, apiCache: false };
    } catch (error) {
      console.error('Failed to check cache status:', error);
      return { staticCache: false, dynamicCache: false, apiCache: false };
    }
  };

  const handleOnline = () => {
    setStatus(prev => ({ ...prev, isOnline: true }));
  };

  const handleOffline = () => {
    setStatus(prev => ({ ...prev, isOnline: false }));
  };

  const requestNotificationPermission = async () => {
    try {
      const granted = await pwaService.requestNotificationPermission();
      if (granted) {
        await pwaService.subscribeToPushNotifications();
        setStatus(prev => ({ ...prev, notificationsEnabled: true }));
      }
    } catch (error) {
      console.error('Failed to request notification permission:', error);
    }
  };

  const clearOfflineData = async () => {
    try {
      await pwaService.clearOfflineData();
      await checkPWAStatus();
    } catch (error) {
      console.error('Failed to clear offline data:', error);
    }
  };

  const refreshStatus = () => {
    checkPWAStatus();
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 animate-spin" />
            Checking PWA Status...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={50} className="w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          PWA Status Dashboard
        </CardTitle>
        <CardDescription>
          Comprehensive status of Progressive Web App features
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Installation Status */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            Installation Status
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-sm">App Installed</span>
            <div className="flex items-center gap-2">
              {status.isInstalled ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
              <Badge variant={status.isInstalled ? "default" : "secondary"}>
                {status.isInstalled ? "Installed" : "Not Installed"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Connection Status */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            {status.isOnline ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
            Connection Status
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-sm">Network Status</span>
            <Badge variant={status.isOnline ? "default" : "destructive"}>
              {status.isOnline ? "Online" : "Offline"}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Service Worker</span>
            <div className="flex items-center gap-2">
              {status.hasServiceWorker ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
              <Badge variant={status.hasServiceWorker ? "default" : "secondary"}>
                {status.hasServiceWorker ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Cache Status */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Database className="h-4 w-4" />
            Cache Status
          </h3>
          <div className="grid grid-cols-3 gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs">Static</span>
              <Badge variant={status.cacheStatus.staticCache ? "default" : "secondary"} className="text-xs">
                {status.cacheStatus.staticCache ? "✓" : "✗"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs">Dynamic</span>
              <Badge variant={status.cacheStatus.dynamicCache ? "default" : "secondary"} className="text-xs">
                {status.cacheStatus.dynamicCache ? "✓" : "✗"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs">API</span>
              <Badge variant={status.cacheStatus.apiCache ? "default" : "secondary"} className="text-xs">
                {status.cacheStatus.apiCache ? "✓" : "✗"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Offline Data Status */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Download className="h-4 w-4" />
            Offline Data
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-sm">Cached Data</span>
            <Badge variant={status.offlineDataStatus.hasData ? "default" : "secondary"}>
              {status.offlineDataStatus.hasData ? "Available" : "None"}
            </Badge>
          </div>
          {status.offlineDataStatus.lastUpdate && (
            <div className="flex items-center justify-between">
              <span className="text-sm">Last Update</span>
              <span className="text-xs text-muted-foreground">
                {status.offlineDataStatus.lastUpdate.toLocaleString()}
              </span>
            </div>
          )}
        </div>

        {/* Sync Queue Status */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Sync Queue
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-sm">Pending Items</span>
            <Badge variant={status.syncQueueStatus.pendingItems > 0 ? "destructive" : "default"}>
              {status.syncQueueStatus.pendingItems}
            </Badge>
          </div>
          {status.syncQueueStatus.lastSync && (
            <div className="flex items-center justify-between">
              <span className="text-sm">Last Sync</span>
              <span className="text-xs text-muted-foreground">
                {status.syncQueueStatus.lastSync.toLocaleString()}
              </span>
            </div>
          )}
        </div>

        {/* Notifications Status */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            {status.notificationsEnabled ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
            Notifications
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-sm">Permission Status</span>
            <div className="flex items-center gap-2">
              {status.notificationsEnabled ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
              <Badge variant={status.notificationsEnabled ? "default" : "secondary"}>
                {status.notificationsEnabled ? "Enabled" : "Disabled"}
              </Badge>
            </div>
          </div>
          {!status.notificationsEnabled && (
            <Button 
              onClick={requestNotificationPermission}
              variant="outline"
              size="sm"
              className="w-full"
            >
              Enable Notifications
            </Button>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-4 border-t">
          <div className="flex gap-2">
            <Button 
              onClick={refreshStatus}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Status
            </Button>
            <Button 
              onClick={clearOfflineData}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              <Database className="h-4 w-4 mr-2" />
              Clear Cache
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 