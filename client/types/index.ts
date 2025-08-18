// Comprehensive type definitions for the K53 application

export interface K53Question {
  id: string;
  category: "controls" | "signs" | "rules";
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  language: "en" | "af" | "zu";
}

export interface K53Scenario {
  id: string;
  category: "controls" | "signs" | "rules" | "mixed";
  title: string;
  scenario: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  difficulty: "basic" | "intermediate" | "advanced";
  context:
    | "urban"
    | "rural"
    | "highway"
    | "parking"
    | "intersection"
    | "residential";
  timeOfDay?: "morning" | "afternoon" | "evening" | "night";
  weather?: "clear" | "rain" | "fog" | "wind";
  language: "en" | "af" | "zu";
  location?: LocationContext;
}

export interface LocationContext {
  specificity: "city" | "region" | "national";
  cities?: string[];
  regions?: string[];
  neighborhoods?: string[];
}

export interface UserLocation {
  city: string;
  region: string;
  neighborhood?: string;
  displayName: string;
  latitude?: number;
  longitude?: number;
}

export interface TestResult {
  category: string;
  correct: number;
  total: number;
  required: number;
  passed: boolean;
}

export interface UserProgress {
  totalScenariosCompleted: number;
  scenariosByCategory: {
    controls: number;
    signs: number;
    rules: number;
    mixed: number;
  };
  scenariosByDifficulty: {
    basic: number;
    intermediate: number;
    advanced: number;
  };
  currentStreak: number;
  longestStreak: number;
  achievements: Achievement[];
  weakAreas: string[];
  lastActiveDate: string;
}

export interface UserStats {
  totalTests: number;
  passedTests: number;
  passRate: number;
  averageScore: number;
  scenarioTests: number;
  questionTests: number;
  recentProgress: UserProgress[];
}

export interface DatabaseScenario {
  id: string;
  category: string;
  title: string;
  scenario: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  difficulty: string;
  context: string;
  time_of_day?: string;
  weather?: string;
  language: string;
  location?: any;
  created_at: string;
  updated_at: string;
}

export interface DatabaseQuestion {
  id: string;
  category: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  language: string;
  created_at: string;
  updated_at: string;
}

export interface AuthFormData {
  email: string;
  password: string;
  fullName?: string;
  location?: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  testType: "questions" | "scenarios";
  completedAt: string;
}

export type TestMode = "questions" | "scenarios";
export type Difficulty = "basic" | "intermediate" | "advanced";
export type Category = "controls" | "signs" | "rules" | "mixed";
export type Language = "en" | "af" | "zu";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: "scenarios" | "questions" | "location" | "streak" | "mastery";
  requirement: number;
  unlocked: boolean;
  progress: number;
  unlockedAt?: string; // ISO timestamp when achievement was unlocked
  sharedAt?: string; // ISO timestamp when achievement was last shared
}

export interface AchievementNotification {
  id: string;
  achievementId: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  type: "unlocked" | "shared" | "milestone";
}

export interface AchievementHistory {
  achievementId: string;
  action: "unlocked" | "shared" | "viewed";
  timestamp: string;
  metadata?: {
    progress?: number;
    requirement?: number;
    category?: string;
  };
}

export interface PerformanceStats {
  correctAnswers: number;
  totalAnswers: number;
  accuracy: number;
  averageResponseTime: number;
  weakCategories: string[];
  strongCategories: string[];
}

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
