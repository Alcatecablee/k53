import { supabase } from '@/lib/supabase';
import { ImageAsset } from '@/data/imageMapping';

// ========================================
// PHASE 1: Core Learning Features
// ========================================

// Flashcard Progress Types
export interface FlashcardProgress {
  id: string;
  user_id: string;
  image_id: string;
  difficulty: number;
  last_reviewed: string;
  next_review: string;
  review_count: number;
  correct_count: number;
  mastered: boolean;
  created_at: string;
  updated_at: string;
}

export interface FlashcardSession {
  id: string;
  user_id: string;
  mode: 'study' | 'test' | 'review';
  total_cards: number;
  correct_answers: number;
  incorrect_answers: number;
  start_time: string;
  end_time?: string;
  duration_seconds?: number;
  created_at: string;
}

// Flashcard Services
export const flashcardService = {
  // Get user's flashcard progress
  async getProgress(userId: string): Promise<FlashcardProgress[]> {
    try {
      const { data, error } = await supabase
        .from('flashcard_progress')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching flashcard progress:', error);
      return [];
    }
  },

  // Get progress for specific image
  async getImageProgress(userId: string, imageId: string): Promise<FlashcardProgress | null> {
    try {
      const { data, error } = await supabase
        .from('flashcard_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('image_id', imageId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching image progress:', error);
      return null;
    }
  },

  // Update flashcard progress
  async updateProgress(progress: Partial<FlashcardProgress> & { user_id: string; image_id: string }): Promise<FlashcardProgress | null> {
    try {
      const { data, error } = await supabase
        .from('flashcard_progress')
        .upsert(progress, { onConflict: 'user_id,image_id' })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating flashcard progress:', error);
      return null;
    }
  },

  // Create flashcard session
  async createSession(session: Omit<FlashcardSession, 'id' | 'created_at'>): Promise<FlashcardSession | null> {
    try {
      const { data, error } = await supabase
        .from('flashcard_sessions')
        .insert(session)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating flashcard session:', error);
      return null;
    }
  },

  // Update flashcard session
  async updateSession(sessionId: string, updates: Partial<FlashcardSession>): Promise<FlashcardSession | null> {
    try {
      const { data, error } = await supabase
        .from('flashcard_sessions')
        .update(updates)
        .eq('id', sessionId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating flashcard session:', error);
      return null;
    }
  },

  // Get mastered flashcards
  async getMasteredCards(userId: string): Promise<FlashcardProgress[]> {
    try {
      const { data, error } = await supabase
        .from('flashcard_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('mastered', true);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching mastered cards:', error);
      return [];
    }
  },

  // Get due for review flashcards
  async getDueForReview(userId: string): Promise<FlashcardProgress[]> {
    try {
      const { data, error } = await supabase
        .from('flashcard_progress')
        .select('*')
        .eq('user_id', userId)
        .lte('next_review', new Date().toISOString());

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching due for review cards:', error);
      return [];
    }
  }
};

// Image Comparison Types
export interface ImageComparison {
  id: string;
  user_id: string;
  left_image_id: string;
  right_image_id: string;
  category: string;
  difficulty: 'basic' | 'intermediate' | 'advanced';
  user_choice?: 'left' | 'right';
  correct_choice?: 'left' | 'right';
  time_taken_ms?: number;
  completed_at: string;
  created_at: string;
}

// Image Comparison Services
export const comparisonService = {
  // Record comparison interaction
  async recordComparison(comparison: Omit<ImageComparison, 'id' | 'created_at'>): Promise<ImageComparison | null> {
    try {
      const { data, error } = await supabase
        .from('image_comparisons')
        .insert(comparison)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error recording comparison:', error);
      return null;
    }
  },

  // Get user's comparison history
  async getComparisonHistory(userId: string, limit = 50): Promise<ImageComparison[]> {
    try {
      const { data, error } = await supabase
        .from('image_comparisons')
        .select('*')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching comparison history:', error);
      return [];
    }
  },

  // Get comparison statistics
  async getComparisonStats(userId: string): Promise<{ total: number; correct: number; accuracy: number }> {
    try {
      const { data, error } = await supabase
        .from('image_comparisons')
        .select('user_choice, correct_choice')
        .eq('user_id', userId)
        .not('user_choice', 'is', null)
        .not('correct_choice', 'is', null);

      if (error) throw error;

      const total = data?.length || 0;
      const correct = data?.filter(c => c.user_choice === c.correct_choice).length || 0;
      const accuracy = total > 0 ? (correct / total) * 100 : 0;

      return { total, correct, accuracy };
    } catch (error) {
      console.error('Error fetching comparison stats:', error);
      return { total: 0, correct: 0, accuracy: 0 };
    }
  }
};

// Search Types
export interface SearchHistory {
  id: string;
  user_id: string;
  search_text?: string;
  filters: Record<string, any>;
  results_count: number;
  search_type: 'text' | 'filter' | 'advanced';
  created_at: string;
}

export interface SavedSearch {
  id: string;
  user_id: string;
  name: string;
  filters: Record<string, any>;
  is_default: boolean;
  created_at: string;
  last_used: string;
  updated_at: string;
}

// Search Services
export const searchService = {
  // Record search history
  async recordSearch(search: Omit<SearchHistory, 'id' | 'created_at'>): Promise<SearchHistory | null> {
    try {
      const { data, error } = await supabase
        .from('search_history')
        .insert(search)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error recording search:', error);
      return null;
    }
  },

  // Get search history
  async getSearchHistory(userId: string, limit = 20): Promise<SearchHistory[]> {
    try {
      const { data, error } = await supabase
        .from('search_history')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching search history:', error);
      return [];
    }
  },

  // Save search
  async saveSearch(search: Omit<SavedSearch, 'id' | 'created_at' | 'last_used' | 'updated_at'>): Promise<SavedSearch | null> {
    try {
      const { data, error } = await supabase
        .from('saved_searches')
        .insert(search)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error saving search:', error);
      return null;
    }
  },

  // Get saved searches
  async getSavedSearches(userId: string): Promise<SavedSearch[]> {
    try {
      const { data, error } = await supabase
        .from('saved_searches')
        .select('*')
        .eq('user_id', userId)
        .order('last_used', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching saved searches:', error);
      return [];
    }
  },

  // Update saved search last used
  async updateSavedSearchLastUsed(searchId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('saved_searches')
        .update({ last_used: new Date().toISOString() })
        .eq('id', searchId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating saved search last used:', error);
    }
  },

  // Delete saved search
  async deleteSavedSearch(searchId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('saved_searches')
        .delete()
        .eq('id', searchId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting saved search:', error);
      return false;
    }
  }
};

// ========================================
// PHASE 2: Advanced Learning Features
// ========================================

// Scenario Types
export interface ImageScenario {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'basic' | 'intermediate' | 'advanced';
  estimated_time: number;
  tags: string[];
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface ScenarioImage {
  id: string;
  scenario_id: string;
  image_id: string;
  order_index: number;
  description?: string;
  action?: string;
  delay_ms: number;
  context: string[];
  created_at: string;
}

export interface ScenarioDecision {
  id: string;
  scenario_id: string;
  scenario_image_id: string;
  question: string;
  options: Array<{
    id: string;
    text: string;
    nextImageId?: string;
    feedback: string;
    correct: boolean;
  }>;
  created_at: string;
}

export interface ScenarioSession {
  id: string;
  user_id: string;
  scenario_id: string;
  start_time: string;
  end_time?: string;
  completed: boolean;
  score: number;
  total_decisions: number;
  correct_decisions: number;
  created_at: string;
}

// Scenario Services
export const scenarioService = {
  // Create scenario
  async createScenario(scenario: Omit<ImageScenario, 'id' | 'created_at' | 'updated_at'>): Promise<ImageScenario | null> {
    try {
      const { data, error } = await supabase
        .from('image_scenarios')
        .insert(scenario)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating scenario:', error);
      return null;
    }
  },

  // Get user scenarios
  async getUserScenarios(userId: string): Promise<ImageScenario[]> {
    try {
      const { data, error } = await supabase
        .from('image_scenarios')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user scenarios:', error);
      return [];
    }
  },

  // Get public scenarios
  async getPublicScenarios(limit = 20): Promise<ImageScenario[]> {
    try {
      const { data, error } = await supabase
        .from('image_scenarios')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching public scenarios:', error);
      return [];
    }
  },

  // Add images to scenario
  async addScenarioImages(scenarioId: string, images: Omit<ScenarioImage, 'id' | 'scenario_id' | 'created_at'>[]): Promise<ScenarioImage[]> {
    try {
      const imagesWithScenarioId = images.map(img => ({ ...img, scenario_id: scenarioId }));
      const { data, error } = await supabase
        .from('scenario_images')
        .insert(imagesWithScenarioId)
        .select();

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error adding scenario images:', error);
      return [];
    }
  },

  // Add decision point to scenario
  async addScenarioDecision(decision: Omit<ScenarioDecision, 'id' | 'created_at'>): Promise<ScenarioDecision | null> {
    try {
      const { data, error } = await supabase
        .from('scenario_decisions')
        .insert(decision)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding scenario decision:', error);
      return null;
    }
  },

  // Start scenario session
  async startScenarioSession(session: Omit<ScenarioSession, 'id' | 'created_at'>): Promise<ScenarioSession | null> {
    try {
      const { data, error } = await supabase
        .from('scenario_sessions')
        .insert(session)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error starting scenario session:', error);
      return null;
    }
  },

  // Complete scenario session
  async completeScenarioSession(sessionId: string, updates: Partial<ScenarioSession>): Promise<ScenarioSession | null> {
    try {
      const { data, error } = await supabase
        .from('scenario_sessions')
        .update(updates)
        .eq('id', sessionId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error completing scenario session:', error);
      return null;
    }
  }
};

// Location Types
export interface LocationLearning {
  id: string;
  user_id: string;
  location_name: string;
  location_coordinates: { lat: number; lng: number };
  region: string;
  province: string;
  driving_conditions: string[];
  special_rules: string[];
  difficulty: 'basic' | 'intermediate' | 'advanced';
  population?: number;
  description: string;
  images: string[];
  created_at: string;
  updated_at: string;
}

export interface LocationSession {
  id: string;
  user_id: string;
  location_id: string;
  current_image_index: number;
  start_time: string;
  end_time?: string;
  completed: boolean;
  score: number;
  total_questions: number;
  created_at: string;
}

// Location Services
export const locationService = {
  // Create location learning data
  async createLocation(location: Omit<LocationLearning, 'id' | 'created_at' | 'updated_at'>): Promise<LocationLearning | null> {
    try {
      const { data, error } = await supabase
        .from('location_learning')
        .insert(location)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating location:', error);
      return null;
    }
  },

  // Get user locations
  async getUserLocations(userId: string): Promise<LocationLearning[]> {
    try {
      const { data, error } = await supabase
        .from('location_learning')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user locations:', error);
      return [];
    }
  },

  // Start location session
  async startLocationSession(session: Omit<LocationSession, 'id' | 'created_at'>): Promise<LocationSession | null> {
    try {
      const { data, error } = await supabase
        .from('location_sessions')
        .insert(session)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error starting location session:', error);
      return null;
    }
  },

  // Complete location session
  async completeLocationSession(sessionId: string, updates: Partial<LocationSession>): Promise<LocationSession | null> {
    try {
      const { data, error } = await supabase
        .from('location_sessions')
        .update(updates)
        .eq('id', sessionId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error completing location session:', error);
      return null;
    }
  }
};

// ========================================
// PHASE 3: Analytics & Personalization
// ========================================

// Analytics Types
export interface UserAnalytics {
  id: string;
  user_id: string;
  category_performance: Record<string, any>;
  time_spent: Record<string, any>;
  difficulty_progress: Record<string, any>;
  total_study_time: number;
  total_sessions: number;
  average_accuracy: number;
  readiness_score: number;
  last_study_date?: string;
  streak_days: number;
  created_at: string;
  updated_at: string;
}

export interface LearningRecommendation {
  id: string;
  user_id: string;
  type: 'focus' | 'review' | 'practice' | 'mastery';
  category: string;
  difficulty: 'basic' | 'intermediate' | 'advanced';
  priority: 'high' | 'medium' | 'low';
  description: string;
  estimated_time: number;
  reason: string;
  is_completed: boolean;
  created_at: string;
  completed_at?: string;
}

export interface LearningPath {
  id: string;
  user_id: string;
  title: string;
  description: string;
  total_time: number;
  completed_time: number;
  progress: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  adaptive: boolean;
  status: 'active' | 'paused' | 'completed';
  created_at: string;
  last_accessed: string;
  updated_at: string;
}

export interface LearningObjective {
  id: string;
  learning_path_id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'basic' | 'intermediate' | 'advanced';
  estimated_time: number;
  completed: boolean;
  progress: number;
  prerequisites: string[];
  skills: string[];
  order_index: number;
  created_at: string;
  completed_at?: string;
}

export interface PerformanceGap {
  id: string;
  user_id: string;
  category: string;
  difficulty: 'basic' | 'intermediate' | 'advanced';
  current_level: number;
  target_level: number;
  gap_size: number;
  priority: 'high' | 'medium' | 'low';
  recommended_actions: string[];
  created_at: string;
  updated_at: string;
}

// Analytics Services
export const analyticsService = {
  // Get user analytics
  async getUserAnalytics(userId: string): Promise<UserAnalytics | null> {
    try {
      const { data, error } = await supabase
        .from('user_analytics')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user analytics:', error);
      return null;
    }
  },

  // Update user analytics
  async updateUserAnalytics(analytics: Partial<UserAnalytics> & { user_id: string }): Promise<UserAnalytics | null> {
    try {
      const { data, error } = await supabase
        .from('user_analytics')
        .upsert(analytics, { onConflict: 'user_id' })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating user analytics:', error);
      return null;
    }
  },

  // Create learning recommendation
  async createRecommendation(recommendation: Omit<LearningRecommendation, 'id' | 'created_at'>): Promise<LearningRecommendation | null> {
    try {
      const { data, error } = await supabase
        .from('learning_recommendations')
        .insert(recommendation)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating recommendation:', error);
      return null;
    }
  },

  // Get user recommendations
  async getUserRecommendations(userId: string): Promise<LearningRecommendation[]> {
    try {
      const { data, error } = await supabase
        .from('learning_recommendations')
        .select('*')
        .eq('user_id', userId)
        .eq('is_completed', false)
        .order('priority', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user recommendations:', error);
      return [];
    }
  },

  // Create learning path
  async createLearningPath(path: Omit<LearningPath, 'id' | 'created_at' | 'last_accessed' | 'updated_at'>): Promise<LearningPath | null> {
    try {
      const { data, error } = await supabase
        .from('learning_paths')
        .insert(path)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating learning path:', error);
      return null;
    }
  },

  // Get user learning paths
  async getUserLearningPaths(userId: string): Promise<LearningPath[]> {
    try {
      const { data, error } = await supabase
        .from('learning_paths')
        .select('*')
        .eq('user_id', userId)
        .order('last_accessed', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user learning paths:', error);
      return [];
    }
  },

  // Add learning objective
  async addLearningObjective(objective: Omit<LearningObjective, 'id' | 'created_at'>): Promise<LearningObjective | null> {
    try {
      const { data, error } = await supabase
        .from('learning_objectives')
        .insert(objective)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding learning objective:', error);
      return null;
    }
  },

  // Update learning objective progress
  async updateObjectiveProgress(objectiveId: string, progress: number, completed: boolean = false): Promise<LearningObjective | null> {
    try {
      const updates: Partial<LearningObjective> = { progress };
      if (completed) {
        updates.completed = true;
        updates.completed_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('learning_objectives')
        .update(updates)
        .eq('id', objectiveId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating objective progress:', error);
      return null;
    }
  },

  // Create performance gap
  async createPerformanceGap(gap: Omit<PerformanceGap, 'id' | 'created_at' | 'updated_at'>): Promise<PerformanceGap | null> {
    try {
      const { data, error } = await supabase
        .from('performance_gaps')
        .insert(gap)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating performance gap:', error);
      return null;
    }
  },

  // Get user performance gaps
  async getUserPerformanceGaps(userId: string): Promise<PerformanceGap[]> {
    try {
      const { data, error } = await supabase
        .from('performance_gaps')
        .select('*')
        .eq('user_id', userId)
        .order('priority', { ascending: false })
        .order('gap_size', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching performance gaps:', error);
      return [];
    }
  }
};

// ========================================
// PHASE 4: Export & Sharing
// ========================================

// Export Types
export interface ExportCollection {
  id: string;
  user_id: string;
  name: string;
  description: string;
  category: string;
  difficulty: 'basic' | 'intermediate' | 'advanced';
  tags: string[];
  is_public: boolean;
  created_at: string;
  last_modified: string;
  updated_at: string;
}

export interface CollectionImage {
  id: string;
  collection_id: string;
  image_id: string;
  order_index: number;
  created_at: string;
}

export interface ExportHistory {
  id: string;
  user_id: string;
  collection_id: string;
  format: 'pdf' | 'png' | 'jpg';
  quality: 'low' | 'medium' | 'high';
  settings: Record<string, any>;
  file_size?: number;
  download_count: number;
  created_at: string;
}

export interface ShareHistory {
  id: string;
  user_id: string;
  collection_id: string;
  platform: 'email' | 'whatsapp' | 'telegram' | 'copy-link';
  recipient_email?: string;
  message: string;
  include_progress: boolean;
  include_notes: boolean;
  shared_at: string;
}

// Mobile Types
export interface MobileSettings {
  id: string;
  user_id: string;
  touch_gestures: boolean;
  voice_commands: boolean;
  offline_caching: boolean;
  image_compression: boolean;
  lazy_loading: boolean;
  progressive_loading: boolean;
  cache_management: boolean;
  mobile_ui: boolean;
  swipe_navigation: boolean;
  pinch_zoom: boolean;
  haptic_feedback: boolean;
  auto_rotate: boolean;
  battery_optimization: boolean;
  data_saver: boolean;
  compression_level: number;
  cache_size_mb: number;
  lazy_load_threshold: number;
  created_at: string;
  updated_at: string;
}

export interface VoiceCommand {
  id: string;
  user_id: string;
  phrase: string;
  action: string;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface CacheInfo {
  id: string;
  user_id: string;
  total_size_mb: number;
  image_count: number;
  compression_ratio: number;
  cache_hit_rate: number;
  last_updated: string;
  created_at: string;
  updated_at: string;
}

export interface PerformanceMetrics {
  id: string;
  user_id: string;
  load_time_ms: number;
  memory_usage_mb: number;
  battery_drain_percent: number;
  data_usage_mb: number;
  cache_efficiency: number;
  recorded_at: string;
  created_at: string;
}

// Export Services
export const exportService = {
  // Create export collection
  async createCollection(collection: Omit<ExportCollection, 'id' | 'created_at' | 'last_modified' | 'updated_at'>): Promise<ExportCollection | null> {
    try {
      const { data, error } = await supabase
        .from('export_collections')
        .insert(collection)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating export collection:', error);
      return null;
    }
  },

  // Get user collections
  async getUserCollections(userId: string): Promise<ExportCollection[]> {
    try {
      const { data, error } = await supabase
        .from('export_collections')
        .select('*')
        .eq('user_id', userId)
        .order('last_modified', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user collections:', error);
      return [];
    }
  },

  // Get public collections
  async getPublicCollections(limit = 20): Promise<ExportCollection[]> {
    try {
      const { data, error } = await supabase
        .from('export_collections')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching public collections:', error);
      return [];
    }
  },

  // Add images to collection
  async addCollectionImages(collectionId: string, imageIds: string[]): Promise<CollectionImage[]> {
    try {
      const images = imageIds.map((imageId, index) => ({
        collection_id: collectionId,
        image_id: imageId,
        order_index: index
      }));

      const { data, error } = await supabase
        .from('collection_images')
        .insert(images)
        .select();

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error adding collection images:', error);
      return [];
    }
  },

  // Get collection images
  async getCollectionImages(collectionId: string): Promise<CollectionImage[]> {
    try {
      const { data, error } = await supabase
        .from('collection_images')
        .select('*')
        .eq('collection_id', collectionId)
        .order('order_index', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching collection images:', error);
      return [];
    }
  },

  // Record export history
  async recordExport(exportRecord: Omit<ExportHistory, 'id' | 'created_at'>): Promise<ExportHistory | null> {
    try {
      const { data, error } = await supabase
        .from('export_history')
        .insert(exportRecord)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error recording export:', error);
      return null;
    }
  },

  // Record share history
  async recordShare(shareRecord: Omit<ShareHistory, 'id' | 'shared_at'>): Promise<ShareHistory | null> {
    try {
      const { data, error } = await supabase
        .from('share_history')
        .insert(shareRecord)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error recording share:', error);
      return null;
    }
  }
};

// Mobile Services
export const mobileService = {
  // Get user mobile settings
  async getMobileSettings(userId: string): Promise<MobileSettings | null> {
    try {
      const { data, error } = await supabase
        .from('mobile_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching mobile settings:', error);
      return null;
    }
  },

  // Update mobile settings
  async updateMobileSettings(settings: Partial<MobileSettings> & { user_id: string }): Promise<MobileSettings | null> {
    try {
      const { data, error } = await supabase
        .from('mobile_settings')
        .upsert(settings, { onConflict: 'user_id' })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating mobile settings:', error);
      return null;
    }
  },

  // Get user voice commands
  async getVoiceCommands(userId: string): Promise<VoiceCommand[]> {
    try {
      const { data, error } = await supabase
        .from('voice_commands')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching voice commands:', error);
      return [];
    }
  },

  // Update voice command
  async updateVoiceCommand(commandId: string, updates: Partial<VoiceCommand>): Promise<VoiceCommand | null> {
    try {
      const { data, error } = await supabase
        .from('voice_commands')
        .update(updates)
        .eq('id', commandId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating voice command:', error);
      return null;
    }
  },

  // Get cache info
  async getCacheInfo(userId: string): Promise<CacheInfo | null> {
    try {
      const { data, error } = await supabase
        .from('cache_info')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching cache info:', error);
      return null;
    }
  },

  // Update cache info
  async updateCacheInfo(cacheInfo: Partial<CacheInfo> & { user_id: string }): Promise<CacheInfo | null> {
    try {
      const { data, error } = await supabase
        .from('cache_info')
        .upsert(cacheInfo, { onConflict: 'user_id' })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating cache info:', error);
      return null;
    }
  },

  // Record performance metrics
  async recordPerformanceMetrics(metrics: Omit<PerformanceMetrics, 'id' | 'created_at'>): Promise<PerformanceMetrics | null> {
    try {
      const { data, error } = await supabase
        .from('performance_metrics')
        .insert(metrics)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error recording performance metrics:', error);
      return null;
    }
  },

  // Get performance metrics history
  async getPerformanceMetricsHistory(userId: string, limit = 50): Promise<PerformanceMetrics[]> {
    try {
      const { data, error } = await supabase
        .from('performance_metrics')
        .select('*')
        .eq('user_id', userId)
        .order('recorded_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching performance metrics history:', error);
      return [];
    }
  }
};

// ========================================
// UTILITY FUNCTIONS
// ========================================

// Helper function to get current user ID
export const getCurrentUserId = async (): Promise<string | null> => {
  try {
    // Check if supabase is properly configured
    if (!supabase.isClientAvailable()) {
      console.warn('Supabase client not available - cannot get user ID');
      return null;
    }
    
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id || null;
  } catch (error) {
    console.error('Error getting current user ID:', error);
    return null;
  }
};

// Helper function to check if user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    // Check if supabase is properly configured
    if (!supabase.isClientAvailable()) {
      console.warn('Supabase client not available - running in demo mode');
      return false;
    }
    
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};

// Helper function to migrate localStorage data to Supabase
export const migrateLocalStorageToSupabase = async (userId: string): Promise<void> => {
  try {
    // Migrate flashcard progress
    const flashcardProgress = localStorage.getItem('k53-flashcard-progress');
    if (flashcardProgress) {
      const progress = JSON.parse(flashcardProgress);
      for (const [imageId, data] of Object.entries(progress)) {
        await flashcardService.updateProgress({
          user_id: userId,
          image_id: imageId,
          ...data as any
        });
      }
      localStorage.removeItem('k53-flashcard-progress');
    }

    // Migrate saved searches
    const savedSearches = localStorage.getItem('k53-saved-searches');
    if (savedSearches) {
      const searches = JSON.parse(savedSearches);
      for (const search of searches) {
        await searchService.saveSearch({
          user_id: userId,
          name: search.name,
          filters: search.filters,
          is_default: false
        });
      }
      localStorage.removeItem('k53-saved-searches');
    }

    // Migrate export collections
    const exportCollections = localStorage.getItem('k53-export-collections');
    if (exportCollections) {
      const collections = JSON.parse(exportCollections);
      for (const collection of collections) {
        const newCollection = await exportService.createCollection({
          user_id: userId,
          name: collection.name,
          description: collection.description,
          category: collection.category,
          difficulty: collection.difficulty,
          tags: collection.tags,
          is_public: collection.isPublic
        });

        if (newCollection && collection.images) {
          await exportService.addCollectionImages(newCollection.id, collection.images.map((img: any) => img.id));
        }
      }
      localStorage.removeItem('k53-export-collections');
    }

    // Migrate mobile settings
    const mobileSettings = localStorage.getItem('k53-mobile-settings');
    if (mobileSettings) {
      const settings = JSON.parse(mobileSettings);
      await mobileService.updateMobileSettings({
        user_id: userId,
        ...settings
      });
      localStorage.removeItem('k53-mobile-settings');
    }

    console.log('Successfully migrated localStorage data to Supabase');
  } catch (error) {
    console.error('Error migrating localStorage data:', error);
  }
}; 