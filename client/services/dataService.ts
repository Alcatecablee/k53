import { k53QuestionBank, generateRandomTest } from "@/data/k53Questions";
import { supabaseClient } from "@/lib/supabase";
import type { UserLocation } from "@/services/locationService";

// Use the new scenario service for better management
import { getScenarios as getScenariosFromService, getRandomScenarios } from "@/services/scenarioService";

// Database-first scenario retrieval (no local fallback)
export const getScenarios = async (
  count: number = 250,
  userLocation?: UserLocation,
  difficulty?: "basic" | "intermediate" | "advanced",
  category?: "controls" | "signs" | "rules" | "mixed",
) => {
  try {
    // Use the new scenario service
    const filters = {
      limit: count,
      difficulty,
      category,
      location: userLocation,
    };
    
    const scenarios = await getScenariosFromService(filters);
    
    if (scenarios && scenarios.length > 0) {
      return scenarios;
    }
    
    // Fallback to random scenarios if no specific filters
    if (!difficulty && !category) {
      return await getRandomScenarios(count, { location: userLocation });
    }
    
    throw new Error("No scenarios found with specified filters");
  } catch (error) {
    // Database scenarios unavailable, throw error for proper handling
    throw new Error("Scenarios are currently unavailable. Please try again later.");
  }
};

