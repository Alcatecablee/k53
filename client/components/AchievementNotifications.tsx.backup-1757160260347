import React, { useState, useEffect, useMemo } from "react";
import { 
  Trophy, 
  X, 
  Bell, 
  CheckCircle,
  Share2,
  Clock
} from "lucide-react";
import type { AchievementNotification } from "@/types";
import { 
  getAchievementNotifications, 
  markNotificationAsRead, 
  clearAllNotifications 
} from "@/services/achievementService";

interface AchievementNotificationsProps {
  className?: string;
  onNotificationClick?: (notification: AchievementNotification) => void;
}

export default function AchievementNotifications({ 
  className = "", 
  onNotificationClick 
}: AchievementNotificationsProps) {
  const [notifications, setNotifications] = useState<AchievementNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const loadNotifications = () => {
      const storedNotifications = getAchievementNotifications();
      setNotifications(storedNotifications);
    };

    loadNotifications();
    
    // Listen for storage changes (if another tab updates notifications)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "k53_achievement_notifications") {
        loadNotifications();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const unreadCount = useMemo(() => 
    notifications.filter(n => !n.read).length, 
    [notifications]
  );

  const handleMarkAsRead = (notificationId: string) => {
    markNotificationAsRead(notificationId);
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
  };

  const handleClearAll = () => {
    clearAllNotifications();
    setNotifications([]);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className={`relative ${className}`}>
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-900"
        aria-label={`Achievement notifications (${unreadCount} unread)`}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 bg-slate-800 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-slate-800 border border-slate-600 rounded-lg shadow-lg z-50 max-h-96 overflow-hidden">
          <div className="p-4 border-b border-slate-600">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Achievements</h3>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <button
                    onClick={handleClearAll}
                    className="text-xs text-slate-400 hover:text-white"
                    aria-label="Clear all notifications"
                  >
                    Clear all
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 hover:text-white"
                  aria-label="Close notifications"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center">
                <Trophy className="h-8 w-8 mx-auto mb-2 text-slate-400" />
                <p className="text-slate-300 text-sm">No notifications yet</p>
                <p className="text-slate-400 text-xs">Complete scenarios to unlock achievements</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-600">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-slate-700 transition-colors cursor-pointer ${
                      !notification.read ? 'bg-slate-700/50' : ''
                    }`}
                    onClick={() => {
                      handleMarkAsRead(notification.id);
                      onNotificationClick?.(notification);
                      setIsOpen(false);
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleMarkAsRead(notification.id);
                        onNotificationClick?.(notification);
                        setIsOpen(false);
                      }
                    }}
                    aria-label={`Achievement notification: ${notification.title}`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        {notification.type === "unlocked" && (
                          <Trophy className="h-5 w-5 text-white" />
                        )}
                        {notification.type === "shared" && (
                          <Share2 className="h-5 w-5 text-white" />
                        )}
                        {notification.type === "milestone" && (
                          <CheckCircle className="h-5 w-5 text-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className={`text-sm font-medium ${
                            notification.read ? 'text-slate-300' : 'text-white'
                          }`}>
                            {notification.title}
                          </h4>
                          <div className="flex items-center space-x-1 text-xs text-slate-400">
                            <Clock className="h-3 w-3" />
                            <span>{formatTimestamp(notification.timestamp)}</span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                          {notification.description}
                        </p>
                        {!notification.read && (
                          <div className="mt-2">
                            <span className="inline-block w-2 h-2 bg-white rounded-full"></span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
} 
