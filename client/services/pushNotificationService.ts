import { getUserProgress } from "./achievementService";

interface NotificationData {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: any;
}

class PushNotificationService {
  private isSupported: boolean;
  private permission: NotificationPermission = "default";

  constructor() {
    this.isSupported = "Notification" in window;
    this.checkPermission();
  }

  private checkPermission(): void {
    if (this.isSupported) {
      this.permission = Notification.permission;
    }
  }

  async requestPermission(): Promise<boolean> {
    if (!this.isSupported) {
      console.warn("Notifications not supported in this browser");
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      this.permission = permission;
      return permission === "granted";
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      return false;
    }
  }

  async sendNotification(data: NotificationData): Promise<void> {
    if (!this.isSupported || this.permission !== "granted") {
      return;
    }

    try {
      const notification = new Notification(data.title, {
        body: data.body,
        icon: data.icon || "/favicon.ico",
        badge: data.badge || "/favicon.ico",
        tag: data.tag,
        data: data.data,
        requireInteraction: false,
        silent: false,
      });

      // Auto-close after 5 seconds
      setTimeout(() => {
        notification.close();
      }, 5000);

      // Handle notification click
      notification.onclick = () => {
        window.focus();
        notification.close();
        
        // Navigate to relevant page based on notification type
        if (data.data?.type === "achievement") {
          window.location.href = "/progress";
        } else if (data.data?.type === "reminder") {
          window.location.href = "/practice";
        }
      };
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  }

  async sendDailyReminder(): Promise<void> {
    const progress = getUserProgress();
    const today = new Date().toISOString().split("T")[0];
    const lastActive = progress.lastActiveDate.split("T")[0];

    // Only send reminder if user hasn't practiced today
    if (today !== lastActive) {
      await this.sendNotification({
        title: "Time to Practice K53!",
        body: "Complete 5 scenarios today to maintain your streak and improve your driving knowledge.",
        tag: "daily-reminder",
        data: { type: "reminder" },
      });
    }
  }

  async sendStreakReminder(): Promise<void> {
    const progress = getUserProgress();
    
    if (progress.currentStreak >= 3) {
      await this.sendNotification({
        title: "Don't Break Your Streak!",
        body: `You're on a ${progress.currentStreak}-day streak. Practice today to keep it going!`,
        tag: "streak-reminder",
        data: { type: "reminder" },
      });
    }
  }

  async sendAchievementNotification(achievement: any): Promise<void> {
    await this.sendNotification({
      title: "Achievement Unlocked!",
      body: `Congratulations! You've earned the "${achievement.title}" achievement.`,
      tag: "achievement",
      data: { 
        type: "achievement",
        achievementId: achievement.id 
      },
    });
  }

  async sendWeakAreaReminder(weakCategories: string[]): Promise<void> {
    if (weakCategories.length > 0) {
      await this.sendNotification({
        title: "Focus on Weak Areas",
        body: `Practice more ${weakCategories.join(", ")} scenarios to improve your performance.`,
        tag: "weak-area-reminder",
        data: { type: "reminder" },
      });
    }
  }

  async sendTestReadinessNotification(readinessScore: number): Promise<void> {
    if (readinessScore >= 80) {
      await this.sendNotification({
        title: "Ready for K53 Test!",
        body: "Your readiness score is high. Consider booking your driving test soon!",
        tag: "test-readiness",
        data: { type: "achievement" },
      });
    }
  }

  // Schedule notifications based on user activity
  scheduleNotifications(): void {
    // Check for daily reminders every hour
    setInterval(async () => {
      const now = new Date();
      const hour = now.getHours();
      
      // Send daily reminder at 9 AM if user hasn't practiced
      if (hour === 9) {
        await this.sendDailyReminder();
      }
      
      // Send streak reminder at 6 PM if user has a streak
      if (hour === 18) {
        await this.sendStreakReminder();
      }
    }, 60 * 60 * 1000); // Check every hour
  }

  // Initialize notification service
  async initialize(): Promise<void> {
    if (!this.isSupported) {
      return;
    }

    // Request permission if not already granted
    if (this.permission === "default") {
      await this.requestPermission();
    }

    // Schedule notifications
    this.scheduleNotifications();
  }

  // Check for new achievements and send notifications
  checkForNewAchievements(oldProgress: any, newProgress: any): void {
    const oldUnlocked = oldProgress.achievements.filter((a: any) => a.unlocked).length;
    const newUnlocked = newProgress.achievements.filter((a: any) => a.unlocked).length;

    if (newUnlocked > oldUnlocked) {
      // Find newly unlocked achievements
      const newAchievements = newProgress.achievements.filter((achievement: any) => 
        achievement.unlocked && 
        !oldProgress.achievements.find((old: any) => old.id === achievement.id)?.unlocked
      );

      // Send notifications for new achievements
      newAchievements.forEach((achievement: any) => {
        this.sendAchievementNotification(achievement);
      });
    }
  }

  // Send performance-based notifications
  sendPerformanceNotifications(performanceStats: any): void {
    if (performanceStats.weakCategories.length > 0) {
      this.sendWeakAreaReminder(performanceStats.weakCategories);
    }

    // Calculate readiness score (simplified)
    const readinessScore = Math.min(
      (performanceStats.accuracy / 100) * 50 + 
      (performanceStats.totalAnswers / 50) * 50, 
      100
    );

    this.sendTestReadinessNotification(readinessScore);
  }
}

// Create singleton instance
const pushNotificationService = new PushNotificationService();

export default pushNotificationService; 