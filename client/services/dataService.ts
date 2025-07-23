import {
  k53ScenarioBank,
  generateLocationAwareScenarioTest,
  generateRandomScenarioTest,
} from "@/data/k53Scenarios";
import { k53QuestionBank, generateRandomTest } from "@/data/k53Questions";
import { supabase } from "@/lib/supabase";
import type { UserLocation } from "@/services/locationService";

// Try to use database first, fallback to local data
export const getScenarios = async (
  count: number = 226,
  userLocation?: UserLocation,
  difficulty?: "basic" | "intermediate" | "advanced",
  category?: "controls" | "signs" | "rules" | "mixed",
) => {
  try {
    // Try to fetch from database first
    let query = supabase.from("scenarios").select("*");

    if (difficulty) {
      query = query.eq("difficulty", difficulty);
    }

    if (category) {
      query = query.eq("category", category);
    }

    const { data: dbScenarios, error } = await query;

    if (!error && dbScenarios && dbScenarios.length > 0) {
      console.log("Using database scenarios");
      // Use database scenarios with location awareness
      return useLocationAwareSelection(dbScenarios, count, userLocation);
    }
  } catch (error) {
    console.log("Database unavailable, using local scenarios");
  }

  // Fallback to local data
  console.log("Using local scenarios");
  if (userLocation) {
    return generateLocationAwareScenarioTest(
      count,
      userLocation.city,
      userLocation.region,
      difficulty,
      category,
    );
  } else {
    return generateRandomScenarioTest(count, difficulty, category);
  }
};

export const getQuestions = async (
  controlsCount: number = 8,
  signsCount: number = 28,
  rulesCount: number = 28,
) => {
  try {
    // Try to fetch from database first
    const { data: dbQuestions, error } = await supabase
      .from("questions")
      .select("*");

    if (!error && dbQuestions && dbQuestions.length > 0) {
      console.log("Using database questions");
      return generateRandomTestFromDb(
        dbQuestions,
        controlsCount,
        signsCount,
        rulesCount,
      );
    }
  } catch (error) {
    console.log("Database unavailable, using local questions");
  }

  // Fallback to local data
  console.log("Using local questions");
  return generateRandomTest(controlsCount, signsCount, rulesCount);
};

