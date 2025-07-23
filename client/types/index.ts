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
  id: string;
  user_id: string;
  test_type: "questions" | "scenarios";
  score: number;
  total_questions: number;
  categories: Record<
    string,
    { correct: number; total: number; required: number }
  >;
  passed: boolean;
  location_used?: string;
  completed_at: string;
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
