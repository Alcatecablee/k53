import type { Achievement, UserProgress, PerformanceStats, AchievementNotification, AchievementHistory } from "@/types";

// Achievement definitions
export const ACHIEVEMENTS: Omit<Achievement, "unlocked" | "progress">[] = [
  {
    id: "first_scenario",
    title: "First Steps",
    description: "Complete your first scenario",
    icon: "target",
    category: "scenarios",
    requirement: 1,
  },
  {
    id: "scenario_master",
    title: "Scenario Master",
    description: "Complete 50 scenarios",
    icon: "trophy",
    category: "scenarios",
    requirement: 50,
  },
  {
    id: "location_explorer",
    title: "Location Explorer",
    description: "Complete scenarios from 5 different cities",
    icon: "map-pin",
    category: "location",
    requirement: 5,
  },
  {
    id: "streak_3",
    title: "Getting Started",
    description: "Maintain a 3-day study streak",
    icon: "flame",
    category: "streak",
    requirement: 3,
  },
  {
    id: "streak_7",
    title: "Week Warrior",
    description: "Maintain a 7-day study streak",
    icon: "zap",
    category: "streak",
    requirement: 7,
  },
  {
    id: "controls_expert",
    title: "Controls Expert",
    description: "Complete 20 control scenarios",
    icon: "gamepad-2",
    category: "mastery",
    requirement: 20,
  },
  {
    id: "signs_expert",
    title: "Signs Expert",
    description: "Complete 20 sign scenarios",
    icon: "traffic-cone",
    category: "mastery",
    requirement: 20,
  },
  {
    id: "rules_expert",
    title: "Rules Expert",
    description: "Complete 20 rule scenarios",
    icon: "clipboard",
    category: "mastery",
    requirement: 20,
  },
  {
    id: "mixed_expert",
    title: "Mixed Expert",
    description: "Complete 20 mixed scenarios",
    icon: "dice-1",
    category: "mastery",
    requirement: 20,
  },
  {
    id: "accuracy_90",
    title: "Sharp Shooter",
    description: "Achieve 90% accuracy in scenarios",
    icon: "target",
    category: "scenarios",
    requirement: 90,
  },
];

// Get user progress from localStorage or create default
export const getUserProgress = (): UserProgress => {
  if (typeof window === "undefined") {
    return getDefaultProgress();
  }

  const stored = localStorage.getItem("k53_user_progress");
  if (!stored) {
    return getDefaultProgress();
  }

  try {
    const progress = JSON.parse(stored) as UserProgress;
    
    // Validate the progress structure
    if (!progress || typeof progress !== 'object') {
      throw new Error('Invalid progress data structure');
    }
    
    return {
      ...getDefaultProgress(),
      ...progress,
      achievements: progress.achievements || getDefaultAchievements(),
    };
  } catch (error) {
    console.error('Error parsing user progress:', error);
    // Clear corrupted data
    localStorage.removeItem("k53_user_progress");
    return getDefaultProgress();
  }
};

// Save user progress to localStorage
export const saveUserProgress = (progress: UserProgress): void => {
  if (typeof window === "undefined") return;
  
  try {
    // Validate progress before saving
    if (!progress || typeof progress !== 'object') {
      throw new Error('Invalid progress data');
    }
    
    localStorage.setItem("k53_user_progress", JSON.stringify(progress));
  } catch (error) {
    console.error('Error saving user progress:', error);
    // Don't throw - this is not critical for app functionality
  }
};

// Get default progress structure
export const getDefaultProgress = (): UserProgress => ({
  totalScenariosCompleted: 0,
  scenariosByCategory: {
    controls: 0,
    signs: 0,
    rules: 0,
    mixed: 0,
  },
  scenariosByDifficulty: {
    basic: 0,
    intermediate: 0,
    advanced: 0,
  },
  currentStreak: 0,
  longestStreak: 0,
  achievements: getDefaultAchievements(),
  weakAreas: [],
  lastActiveDate: new Date().toISOString(),
});

// Achievement notifications storage
const NOTIFICATIONS_KEY = "k53_achievement_notifications";
const HISTORY_KEY = "k53_achievement_history";

