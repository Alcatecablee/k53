import { supabase } from '@/lib/supabase';
import type { UserProgress, UserScenario } from '@/lib/supabase';

// User Progress Functions
export const saveUserProgress = async (progressData: {
  test_type: 'questions' | 'scenarios';
  score: number;
  total_questions: number;
  categories: Record<string, { correct: number; total: number; required: number }>;
  passed: boolean;
  location_used?: string;
}) => {
  try {
    const { data: { user }, error: userError } = await Promise.race([
      supabase.auth.getUser(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Database timeout')), 3000)
      )
    ]);

    if (userError || !user) {
      console.warn('User not authenticated, progress not saved to database');
      return null;
    }

    const { data, error } = await Promise.race([
      supabase
        .from('user_progress')
        .insert({
          user_id: user.id,
          ...progressData,
          completed_at: new Date().toISOString(),
        })
        .select()
        .single(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Database timeout')), 5000)
      )
    ]);

    if (error) {
      console.warn('Failed to save progress to database:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.warn('Database unavailable, progress not saved:', error);
    return null;
  }
};

export const getUserProgress = async (limit = 20) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', user.id)
    .order('completed_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as UserProgress[];
};

export const getUserStats = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', user.id);

  if (error) throw error;

  const progress = data as UserProgress[];
  
  // Calculate statistics
  const totalTests = progress.length;
  const passedTests = progress.filter(p => p.passed).length;
  const passRate = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;
  
  const scenarioTests = progress.filter(p => p.test_type === 'scenarios');
  const questionTests = progress.filter(p => p.test_type === 'questions');
  
  const averageScore = progress.length > 0 
    ? Math.round(progress.reduce((sum, p) => sum + ((p.score / p.total_questions) * 100), 0) / progress.length)
    : 0;

  return {
    totalTests,
    passedTests,
    passRate,
    averageScore,
    scenarioTests: scenarioTests.length,
    questionTests: questionTests.length,
    recentProgress: progress.slice(0, 5),
  };
};

// User Profile Functions
export const updateUserProfile = async (updates: {
  full_name?: string;
  location_city?: string;
  location_region?: string;
  location_neighborhood?: string;
}) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase.auth.updateUser({
    data: updates
  });

  if (error) throw error;
  return data;
};

export const getUserProfile = async () => {
  try {
    const { data: { user }, error } = await Promise.race([
      supabase.auth.getUser(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Database timeout')), 3000)
      )
    ]);

    if (error || !user) {
      throw new Error('User not authenticated or database unavailable');
    }

    return {
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name,
      location_city: user.user_metadata?.location_city,
      location_region: user.user_metadata?.location_region,
      location_neighborhood: user.user_metadata?.location_neighborhood,
      location: user.user_metadata?.location,
      created_at: user.created_at,
    };
  } catch (error) {
    console.warn('Database service unavailable:', error);
    throw error;
  }
};

// Scenario Tracking Functions
export const saveScenarioAttempt = async (
  scenario_id: string,
  answered_correctly: boolean,
  time_taken: number
) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('user_scenarios')
    .insert({
      user_id: user.id,
      scenario_id,
      answered_correctly,
      time_taken,
      completed_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getScenarioStats = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('user_scenarios')
    .select('*')
    .eq('user_id', user.id);

  if (error) throw error;

  const scenarios = data as UserScenario[];
  
  const totalAttempts = scenarios.length;
  const correctAttempts = scenarios.filter(s => s.answered_correctly).length;
  const accuracy = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0;
  
  const averageTime = scenarios.length > 0 
    ? Math.round(scenarios.reduce((sum, s) => sum + s.time_taken, 0) / scenarios.length)
    : 0;

  // Get unique scenarios attempted
  const uniqueScenarios = new Set(scenarios.map(s => s.scenario_id)).size;

  return {
    totalAttempts,
    correctAttempts,
    accuracy,
    averageTime,
    uniqueScenarios,
  };
};

// Leaderboard Functions
export const getLeaderboard = async (type: 'questions' | 'scenarios' | 'all' = 'all', limit = 10) => {
  let query = supabase
    .from('user_progress')
    .select(`
      score,
      total_questions,
      passed,
      completed_at,
      user_id,
      test_type
    `);

  if (type !== 'all') {
    query = query.eq('test_type', type);
  }

  const { data, error } = await query
    .eq('passed', true)
    .order('score', { ascending: false })
    .order('completed_at', { ascending: false })
    .limit(limit);

  if (error) throw error;

  return data?.map((entry, index) => ({
    rank: index + 1,
    userId: entry.user_id,
    score: entry.score,
    totalQuestions: entry.total_questions,
    percentage: Math.round((entry.score / entry.total_questions) * 100),
    testType: entry.test_type,
    completedAt: entry.completed_at,
  })) || [];
};
