import {  supabase  } from '@/lib/supabase';
import type {
  Achievement,
  UserProgress,
  AchievementNotification,
  AchievementHistory } from
'@/types';

// Database achievement service
export class AchievementDatabaseService {
  // Get all achievements from database for a specific user
  static async getAchievements(userId?: string): Promise<Achievement[]> {
    try {
      if (!userId) {
        console.log('No user ID provided for achievements');
        return [];
      }

      if (!supabase._client) {
        console.log('Supabase client not available');
        return [];
      }

      const { data, error } = await supabase._client.
      from('achievements').
      select('*').
      eq('user_id', userId).
      order('achievement_type', { ascending: true }).
      order('requirement', { ascending: true });

      if (error) throw error;

      return data.map((achievement) => ({
        id: achievement.id,
        title: achievement.title,
        description: achievement.description,
        icon: achievement.icon,
        category: achievement.achievement_type as "scenarios" | "questions" | "location" | "streak" | "mastery",
        requirement: achievement.requirement,
        unlocked: achievement.unlocked_at !== null,
        progress: achievement.progress || 0,
        unlockedAt: achievement.unlocked_at,
        sharedAt: undefined // Not implemented in current schema
      }));
    } catch (error) {
      console.error('Error fetching achievements:', error);
      return [];
    }
  }

  // Get user achievements with progress
  static async getUserAchievements(userId: string): Promise<Achievement[]> {
    return this.getAchievements(userId);
  }

  // Update achievement progress
  static async updateAchievementProgress(
  userId: string,
  achievementId: string,
  newProgress: number)
  : Promise<boolean> {
    try {
      if (!supabase._client) {
        console.log('Supabase client not available');
        return false;
      }

      const { error } = await supabase._client.
      from('achievements').
      update({
        progress: newProgress,
        unlocked_at: newProgress >= 1 ? new Date().toISOString() : null // Simplified logic
      }).
      eq('id', achievementId).
      eq('user_id', userId);

      if (error) throw error;

      // Add to history when achievement is unlocked
      if (newProgress >= 1) {
        await this.addHistoryEntry(userId, achievementId, 'unlocked', { progress: newProgress });
        await this.addNotification(userId, achievementId, 'unlocked');
      }

      return true;
    } catch (error) {
      console.error('Error updating achievement progress:', error);
      return false;
    }
  }

  // Get achievements by category
  static async getAchievementsByCategory(
  userId: string,
  category: string)
  : Promise<Achievement[]> {
    try {
      if (!supabase._client) {
        console.log('Supabase client not available');
        return [];
      }

      const { data, error } = await supabase._client.
      from('achievements').
      select('*').
      eq('user_id', userId).
      eq('achievement_type', category).
      order('requirement', { ascending: true });

      if (error) throw error;

      return data.map((achievement) => ({
        id: achievement.id,
        title: achievement.title,
        description: achievement.description,
        icon: achievement.icon,
        category: achievement.achievement_type as "scenarios" | "questions" | "location" | "streak" | "mastery",
        requirement: achievement.requirement,
        unlocked: achievement.unlocked_at !== null,
        progress: achievement.progress || 0,
        unlockedAt: achievement.unlocked_at,
        sharedAt: undefined
      }));
    } catch (error) {
      console.error('Error fetching achievements by category:', error);
      return [];
    }
  }

  // Get achievement statistics
  static async getAchievementStats(userId: string): Promise<{
    total: number;
    unlocked: number;
    progress: number;
    byCategory: Record<string, {total: number;unlocked: number;}>;
  }> {
    try {
      const achievements = await this.getAchievements(userId);

      const stats = {
        total: achievements.length,
        unlocked: achievements.filter((a) => a.unlocked).length,
        progress: Math.round(achievements.filter((a) => a.unlocked).length / achievements.length * 100),
        byCategory: {} as Record<string, {total: number;unlocked: number;}>
      };

      // Group by category
      achievements.forEach((achievement) => {
        if (!stats.byCategory[achievement.category]) {
          stats.byCategory[achievement.category] = { total: 0, unlocked: 0 };
        }
        stats.byCategory[achievement.category].total++;
        if (achievement.unlocked) {
          stats.byCategory[achievement.category].unlocked++;
        }
      });

      return stats;
    } catch (error) {
      console.error('Error getting achievement stats:', error);
      return {
        total: 0,
        unlocked: 0,
        progress: 0,
        byCategory: {}
      };
    }
  }