// Helper function for location-aware selection from database
const useLocationAwareSelection = (
  scenarios: any[],
  count: number,
  userLocation?: UserLocation,
) => {
  // Convert database format to local format
  const convertedScenarios = scenarios.map((s) => ({
    id: s.id,
    category: s.category,
    title: s.title,
    scenario: s.scenario,
    question: s.question,
    options: s.options,
    correct: s.correct,
    explanation: s.explanation,
    difficulty: s.difficulty,
    context: s.context,
    timeOfDay: s.time_of_day,
    weather: s.weather,
    language: s.language,
    location: s.location,
  }));

  // Apply location-aware scoring if user location is available
  if (userLocation) {
    console.log(`DB: Filtering scenarios for: City="${userLocation.city}", Region="${userLocation.region}"`);
    console.log(`DB: Total scenarios before location filtering: ${convertedScenarios.length}`);

    const scoredScenarios = convertedScenarios.map((scenario) => {
      let score = 0;
      let matchReason = "no-location";

      if (!scenario.location) {
        score = 1;
        matchReason = "no-location-data";
      } else {
        // Check for exact city match first
        if (userLocation.city && scenario.location.cities?.some((city: string) =>
          city.toLowerCase() === userLocation.city!.toLowerCase()
        )) {
          score = 10;
          matchReason = `city-match:${userLocation.city}`;
        }
        // Check for region match
        else if (userLocation.region && scenario.location.regions?.some((region: string) =>
          region.toLowerCase() === userLocation.region!.toLowerCase()
        )) {
          score = 8;
          matchReason = `region-match:${userLocation.region}`;
        }
        // Check if scenario mentions user's city in the text
        else if (userLocation.city && (
          scenario.scenario.toLowerCase().includes(userLocation.city.toLowerCase()) ||
          scenario.title.toLowerCase().includes(userLocation.city.toLowerCase())
        )) {
          score = 9;
          matchReason = `text-mention:${userLocation.city}`;
        }
        // Check if scenario mentions user's region in the text
        else if (userLocation.region && (
          scenario.scenario.toLowerCase().includes(userLocation.region.toLowerCase()) ||
          scenario.title.toLowerCase().includes(userLocation.region.toLowerCase())
        )) {
          score = 7;
          matchReason = `text-mention:${userLocation.region}`;
        }
        // National or universal scenarios
        else if (scenario.location.specificity === "national") {
          score = 5;
          matchReason = "national";
        }
        // Regional scenarios in same province/area
        else if (userLocation.region && scenario.location.regions?.some((region: string) => {
          const userLower = userLocation.region!.toLowerCase();
          const scenarioLower = region.toLowerCase();

          // Check for partial matches for adjacent areas
          if (userLower === "gauteng" && (
            scenarioLower.includes("gauteng") ||
            scenarioLower.includes("johannesburg") ||
            scenarioLower.includes("pretoria") ||
            scenarioLower.includes("sandton")
          )) {
            return true;
          }

          return false;
        })) {
          score = 6;
          matchReason = "regional-proximity";
        }
        // Generic urban/rural context matching
        else if (scenario.context) {
          if (userLocation.city && ["Johannesburg", "Cape Town", "Durban", "Pretoria"].includes(userLocation.city)) {
            if (scenario.context === "urban" || scenario.context === "residential") {
              score = 4;
              matchReason = "urban-context";
            }
          } else {
            if (scenario.context === "rural" || scenario.context === "residential") {
              score = 3;
              matchReason = "context-match";
            }
          }
        }
        else {
          score = 2;
          matchReason = "has-location-no-match";
        }
      }

      return { scenario, score, matchReason };
    });

    // Sort by score (highest first)
    scoredScenarios.sort((a, b) => b.score - a.score);

    // Log top scenarios for debugging
    const topScenarios = scoredScenarios.slice(0, Math.min(10, count));
    console.log("DB: Top scored scenarios:");
    topScenarios.forEach((item, index) => {
      console.log(`${index + 1}. Score: ${item.score}, Reason: ${item.matchReason}, Title: ${item.scenario.title}`);
    });

    // Create weighted selection
    const result: any[] = [];

    const highPriority = scoredScenarios.filter(s => s.score >= 8);
    const mediumPriority = scoredScenarios.filter(s => s.score >= 5 && s.score < 8);
    const lowPriority = scoredScenarios.filter(s => s.score < 5);

    const shuffledHigh = shuffleArray(highPriority);
    const shuffledMedium = shuffleArray(mediumPriority);
    const shuffledLow = shuffleArray(lowPriority);

    const targetHigh = Math.floor(count * 0.6);
    const targetMedium = Math.floor(count * 0.3);
    const targetLow = count - targetHigh - targetMedium;

    result.push(...shuffledHigh.slice(0, Math.min(targetHigh, shuffledHigh.length)).map(s => s.scenario));
    result.push(...shuffledMedium.slice(0, Math.min(targetMedium, shuffledMedium.length)).map(s => s.scenario));
    result.push(...shuffledLow.slice(0, Math.min(targetLow, shuffledLow.length)).map(s => s.scenario));

    if (result.length < count) {
      const remaining = [...shuffledHigh, ...shuffledMedium, ...shuffledLow]
        .slice(result.length)
        .map(s => s.scenario);
      result.push(...remaining.slice(0, count - result.length));
    }

    console.log(`DB: Selected ${result.length} scenarios for user location`);
    return result.slice(0, count);
  }

  // No location, just shuffle randomly
  return shuffleArray(convertedScenarios).slice(0, count);
};

// Helper function for random test generation from database
const generateRandomTestFromDb = (
  questions: any[],
  controlsCount: number,
  signsCount: number,
  rulesCount: number,
) => {
  const convertedQuestions = questions.map((q) => ({
    id: q.id,
    category: q.category,
    question: q.question,
    options: q.options,
    correct: q.correct,
    explanation: q.explanation,
    language: q.language || "en",
  }));

  const controlsQuestions = shuffleArray(
    convertedQuestions.filter((q) => q.category === "controls"),
  ).slice(0, controlsCount);
  const signsQuestions = shuffleArray(
    convertedQuestions.filter((q) => q.category === "signs"),
  ).slice(0, signsCount);
  const rulesQuestions = shuffleArray(
    convertedQuestions.filter((q) => q.category === "rules"),
  ).slice(0, rulesCount);

  return shuffleArray([
    ...controlsQuestions,
    ...signsQuestions,
    ...rulesQuestions,
  ]);
};

// Fisher-Yates shuffle
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};
