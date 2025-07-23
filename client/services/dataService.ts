import { k53ScenarioBank, generateLocationAwareScenarioTest, generateRandomScenarioTest } from '@/data/k53Scenarios';
import { k53QuestionBank, generateRandomTest } from '@/data/k53Questions';
import { supabase } from '@/lib/supabase';
import type { UserLocation } from '@/services/locationService';

// Try to use database first, fallback to local data
export const getScenarios = async (
  count: number = 226,
  userLocation?: UserLocation,
  difficulty?: "basic" | "intermediate" | "advanced",
  category?: "controls" | "signs" | "rules" | "mixed"
) => {
  try {
    // Try to fetch from database first
    let query = supabase.from('scenarios').select('*');
    
    if (difficulty) {
      query = query.eq('difficulty', difficulty);
    }
    
    if (category) {
      query = query.eq('category', category);
    }

    const { data: dbScenarios, error } = await query;

    if (!error && dbScenarios && dbScenarios.length > 0) {
      console.log('Using database scenarios');
      // Use database scenarios with location awareness
      return useLocationAwareSelection(dbScenarios, count, userLocation);
    }
  } catch (error) {
    console.log('Database unavailable, using local scenarios');
  }

  // Fallback to local data
  console.log('Using local scenarios');
  if (userLocation) {
    return generateLocationAwareScenarioTest(count, userLocation.city, userLocation.region, difficulty, category);
  } else {
    return generateRandomScenarioTest(count, difficulty, category);
  }
};

export const getQuestions = async (
  controlsCount: number = 8,
  signsCount: number = 28,
  rulesCount: number = 28
) => {
  try {
    // Try to fetch from database first
    const { data: dbQuestions, error } = await supabase
      .from('questions')
      .select('*');

    if (!error && dbQuestions && dbQuestions.length > 0) {
      console.log('Using database questions');
      return generateRandomTestFromDb(dbQuestions, controlsCount, signsCount, rulesCount);
    }
  } catch (error) {
    console.log('Database unavailable, using local questions');
  }

  // Fallback to local data
  console.log('Using local questions');
  return generateRandomTest(controlsCount, signsCount, rulesCount);
};

// Helper function for location-aware selection from database
const useLocationAwareSelection = (scenarios: any[], count: number, userLocation?: UserLocation) => {
  // Convert database format to local format
  const convertedScenarios = scenarios.map(s => ({
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
    location: s.location
  }));

  // Apply location-aware scoring if user location is available
  if (userLocation) {
    const scoredScenarios = convertedScenarios.map((scenario) => {
      let score = 1; // Base score for all scenarios

      if (scenario.location) {
        // City-specific scenarios get highest priority
        if (userLocation.city && scenario.location.cities?.includes(userLocation.city)) {
          score = 5;
        }
        // Region-specific scenarios get medium priority
        else if (userLocation.region && scenario.location.regions?.includes(userLocation.region)) {
          score = 3;
        }
        // National scenarios get slight boost
        else if (scenario.location.specificity === "national") {
          score = 2;
        }
      }

      return { scenario, score };
    });

    // Sort by score (highest first) then shuffle within score groups
    scoredScenarios.sort((a, b) => b.score - a.score);
    
    // Group by score and shuffle within each group
    const scoreGroups: { [score: number]: any[] } = {};
    scoredScenarios.forEach(({ scenario, score }) => {
      if (!scoreGroups[score]) {
        scoreGroups[score] = [];
      }
      scoreGroups[score].push(scenario);
    });

    // Shuffle each score group and flatten
    const shuffledScenarios: any[] = [];
    Object.keys(scoreGroups)
      .sort((a, b) => Number(b) - Number(a)) // Highest scores first
      .forEach(score => {
        const shuffledGroup = shuffleArray(scoreGroups[Number(score)]);
        shuffledScenarios.push(...shuffledGroup);
      });

    return shuffledScenarios.slice(0, count);
  }

  // No location, just shuffle randomly
  return shuffleArray(convertedScenarios).slice(0, count);
};

// Helper function for random test generation from database
const generateRandomTestFromDb = (questions: any[], controlsCount: number, signsCount: number, rulesCount: number) => {
  const convertedQuestions = questions.map(q => ({
    id: q.id,
    category: q.category,
    question: q.question,
    options: q.options,
    correct: q.correct,
    explanation: q.explanation,
    language: q.language || 'en'
  }));

  const controlsQuestions = shuffleArray(convertedQuestions.filter(q => q.category === 'controls')).slice(0, controlsCount);
  const signsQuestions = shuffleArray(convertedQuestions.filter(q => q.category === 'signs')).slice(0, signsCount);
  const rulesQuestions = shuffleArray(convertedQuestions.filter(q => q.category === 'rules')).slice(0, rulesCount);

  return shuffleArray([...controlsQuestions, ...signsQuestions, ...rulesQuestions]);
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