  // Share achievement (placeholder - not implemented in current schema)
  static async shareAchievement(
  userId: string,
  achievementId: string,
  platform?: string)
  : Promise<boolean> {
    try {
      if (!supabase._client) {
        console.log('Supabase client not available');
        return false;
      }

      // Add to history
      await this.addHistoryEntry(userId, achievementId, 'shared', { platform });

      return true;
    } catch (error) {
      console.error('Error sharing achievement:', error);
      return false;
    }
  }

  // Get achievement notifications (using localStorage)
  static async getAchievementNotifications(userId: string): Promise<AchievementNotification[]> {
    try {
      const key = `achievement_notifications_${userId}`;
      const stored = typeof window !== "undefined" ? localStorage.getItem(key) : null;
      if (stored) {
        return JSON.parse(stored);
      }
      return [];
    } catch (error) {
      console.error('Error getting notifications:', error);
      return [];
    }
  }

  // Add notification (using localStorage)
  static async addNotification(
  userId: string,
  achievementId: string,
  type: 'unlocked' | 'milestone' | 'shared' = 'unlocked')
  : Promise<void> {
    try {
      const notifications = await this.getAchievementNotifications(userId);
      const achievement = await this.getAchievementById(achievementId);

      if (achievement) {
        const notification: AchievementNotification = {
          id: `notif-${Date.now()}`,
          achievementId,
          title: achievement.title,
          description: type === 'unlocked' ?
          `Congratulations! You've unlocked ${achievement.title}` :
          `Progress update for ${achievement.title}`,
          timestamp: new Date().toISOString(),
          read: false,
          type
        };

        notifications.unshift(notification);

        // Keep only last 50 notifications
        if (notifications.length > 50) {
          notifications.splice(50);
        }

        const key = `achievement_notifications_${userId}`;
        typeof window !== "undefined" ? localStorage.setItem(key, JSON.stringify(notifications)) : null);
      }
    } catch (error) {
      console.error('Error adding notification:', error);
    }
  }

  // Mark notification as read
  static async markNotificationAsRead(userId: string, notificationId: string): Promise<boolean> {
    try {
      const notifications = await this.getAchievementNotifications(userId);
      const updated = notifications.map((n) =>
      n.id === notificationId ? { ...n, read: true } : n
      );

      const key = `achievement_notifications_${userId}`;
      typeof window !== "undefined" ? localStorage.setItem(key, JSON.stringify(updated)) : null);

      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  }

  // Get achievement history (using localStorage)
  static async getAchievementHistory(userId: string): Promise<AchievementHistory[]> {
    try {
      const key = `achievement_history_${userId}`;
      const stored = typeof window !== "undefined" ? localStorage.getItem(key) : null;
      if (stored) {
        return JSON.parse(stored);
      }
      return [];
    } catch (error) {
      console.error('Error getting history:', error);
      return [];
    }
  }

  // Add history entry (using localStorage)
  static async addHistoryEntry(
  userId: string,
  achievementId: string,
  action: 'unlocked' | 'shared' | 'viewed',
  metadata?: any)
  : Promise<void> {
    try {
      const history = await this.getAchievementHistory(userId);
      const entry: AchievementHistory = {
        achievementId,
        action,
        timestamp: new Date().toISOString(),
        metadata
      };

      history.unshift(entry);

      // Keep only last 200 entries
      if (history.length > 200) {
        history.splice(200);
      }

      const key = `achievement_history_${userId}`;
      typeof window !== "undefined" ? localStorage.setItem(key, JSON.stringify(history)) : null);
    } catch (error) {
      console.error('Error adding history entry:', error);
    }
  }

  // Get achievement by ID
  static async getAchievementById(achievementId: string): Promise<Achievement | null> {
    try {
      if (!supabase._client) {
        return null;
      }

      const { data, error } = await supabase._client.
      from('achievements').
      select('*').
      eq('id', achievementId).
      single();

      if (error || !data) return null;

      return {
        id: data.id,
        title: data.title,
        description: data.description,
        icon: data.icon,
        category: data.achievement_type as "scenarios" | "questions" | "location" | "streak" | "mastery",
        requirement: data.requirement,
        unlocked: data.unlocked_at !== null,
        progress: data.progress || 0,
        unlockedAt: data.unlocked_at,
        sharedAt: undefined
      };
    } catch (error) {
      console.error('Error getting achievement by ID:', error);
      return null;
    }
  }

  // Export achievements (enhanced version)
  static async exportAchievements(
  userId: string,
  format: 'json' | 'csv' | 'pdf' = 'json')
  : Promise<string> {
    try {
      const achievements = await this.getAchievements(userId);
      const history = await this.getAchievementHistory(userId);
      const stats = await this.getAchievementStats(userId);

      const exportData = {
        user: { id: userId },
        achievements,
        history,
        stats,
        exportDate: new Date().toISOString(),
        totalAchievements: achievements.length,
        unlockedAchievements: achievements.filter((a) => a.unlocked).length
      };

      // Add to history
      await this.addHistoryEntry(userId, 'export', 'viewed', { format });

      if (format === 'json') {
        return JSON.stringify(exportData, null, 2);
      } else {
        // Enhanced CSV export
        const headers = ['Title', 'Description', 'Category', 'Progress', 'Requirement', 'Unlocked', 'UnlockedAt'];
        const rows = achievements.map((a) => [
        a.title,
        a.description,
        a.category,
        a.progress,
        a.requirement,
        a.unlocked ? 'Yes' : 'No',
        a.unlockedAt || '']
        );

        return [headers, ...rows].map((row) => row.join(',')).join('\n');
      }
    } catch (error) {
      console.error('Error exporting achievements:', error);
      return '';
    }
  }

  // Import achievements (enhanced version)
  static async importAchievements(
  userId: string,
  importData: any)
  : Promise<{success: boolean;imported: number;error?: string;}> {
    try {
      let imported = 0;

      // Validate import data
      if (!importData.achievements || !Array.isArray(importData.achievements)) {
        throw new Error('Invalid import data format');
      }

      // Import each achievement
      for (const achievement of importData.achievements) {
        if (achievement.unlocked && achievement.progress > 0) {
          const success = await this.updateAchievementProgress(
            userId,
            achievement.id,
            achievement.progress
          );
          if (success) imported++;
        }
      }

      // Add import history entry
      await this.addHistoryEntry(userId, 'import', 'viewed', {
        importedCount: imported,
        totalCount: importData.achievements.length
      });

      return { success: true, imported };
    } catch (error) {
      console.error('Error importing achievements:', error);
      return { success: false, imported: 0, error: error.message };
    }
  }

  // Get leaderboard (enhanced version)
  static async getLeaderboard(): Promise<Array<{
    userId: string;
    totalAchievements: number;
    totalPoints: number;
    rank: number;
  }>> {
    try {
      if (!supabase._client) {
        console.log('Supabase client not available');
        return [];
      }

      // Get all users with their achievement counts
      const { data, error } = await supabase._client.
      from('achievements').
      select('user_id, unlocked_at').
      not('unlocked_at', 'is', null);

      if (error) throw error;

      // Group by user and count achievements
      const userAchievements = data.reduce((acc: any, achievement) => {
        const userId = achievement.user_id;
        if (!acc[userId]) {
          acc[userId] = { userId, totalAchievements: 0, totalPoints: 0 };
        }
        acc[userId].totalAchievements += 1;
        acc[userId].totalPoints += 10; // Simple point system
        return acc;
      }, {});

      // Convert to array and sort by points
      const leaderboard = Object.values(userAchievements).
      sort((a: any, b: any) => b.totalPoints - a.totalPoints).
      map((user: any, index) => ({
        ...user,
        rank: index + 1
      }));

      return leaderboard;
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      return [];
    }
  }

  // Get analytics for a user
  static async getAnalytics(userId: string): Promise<{
    totalAchievements: number;
    unlockedAchievements: number;
    completionRate: number;
    achievementsByCategory: Record<string, number>;
    recentUnlocks: Achievement[];
    analytics: any[];
  }> {
    try {
      if (!supabase._client) {
        console.log('Supabase client not available');
        return {
          totalAchievements: 0,
          unlockedAchievements: 0,
          completionRate: 0,
          achievementsByCategory: {},
          recentUnlocks: [],
          analytics: []
        };
      }

      const achievements = await this.getAchievements(userId);

      // Calculate analytics
      const totalAchievements = achievements.length;
      const unlockedAchievements = achievements.filter((a) => a.unlocked).length;

      const achievementsByCategory = achievements.reduce((acc, achievement) => {
        acc[achievement.category] = (acc[achievement.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const recentUnlocks = achievements.
      filter((a) => a.unlocked).
      sort((a, b) => new Date(b.unlockedAt || '').getTime() - new Date(a.unlockedAt || '').getTime()).
      slice(0, 5);

      const completionRate = totalAchievements > 0 ? unlockedAchievements / totalAchievements * 100 : 0;

      return {
        totalAchievements,
        unlockedAchievements,
        completionRate,
        achievementsByCategory,
        recentUnlocks,
        analytics: [] // Placeholder for future analytics data
      };
    } catch (error) {
      console.error('Error fetching analytics:', error);
      return {
        totalAchievements: 0,
        unlockedAchievements: 0,
        completionRate: 0,
        achievementsByCategory: {},
        recentUnlocks: [],
        analytics: []
      };
    }
  }

  // Initialize achievements for a new user
  static async initializeUserAchievements(userId: string): Promise<boolean> {
    try {
      if (!supabase._client) {
        console.log('Supabase client not available');
        return false;
      }

      // Check if user already has achievements
      const existingAchievements = await this.getAchievements(userId);
      if (existingAchievements.length > 0) {
        console.log('User already has achievements initialized');
        return true;
      }

      // Get a template user's achievements to copy
      const { data: templateAchievements, error } = await supabase._client.
      from('achievements').
      select('*').
      limit(1);

      if (error || !templateAchievements || templateAchievements.length === 0) {
        console.log('No template achievements found');
        return false;
      }

      // Get all unique achievement definitions
      const { data: allAchievements, error: allError } = await supabase._client.
      from('achievements').
      select('*').
      eq('user_id', templateAchievements[0].user_id);

      if (allError || !allAchievements) {
        console.log('Could not get template achievements');
        return false;
      }

      // Create achievements for the new user
      const newAchievements = allAchievements.map((achievement) => ({
        user_id: userId,
        title: achievement.title,
        description: achievement.description,
        icon: achievement.icon,
        achievement_type: achievement.achievement_type,
        requirement: achievement.requirement,
        progress: 0,
        unlocked_at: null
      }));

      // Insert all achievements
      const { error: insertError } = await supabase._client.
      from('achievements').
      insert(newAchievements);

      if (insertError) throw insertError;

      console.log(`Initialized ${newAchievements.length} achievements for user ${userId}`);
      return true;
    } catch (error) {
      console.error('Error initializing user achievements:', error);
      return false;
    }
  }

  // Clear all local data (for testing/reset)
  static async clearLocalData(userId: string): Promise<void> {
    try {
      typeof window !== "undefined" ? localStorage.removeItem(`achievement_notifications_${userId}`) : null;
      typeof window !== "undefined" ? localStorage.removeItem(`achievement_history_${userId}`) : null;
      console.log('Local achievement data cleared');
    } catch (error) {
      console.error('Error clearing local data:', error);
    }
  }
}
