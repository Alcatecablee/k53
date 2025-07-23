import { supabase, supabaseClient } from "@/lib/supabase";
import type { UserProgress, UserScenario } from "@/lib/supabase";

// User Progress Functions
export const saveUserProgress = async (progressData: {
  test_type: "questions" | "scenarios";
  score: number;
  total_questions: number;
  categories: Record<
    string,
    { correct: number; total: number; required: number }
  >;
  passed: boolean;
  location_used?: string;
}) => {
  try {
    const {
      data: { user },
      error: userError,
    } = await Promise.race([
      supabase.auth.getUser(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Auth timeout")), 3000),
      ),
    ]);

    if (userError || !user) {
      console.warn("User not authenticated, saving progress locally");
      return { data: null, error: null }; // Graceful fallback
    }

    if (!supabaseClient) {
      console.warn("Database not available, progress not saved");
      return { data: null, error: null }; // Graceful fallback
    }

    const { data, error } = await Promise.race([
      supabaseClient
        .from("user_progress")
        .insert({
          user_id: user.id,
          ...progressData,
          completed_at: new Date().toISOString(),
        })
        .select()
        .single(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Database timeout")), 5000),
      ),
    ]);

    if (error) {
      console.warn("Failed to save progress:", error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.warn("Error saving user progress:", error);
    return { data: null, error };
  }
};

export const getUserProgress = async (limit = 10): Promise<UserProgress[]> => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    
    if (!user || !supabaseClient) {
      return []; // Return empty array if not authenticated or no DB
    }

    const { data, error } = await supabaseClient
      .from("user_progress")
      .select("*")
      .eq("user_id", user.id)
      .order("completed_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data as UserProgress[];
  } catch (error) {
    console.warn("Error fetching user progress:", error);
    return [];
  }
};

export const getUserStats = async () => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    
    if (!user || !supabaseClient) {
      return {
        totalTests: 0,
        averageScore: 0,
        passRate: 0,
        questionStats: { total: 0, passed: 0, averageScore: 0 },
        scenarioStats: { total: 0, passed: 0, averageScore: 0 },
      };
    }

    const { data, error } = await supabaseClient
      .from("user_progress")
      .select("*")
      .eq("user_id", user.id);

    if (error) throw error;

    const progress = data as UserProgress[];

    const questionTests = progress.filter((p) => p.test_type === "questions");
    const scenarioTests = progress.filter((p) => p.test_type === "scenarios");

    const questionStats = {
      total: questionTests.length,
      passed: questionTests.filter((p) => p.passed).length,
      averageScore:
        questionTests.length > 0
          ? questionTests.reduce((sum, p) => sum + p.score, 0) /
            questionTests.length
          : 0,
    };

    const scenarioStats = {
      total: scenarioTests.length,
      passed: scenarioTests.filter((p) => p.passed).length,
      averageScore:
        scenarioTests.length > 0
          ? scenarioTests.reduce((sum, p) => sum + p.score, 0) /
            scenarioTests.length
          : 0,
    };

    return {
      totalTests: progress.length,
      averageScore:
        progress.length > 0
          ? progress.reduce((sum, p) => sum + p.score, 0) / progress.length
          : 0,
      passRate:
        progress.length > 0
          ? (progress.filter((p) => p.passed).length / progress.length) * 100
          : 0,
      questionStats,
      scenarioStats,
    };
  } catch (error) {
    console.warn("Error fetching user stats:", error);
    return {
      totalTests: 0,
      averageScore: 0,
      passRate: 0,
      questionStats: { total: 0, passed: 0, averageScore: 0 },
      scenarioStats: { total: 0, passed: 0, averageScore: 0 },
    };
  }
};

// Scenario Usage Functions
export const saveScenarioUsage = async (
  scenarioId: string,
  answeredCorrectly: boolean,
  timeTaken: number,
) => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    
    if (!user || !supabaseClient) {
      console.warn("Cannot save scenario usage - user not authenticated or DB unavailable");
      return { data: null, error: null };
    }

    const { data, error } = await supabaseClient
      .from("user_scenarios")
      .insert({
        scenario_id: scenarioId,
        user_id: user.id,
        answered_correctly: answeredCorrectly,
        time_taken: timeTaken,
        completed_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.warn("Failed to save scenario usage:", error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.warn("Error saving scenario usage:", error);
    return { data: null, error };
  }
};

export const getUserScenarios = async (
  limit = 50,
): Promise<UserScenario[]> => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    
    if (!user || !supabaseClient) {
      return [];
    }

    const { data, error } = await supabaseClient
      .from("user_scenarios")
      .select("*")
      .eq("user_id", user.id)
      .order("completed_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data as UserScenario[];
  } catch (error) {
    console.warn("Error fetching user scenarios:", error);
    return [];
  }
};

export const getScenarioStats = async (scenarioId: string) => {
  try {
    if (!supabaseClient) {
      return {
        totalAttempts: 0,
        correctAttempts: 0,
        averageTime: 0,
        successRate: 0,
      };
    }

    const { data, error } = await supabaseClient
      .from("user_scenarios")
      .select("answered_correctly, time_taken")
      .eq("scenario_id", scenarioId);

    if (error) throw error;

    const scenarios = data as UserScenario[];
    const totalAttempts = scenarios.length;
    const correctAttempts = scenarios.filter((s) => s.answered_correctly).length;
    const averageTime =
      scenarios.length > 0
        ? scenarios.reduce((sum, s) => sum + s.time_taken, 0) / scenarios.length
        : 0;

    return {
      totalAttempts,
      correctAttempts,
      averageTime,
      successRate: totalAttempts > 0 ? (correctAttempts / totalAttempts) * 100 : 0,
    };
  } catch (error) {
    console.warn("Error fetching scenario stats:", error);
    return {
      totalAttempts: 0,
      correctAttempts: 0,
      averageTime: 0,
      successRate: 0,
    };
  }
};

export const getLeaderboard = async (
  type: "questions" | "scenarios" | "all" = "all",
  limit = 10,
) => {
  try {
    if (!supabaseClient) {
      return [];
    }

    let query = supabaseClient.from("user_progress").select(`
      score,
      total_questions,
      passed,
      completed_at,
      user_id,
      test_type
    `);

    if (type !== "all") {
      query = query.eq("test_type", type);
    }

    const { data, error } = await query
      .eq("passed", true)
      .order("score", { ascending: false })
      .limit(limit);

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.warn("Error fetching leaderboard:", error);
    return [];
  }
};