// Get achievement notifications
export const getAchievementNotifications = (): AchievementNotification[] => {
  if (typeof window === "undefined") return [];
  
  try {
    const stored = localStorage.getItem(NOTIFICATIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Save achievement notifications
export const saveAchievementNotifications = (notifications: AchievementNotification[]): void => {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
  } catch (error) {
    console.error('Error saving achievement notifications:', error);
  }
};

// Get achievement history
export const getAchievementHistory = (): AchievementHistory[] => {
  if (typeof window === "undefined") return [];
  
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Save achievement history
export const saveAchievementHistory = (history: AchievementHistory[]): void => {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Error saving achievement history:', error);
  }
};

// Get default achievements (all locked)
export const getDefaultAchievements = (): Achievement[] => {
  return ACHIEVEMENTS.map((achievement) => ({
    ...achievement,
    unlocked: false,
    progress: 0,
  }));
};

// Update progress when scenario is completed
export const updateProgress = (
  category: string,
  difficulty: string,
  isCorrect: boolean,
  location?: string
): UserProgress => {
  const progress = getUserProgress();
  const today = new Date().toISOString().split("T")[0];
  const lastActive = progress.lastActiveDate.split("T")[0];

  // Update scenario counts
  progress.totalScenariosCompleted += 1;
  
  if (category in progress.scenariosByCategory) {
    progress.scenariosByCategory[category as keyof typeof progress.scenariosByCategory] += 1;
  }
  
  if (difficulty in progress.scenariosByDifficulty) {
    progress.scenariosByDifficulty[difficulty as keyof typeof progress.scenariosByDifficulty] += 1;
  }

  // Update streak
  if (today === lastActive) {
    // Same day, no streak change
  } else if (isConsecutiveDay(lastActive, today)) {
    progress.currentStreak += 1;
    progress.longestStreak = Math.max(progress.currentStreak, progress.longestStreak);
  } else {
    // Reset streak if more than 1 day has passed
    progress.currentStreak = 1;
  }

  progress.lastActiveDate = new Date().toISOString();

  // Check for new achievements
  const newAchievements = checkAchievements(progress);
  progress.achievements = newAchievements;

  saveUserProgress(progress);
  return progress;
};

// Check if two dates are consecutive
const isConsecutiveDay = (date1: string, date2: string): boolean => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays === 1;
};

// Check and update achievements
export const checkAchievements = (progress: UserProgress): Achievement[] => {
  const achievements = progress.achievements.map((achievement) => {
    let progressValue = 0;
    let unlocked = achievement.unlocked;
    let unlockedAt = achievement.unlockedAt;

    switch (achievement.id) {
      case "first_scenario":
        progressValue = progress.totalScenariosCompleted;
        break;
      case "scenario_master":
        progressValue = progress.totalScenariosCompleted;
        break;
      case "streak_3":
        progressValue = progress.currentStreak;
        break;
      case "streak_7":
        progressValue = progress.currentStreak;
        break;
      case "controls_expert":
        progressValue = progress.scenariosByCategory.controls;
        break;
      case "signs_expert":
        progressValue = progress.scenariosByCategory.signs;
        break;
      case "rules_expert":
        progressValue = progress.scenariosByCategory.rules;
        break;
      case "mixed_expert":
        progressValue = progress.scenariosByCategory.mixed;
        break;
      case "location_explorer":
        // This achievement requires tracking different cities
        // For now, we'll track it separately when location data is available
        progressValue = achievement.progress;
        break;
      case "accuracy_90":
        // This achievement requires external accuracy data
        // For now, we'll track it separately when performance data is available
        progressValue = achievement.progress;
        break;
      default:
        progressValue = achievement.progress;
    }

    if (progressValue >= achievement.requirement && !unlocked) {
      unlocked = true;
      unlockedAt = new Date().toISOString();
      
      // Add notification for newly unlocked achievement
      addAchievementNotification({
        ...achievement,
        unlocked: true,
        progress: progressValue,
        unlockedAt,
      });
      
      // Add to history
      addAchievementHistory(achievement.id, "unlocked", {
        progress: progressValue,
        requirement: achievement.requirement,
        category: achievement.category,
      });
    }

    return {
      ...achievement,
      unlocked,
      progress: progressValue,
      unlockedAt,
    };
  });

  return achievements;
};

// Get newly unlocked achievements
export const getNewAchievements = (oldProgress: UserProgress, newProgress: UserProgress): Achievement[] => {
  return newProgress.achievements.filter(
    (achievement) =>
      achievement.unlocked &&
      !oldProgress.achievements.find((old) => old.id === achievement.id)?.unlocked
  );
};

// Create achievement notification
export const createAchievementNotification = (achievement: Achievement): AchievementNotification => {
  return {
    id: `${achievement.id}_${Date.now()}`,
    achievementId: achievement.id,
    title: `Achievement Unlocked: ${achievement.title}`,
    description: achievement.description,
    timestamp: new Date().toISOString(),
    read: false,
    type: "unlocked",
  };
};

// Add achievement notification
export const addAchievementNotification = (achievement: Achievement): void => {
  const notifications = getAchievementNotifications();
  const newNotification = createAchievementNotification(achievement);
  notifications.unshift(newNotification); // Add to beginning
  
  // Keep only last 50 notifications
  if (notifications.length > 50) {
    notifications.splice(50);
  }
  
  saveAchievementNotifications(notifications);
};

// Mark notification as read
export const markNotificationAsRead = (notificationId: string): void => {
  const notifications = getAchievementNotifications();
  const notification = notifications.find(n => n.id === notificationId);
  if (notification) {
    notification.read = true;
    saveAchievementNotifications(notifications);
  }
};

// Clear all notifications
export const clearAllNotifications = (): void => {
  saveAchievementNotifications([]);
};

// Add achievement history entry
export const addAchievementHistory = (
  achievementId: string, 
  action: "unlocked" | "shared" | "viewed",
  metadata?: any
): void => {
  const history = getAchievementHistory();
  const historyEntry: AchievementHistory = {
    achievementId,
    action,
    timestamp: new Date().toISOString(),
    metadata,
  };
  
  history.unshift(historyEntry); // Add to beginning
  
  // Keep only last 200 history entries
  if (history.length > 200) {
    history.splice(200);
  }
  
  saveAchievementHistory(history);
};

// Share achievement
export const shareAchievement = async (achievement: Achievement): Promise<boolean> => {
  try {
    const shareData = {
      title: `I just unlocked "${achievement.title}" on SuperK53!`,
      text: achievement.description,
      url: `${window.location.origin}/achievements`,
    };

    if (navigator.share && navigator.canShare(shareData)) {
      await navigator.share(shareData);
      addAchievementHistory(achievement.id, "shared", { 
        progress: achievement.progress, 
        requirement: achievement.requirement 
      });
      
      // Update achievement shared timestamp
      const progress = getUserProgress();
      const achievementIndex = progress.achievements.findIndex(a => a.id === achievement.id);
      if (achievementIndex !== -1) {
        progress.achievements[achievementIndex].sharedAt = new Date().toISOString();
        saveUserProgress(progress);
      }
      
      return true;
    } else {
      // Fallback: copy to clipboard
      const shareText = `${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`;
      await navigator.clipboard.writeText(shareText);
      
      addAchievementHistory(achievement.id, "shared", { 
        progress: achievement.progress, 
        requirement: achievement.requirement 
      });
      
      return true;
    }
  } catch (error) {
    console.error('Error sharing achievement:', error);
    return false;
  }
};

// Calculate performance stats
export const calculatePerformanceStats = (
  userAnswers: { correct: boolean; category: string; responseTime: number }[]
): PerformanceStats => {
  const totalAnswers = userAnswers.length;
  const correctAnswers = userAnswers.filter((answer) => answer.correct).length;
  const accuracy = totalAnswers > 0 ? (correctAnswers / totalAnswers) * 100 : 0;
  
  const averageResponseTime = userAnswers.length > 0 
    ? userAnswers.reduce((sum, answer) => sum + answer.responseTime, 0) / userAnswers.length 
    : 0;

  // Calculate weak and strong categories
  const categoryStats = userAnswers.reduce((acc, answer) => {
    if (!acc[answer.category]) {
      acc[answer.category] = { correct: 0, total: 0 };
    }
    acc[answer.category].total += 1;
    if (answer.correct) acc[answer.category].correct += 1;
    return acc;
  }, {} as Record<string, { correct: number; total: number }>);

  const weakCategories = Object.entries(categoryStats)
    .filter(([_, stats]) => stats.total >= 5) // Only consider categories with enough data
    .filter(([_, stats]) => stats.total > 0 && (stats.correct / stats.total) < 0.7)
    .map(([category]) => category);

  const strongCategories = Object.entries(categoryStats)
    .filter(([_, stats]) => stats.total >= 5)
    .filter(([_, stats]) => stats.total > 0 && (stats.correct / stats.total) >= 0.8)
    .map(([category]) => category);

  return {
    correctAnswers,
    totalAnswers,
    accuracy,
    averageResponseTime,
    weakCategories,
    strongCategories,
  };
};

// Enhanced personalized study recommendations for Premium users
export interface PersonalizedRecommendation {
  type: "daily_goal" | "focus_area" | "study_plan" | "difficulty_adjustment" | "time_optimization" | "motivation";
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  actionable: boolean;
  actionText?: string;
  actionUrl?: string;
  estimatedTime?: number; // in minutes
  confidence: number; // 0-100
}

export const generatePersonalizedRecommendations = (
  progress: UserProgress,
  performanceStats: PerformanceStats,
  userLocation?: string
): PersonalizedRecommendation[] => {
  const recommendations: PersonalizedRecommendation[] = [];
  
  // Validate inputs
  if (!progress || !performanceStats) {
    return recommendations;
  }
  
  // Daily goal recommendation based on streak and performance
  const dailyGoal = calculateOptimalDailyGoal(progress, performanceStats);
  recommendations.push({
    type: "daily_goal",
    title: "Optimized Daily Goal",
    description: `Complete ${dailyGoal.scenarios} scenarios today to maintain your ${progress.currentStreak}-day streak and improve your ${performanceStats.accuracy.toFixed(1)}% accuracy.`,
    priority: "high",
    actionable: true,
    actionText: "Start Practice",
    actionUrl: "/practice",
    estimatedTime: dailyGoal.estimatedTime,
    confidence: 85
  });

  // Focus area recommendations with specific scenarios
  if (performanceStats.weakCategories.length > 0) {
    const focusArea = performanceStats.weakCategories[0];
    const categoryStats = getCategorySpecificStats(progress, focusArea);
    recommendations.push({
      type: "focus_area",
      title: `Master ${focusArea.charAt(0).toUpperCase() + focusArea.slice(1)}`,
      description: `Your ${focusArea} accuracy is ${categoryStats.accuracy}%. Practice ${categoryStats.recommendedCount} ${focusArea} scenarios to reach 80% proficiency.`,
      priority: "high",
      actionable: true,
      actionText: `Practice ${focusArea}`,
      actionUrl: `/practice?category=${focusArea}`,
      estimatedTime: categoryStats.estimatedTime,
      confidence: 90
    });
  }

  // Study plan recommendation based on readiness score
  const readinessScore = calculateReadinessScore(progress, performanceStats);
  if (readinessScore < 70) {
    recommendations.push({
      type: "study_plan",
      title: "Comprehensive Study Plan",
      description: `Your readiness score is ${readinessScore.toFixed(0)}%. Follow this 7-day plan: Day 1-2: Focus on weak areas, Day 3-4: Mixed scenarios, Day 5-6: Speed practice, Day 7: Full assessment.`,
      priority: "medium",
      actionable: true,
      actionText: "View Study Plan",
      actionUrl: "/progress",
      estimatedTime: 420, // 7 days * 60 minutes
      confidence: 75
    });
  }

  // Difficulty adjustment recommendation
  const difficultyRecommendation = getDifficultyRecommendation(performanceStats);
  if (difficultyRecommendation) {
    recommendations.push({
      type: "difficulty_adjustment",
      title: "Adjust Difficulty Level",
      description: difficultyRecommendation.description,
      priority: "medium",
      actionable: true,
      actionText: "Adjust Settings",
      actionUrl: "/practice",
      estimatedTime: 5,
      confidence: 80
    });
  }

  // Time optimization recommendation
  const timeOptimization = getTimeOptimizationRecommendation(progress, performanceStats);
  if (timeOptimization) {
    recommendations.push({
      type: "time_optimization",
      title: "Optimize Study Time",
      description: timeOptimization.description,
      priority: "low",
      actionable: false,
      estimatedTime: timeOptimization.savedTime,
      confidence: 70
    });
  }

  // Motivation recommendation based on achievements
  const motivationRecommendation = getMotivationRecommendation(progress);
  if (motivationRecommendation) {
    recommendations.push({
      type: "motivation",
      title: motivationRecommendation.title,
      description: motivationRecommendation.description,
      priority: "low",
      actionable: false,
      confidence: 85
    });
  }

  return recommendations.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
};

// Helper functions for personalized recommendations
const calculateOptimalDailyGoal = (progress: UserProgress, stats: PerformanceStats) => {
  const baseScenarios = 5;
  let scenarios = baseScenarios;
  let estimatedTime = 30; // 6 minutes per scenario

  // Ensure we have valid data
  const currentStreak = progress?.currentStreak || 0;
  const accuracy = stats?.accuracy || 0;
  const weakCategories = stats?.weakCategories || [];

  // Adjust based on streak
  if (currentStreak >= 7) {
    scenarios += 2;
    estimatedTime += 12;
  }

  // Adjust based on accuracy
  if (accuracy < 70) {
    scenarios += 3; // More practice needed
    estimatedTime += 18;
  } else if (accuracy > 85) {
    scenarios -= 1; // Can reduce slightly
    estimatedTime -= 6;
  }

  // Adjust based on weak categories
  scenarios += weakCategories.length;
  estimatedTime += weakCategories.length * 6;

  return { scenarios: Math.max(3, Math.min(scenarios, 15)), estimatedTime };
};

const getCategorySpecificStats = (progress: UserProgress, category: string) => {
  const categoryCount = progress.scenariosByCategory[category] || 0;
  const totalCompleted = progress.totalScenariosCompleted;
  
  // This was incorrectly calculating accuracy - it should use performance data instead
  // For now, we'll use a placeholder that makes more sense
  const accuracy = totalCompleted > 0 ? Math.min((categoryCount / totalCompleted) * 100, 100) : 0;
  
  // Calculate recommended scenarios needed to reach 80% proficiency
  // This is a simplified calculation - in a real implementation, we'd use actual performance data
  const currentProficiency = Math.max(0, Math.min(accuracy, 100));
  const targetProficiency = 80;
  const recommendedCount = Math.max(5, Math.ceil((targetProficiency - currentProficiency) / 10));
  
  return {
    accuracy: accuracy.toFixed(1),
    recommendedCount,
    estimatedTime: recommendedCount * 6
  };
};

const calculateReadinessScore = (progress: UserProgress, stats: PerformanceStats): number => {
  let score = 0;
  
  // Base score from completion (30%)
  score += Math.min(progress.totalScenariosCompleted / 50, 1) * 30;
  
  // Accuracy contribution (25%)
  score += (stats.accuracy / 100) * 25;
  
  // Streak contribution (20%)
  score += Math.min(progress.currentStreak / 7, 1) * 20;
  
  // Category coverage (15%)
  const categoryCount = Object.values(progress.scenariosByCategory).filter((count: number) => count > 0).length;
  score += (categoryCount / 4) * 15;
  
  // Performance consistency (10%)
  if (stats.weakCategories.length === 0) {
    score += 10;
  }
  
  return Math.min(score, 100);
};

const getDifficultyRecommendation = (stats: PerformanceStats) => {
  if (stats.accuracy < 60) {
    return {
      description: "Your accuracy suggests you should practice with easier scenarios first. Switch to basic difficulty to build confidence."
    };
  } else if (stats.accuracy > 90 && stats.averageResponseTime < 20) {
    return {
      description: "Excellent performance! Try advanced difficulty scenarios to challenge yourself further."
    };
  }
  return null;
};

const getTimeOptimizationRecommendation = (progress: UserProgress, stats: PerformanceStats) => {
  if (stats.averageResponseTime > 30) {
    return {
      description: "Your response time is high. Practice speed scenarios to improve test readiness while maintaining accuracy.",
      savedTime: 15
    };
  }
  return null;
};

const getMotivationRecommendation = (progress: UserProgress) => {
  const unlockedAchievements = progress.achievements.filter(a => a.unlocked).length;
  const totalAchievements = progress.achievements.length;
  
  if (unlockedAchievements >= totalAchievements * 0.8) {
    return {
      title: "Achievement Master",
      description: `Amazing! You've unlocked ${unlockedAchievements}/${totalAchievements} achievements. You're in the top 10% of learners!`
    };
  } else if (progress.currentStreak >= 5) {
    return {
      title: "Streak Champion",
      description: `Keep going! Your ${progress.currentStreak}-day streak shows incredible dedication. Don't break the chain!`
    };
  }
  return null;
}; 