export const getQuestions = async (
  controlsCount: number = 8,
  signsCount: number = 28,
  rulesCount: number = 28,
) => {
  // Try database first with timeout
  const databaseTimeout = 5000; // 5 second timeout
  
  try {
    if (supabaseClient) {
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Database timeout")), databaseTimeout)
      );
      
      const dbPromise = (async () => {
        const { data: dbQuestions, error } = await supabaseClient
          .from("questions")
          .select("*");

        if (!error && dbQuestions && dbQuestions.length > 0) {
          return generateRandomTestFromDb(
            dbQuestions,
            controlsCount,
            signsCount,
            rulesCount,
          );
        }
        // No database questions available, using fallback
        throw new Error("Database questions unavailable");
      })();

      // Race between database query and timeout
      return await Promise.race([dbPromise, timeoutPromise]);
    }
  } catch (error) {
    // Database unavailable or timeout, using local questions
  }

  // Fallback to local data
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

    const scoredScenarios = convertedScenarios.map((scenario) => {
      let score = 0;
      let matchReason = "no-location";

      if (!scenario.location) {
        score = 1;
        matchReason = "no-location-data";
      } else {
        // Check for exact city match first
        if (
          userLocation.city &&
          scenario.location.cities?.some(
            (city: string) =>
              city.toLowerCase() === userLocation.city!.toLowerCase(),
          )
        ) {
          score = 10;
          matchReason = `city-match:${userLocation.city}`;
        }
        // Check for region match
        else if (
          userLocation.region &&
          scenario.location.regions?.some(
            (region: string) =>
              region.toLowerCase() === userLocation.region!.toLowerCase(),
          )
        ) {
          score = 8;
          matchReason = `region-match:${userLocation.region}`;
        }
        // Check if scenario mentions user's city in the text
        else if (
          userLocation.city &&
          (scenario.scenario
            .toLowerCase()
            .includes(userLocation.city.toLowerCase()) ||
            scenario.title
              .toLowerCase()
              .includes(userLocation.city.toLowerCase()))
        ) {
          score = 9;
          matchReason = `text-mention:${userLocation.city}`;
        }
        // Check if scenario mentions user's region in the text
        else if (
          userLocation.region &&
          (scenario.scenario
            .toLowerCase()
            .includes(userLocation.region.toLowerCase()) ||
            scenario.title
              .toLowerCase()
              .includes(userLocation.region.toLowerCase()))
        ) {
          score = 7;
          matchReason = `text-mention:${userLocation.region}`;
        }
        // National or universal scenarios
        else if (scenario.location.specificity === "national") {
          score = 5;
          matchReason = "national";
        }
        // Regional scenarios in same province/area
        else if (
          userLocation.region &&
          scenario.location.regions?.some((region: string) => {
            const userLower = userLocation.region!.toLowerCase();
            const scenarioLower = region.toLowerCase();

            // Check for partial matches for adjacent areas
            if (
              userLower === "gauteng" &&
              (scenarioLower.includes("gauteng") ||
                scenarioLower.includes("johannesburg") ||
                scenarioLower.includes("pretoria") ||
                scenarioLower.includes("sandton"))
            ) {
              return true;
            }

            return false;
          })
        ) {
          score = 6;
          matchReason = "regional-proximity";
        }
        // Generic urban/rural context matching
        else if (scenario.context) {
          if (
            userLocation.city &&
            ["Johannesburg", "Cape Town", "Durban", "Pretoria"].includes(
              userLocation.city,
            )
          ) {
            if (
              scenario.context === "urban" ||
              scenario.context === "residential"
            ) {
              score = 4;
              matchReason = "urban-context";
            }
          } else {
            if (
              scenario.context === "rural" ||
              scenario.context === "residential"
            ) {
              score = 3;
              matchReason = "context-match";
            }
          }
        } else {
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

    // Create weighted selection
    const result: any[] = [];

    const highPriority = scoredScenarios.filter((s) => s.score >= 8);
    const mediumPriority = scoredScenarios.filter(
      (s) => s.score >= 5 && s.score < 8,
    );
    const lowPriority = scoredScenarios.filter((s) => s.score < 5);

    const shuffledHigh = shuffleArray(highPriority);
    const shuffledMedium = shuffleArray(mediumPriority);
    const shuffledLow = shuffleArray(lowPriority);

    const targetHigh = Math.floor(count * 0.6);
    const targetMedium = Math.floor(count * 0.3);
    const targetLow = count - targetHigh - targetMedium;

    result.push(
      ...shuffledHigh
        .slice(0, Math.min(targetHigh, shuffledHigh.length))
        .map((s) => s.scenario),
    );
    result.push(
      ...shuffledMedium
        .slice(0, Math.min(targetMedium, shuffledMedium.length))
        .map((s) => s.scenario),
    );
    result.push(
      ...shuffledLow
        .slice(0, Math.min(targetLow, shuffledLow.length))
        .map((s) => s.scenario),
    );

    if (result.length < count) {
      const remaining = [...shuffledHigh, ...shuffledMedium, ...shuffledLow]
        .slice(result.length)
        .map((s) => s.scenario);
      result.push(...remaining.slice(0, count - result.length));
    }


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
    question: q.question_text,
    options: q.options,
    correct: q.correct_answer,
    explanation: q.explanation,
    language: "en", // Default to English
  }));

  const allControlsQuestions = convertedQuestions.filter((q) => q.category === "controls");
  const allSignsQuestions = convertedQuestions.filter((q) => q.category === "signs");
  const allRulesQuestions = convertedQuestions.filter((q) => q.category === "rules");
  
  // Use available questions if requested count exceeds available
  const actualControlsCount = Math.min(controlsCount, allControlsQuestions.length);
  const actualSignsCount = Math.min(signsCount, allSignsQuestions.length);
  const actualRulesCount = Math.min(rulesCount, allRulesQuestions.length);
  
  // Database questions loaded successfully

  const controlsQuestions = shuffleArray(allControlsQuestions).slice(0, actualControlsCount);
  const signsQuestions = shuffleArray(allSignsQuestions).slice(0, actualSignsCount);
  const rulesQuestions = shuffleArray(allRulesQuestions).slice(0, actualRulesCount);

  const combinedQuestions = [
    ...controlsQuestions,
    ...signsQuestions,
    ...rulesQuestions,
  ];
  
  // Questions generated successfully
  
  return shuffleArray(combinedQuestions);
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
