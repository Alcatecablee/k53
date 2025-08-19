import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  CheckCircle,
  XCircle,
  ArrowLeft,
  RotateCcw,
  FileText,
  Clock,
  Settings,
  Layers,
  ChartBarStacked,
  Car,
  MapPin,
  LogOut,
  User,
  BookOpen,
  Trophy,
} from "lucide-react";
import { Link } from "react-router-dom";
import { K53Question } from "../data/k53Questions";
import { K53Scenario } from "../types";
import { getScenarios, getQuestions } from "@/services/dataService";
import { LocationSelector } from "@/components/LocationSelector";
import { AuthenticatedRoute } from "@/components/AuthenticatedRoute";
import {
  getStoredLocation,
  getCurrentLocation,
  reverseGeocode,
  storeLocation,
  type UserLocation,
} from "@/services/locationService";
import { useAuth } from "@/contexts/AuthContext";
import {
  saveUserProgress,
  getUserProfile,
  updateUserProfile,
} from "@/services/databaseService";
import {
  canAccessScenarios,
  updateDailyUsage,
  getUserSubscription,
} from "@/services/subscriptionService";
import { SEO } from "@/components/SEO";
import { SEO_CONFIGS } from "@/hooks/useSEO";
import { supabase } from "@/lib/supabase";
import { 
  imageMapping, 
  getImagesByCategory, 
  getQuestionImage, 
  getScenarioImage,
  getImageByContext,
  getImageByDifficulty 
} from "@/data/imageMapping";
import { updateProgress, getUserProgress } from "@/services/achievementService";
import pushNotificationService from "@/services/pushNotificationService";
import { showError, showInfo, logError } from "@/services/notificationService";

// Enhanced helper function to get relevant images for questions and scenarios
const getRelevantImage = (
  item: K53Question | K53Scenario,
  mode: "questions" | "scenarios"
): string | null => {
  if (!item) {
    return null;
  }
  
  if (mode === "scenarios") {
    const scenario = item as K53Scenario;
    const imageAsset = getScenarioImage({
      category: scenario.category,
      context: scenario.context,
      difficulty: scenario.difficulty,
      location: scenario.location
    });
    return imageAsset?.path || null;
  } else {
    const question = item as K53Question;
    // Safety check for question object
    if (!question || !question.question) {
      return null;
    }
    const imageAsset = getQuestionImage({
      category: question.category,
      question: question.question
    });
    return imageAsset?.path || null;
  }
};

interface TestResult {
  category: string;
  correct: number;
  total: number;
  required: number;
  passed: boolean;
}

type TestMode = "questions" | "scenarios";

function PracticeComponent() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [answered, setAnswered] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [isFullTest, setIsFullTest] = useState(false);

  const [testQuestions, setTestQuestions] = useState<K53Question[]>([]);
  const [testScenarios, setTestScenarios] = useState<K53Scenario[]>([]);
  const [testMode, setTestMode] = useState<TestMode>("questions");
  const [showLocationSelector, setShowLocationSelector] = useState(false);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [usageInfo, setUsageInfo] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);

  const { user, signOut } = useAuth();

  // Load user data (location, subscription, usage)
  useEffect(() => {
    const loadUserData = async () => {
      try {
        if (user) {
          // Load subscription and usage info
          const [userSub, accessInfo] = await Promise.all([
            getUserSubscription().catch(() => null),
            canAccessScenarios().catch(() => ({
              canAccess: true,
              remaining: 5,
              isSubscribed: false,
            })),
          ]);

          setSubscription(userSub);
          setUsageInfo(accessInfo);

          // Load user location - try multiple sources in order of preference
          let locationSet = false;

          // 1. First try to get location from user profile
          try {
            const profile = await getUserProfile();
            if (profile && profile.location_city && profile.location_region) {
              const userLoc: UserLocation = {
                city: profile.location_city,
                region: profile.location_region,
                displayName: `${profile.location_city}, ${profile.location_region}`,
              };
              setUserLocation(userLoc);
              locationSet = true;
            }
          } catch (dbError) {
            // Database unavailable for user profile
          }

          // 2. If no profile location, try stored location
          if (!locationSet) {
            const storedLocation = getStoredLocation();
            if (storedLocation) {
              setUserLocation(storedLocation);
              locationSet = true;
            }
          }

          // 3. If no stored location, try to auto-detect current location
          if (!locationSet) {
            try {
              const coords = await getCurrentLocation();
              const detectedLocation = reverseGeocode(coords);
              setUserLocation(detectedLocation);
              locationSet = true;
              
              // Save detected location to profile and storage
              if (user) {
                try {
                  await updateUserProfile({
                    location_city: detectedLocation.city,
                    location_region: detectedLocation.region,
                  });
                  storeLocation(detectedLocation);
                } catch (error) {
                  // Failed to save detected location
                }
              }
            } catch (detectionError) {
              // Location detection failed
            }
          }

          // 4. Only use default if all else fails
          if (!locationSet) {
            // No location available, user will need to set location manually
          }
        }
      } catch (error) {
        logError("Error loading user data", error, "loadUserData");
      }
    };

    loadUserData();
  }, [user]);

  const handleLocationSelected = async (location: UserLocation) => {
    setUserLocation(location);

    // Update user profile with new location
    if (user) {
      try {
        await updateUserProfile({
          location_city: location.city,
          location_region: location.region,
        });
      } catch (error) {
        logError("Error updating user location", error, "handleLocationSelected");
      }
    }
  };

  const generateTest = async (fullTest: boolean = false) => {
    setIsFullTest(fullTest);
    setTestMode("questions");

    try {
      if (fullTest) {
        const randomTest = await getQuestions(8, 28, 28);
        // Official test randomized order generated
        setTestQuestions(Array.isArray(randomTest) ? randomTest as K53Question[] : []);
      } else {
        const randomTest = await getQuestions(2, 5, 5);
        // Practice test randomized order generated
        setTestQuestions(Array.isArray(randomTest) ? randomTest as K53Question[] : []);
      }
    } catch (error) {
      logError("Error generating test", error, "generateTest");
      showError("Failed to load questions. Please try again.", "Loading Error");
      // Fallback to empty array
      setTestQuestions([]);
    }

    setTestScenarios([]);
    setTestStarted(true);
    setCurrentQuestion(0);
    setSelectedAnswer("");
    setAnswered(false);
    setShowResult(false);
    setUserAnswers([]);
    setTestCompleted(false);
    setResults([]);
  };

  const generateScenarioTest = async () => {
    // Server-side validation for scenario access
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        showError("Please sign in to access scenarios", "Authentication Required");
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();
      const response = await fetch(
        "/api/subscriptions/validate-scenario-access",
        {
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const accessInfo = await response.json();

      if (!response.ok || !accessInfo.allowed) {
        const message = accessInfo.isSubscribed
          ? "Access denied. Please contact support."
          : `You've reached your daily limit of ${accessInfo.max || 5} scenarios. Upgrade to SuperK53 for unlimited practice!`;
        showError(message, "Access Denied");
        return;
      }
    } catch (error) {
      logError("Error validating scenario access", error, "generateScenarioTest");
      showError("Unable to verify access. Please try again.", "Verification Failed");
      return;
    }

    setTestMode("scenarios");
    setIsFullTest(false);

    try {
      // Use location-aware generation if user has a location set

      const randomScenarios = await getScenarios(
        226,
        userLocation || undefined,
      );

      // Location-aware scenarios loaded successfully
      if (userLocation) {
        // Scenarios filtered for user's location
      }

      setTestScenarios(randomScenarios as K53Scenario[]);

      // Record scenario usage on server-side
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        await fetch("/api/subscriptions/record-scenario-usage", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
            "Content-Type": "application/json",
          },
        });

        // Refresh usage info
        const newAccessInfo = await canAccessScenarios();
        setUsageInfo(newAccessInfo);
      } catch (error) {
        // Error recording scenario usage
      }
    } catch (error) {
      logError("Error generating scenarios", error, "generateScenarioTest");
      showError("Failed to load scenarios. Please try again.", "Loading Error");
      setTestScenarios([]);
    }

    setTestQuestions([]);
    setTestStarted(true);
    setCurrentQuestion(0);
    setSelectedAnswer("");
    setAnswered(false);
    setShowResult(false);
    setUserAnswers([]);
    setTestCompleted(false);
    setResults([]);
  };

  const handleAnswerSelect = (answer: string) => {
    if (!answered) {
      setSelectedAnswer(answer);
    }
  };

  const submitAnswer = () => {
    if (selectedAnswer === "" || !currentItem) return;

    const answerIndex = currentItem.options.indexOf(selectedAnswer);
    const isCorrect = answerIndex === currentItem.correct;
    
    // Update achievement progress
    if (testMode === "scenarios" && currentItem) {
      const scenario = currentItem as K53Scenario;
      const oldProgress = getUserProgress();
      const newProgress = updateProgress(
        scenario.category,
        scenario.difficulty,
        isCorrect,
        userLocation?.city
      );
      
      // Update daily usage for scenarios
      updateDailyUsage("scenarios", 1).then(async (updatedUsage) => {
        if (updatedUsage) {
          // Refresh usage info to update the UI
          try {
            const newAccessInfo = await canAccessScenarios();
            setUsageInfo(newAccessInfo);
          } catch (error) {
            logError("Failed to refresh usage info", error, "handleAnswer");
          }
        }
      }).catch((error) => {
        logError("Failed to update daily usage", error, "handleAnswer");
      });
      
      // Check for new achievements and send notifications
      pushNotificationService.checkForNewAchievements(oldProgress, newProgress);
    }
    
    setUserAnswers([...userAnswers, answerIndex]);
    setAnswered(true);
    setShowResult(true);
  };

  const nextQuestion = () => {
    if (currentQuestion < totalItems - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer("");
      setAnswered(false);
      setShowResult(false);
    } else {
      completeTest();
    }
  };

  const completeTest = async () => {
    const currentItems =
      testMode === "questions" ? testQuestions : testScenarios;
    const finalAnswers = [
      ...userAnswers,
      currentItems[currentQuestion].options.indexOf(selectedAnswer),
    ];

    const getRequiredScore = (
      total: number,
      fullRequirement: number,
      fullTotal: number,
    ) => {
      if (isFullTest) return fullRequirement;
      return Math.ceil((total / fullTotal) * fullRequirement);
    };

    const categories = {
      controls: { correct: 0, total: 0, required: 0 },
      signs: { correct: 0, total: 0, required: 0 },
      rules: { correct: 0, total: 0, required: 0 },
    };

    if (testMode === "questions") {
      testQuestions.forEach((question) => {
        categories[question.category].total++;
      });
    } else {
      // For scenarios, we'll count them all as mixed category
      testScenarios.forEach((scenario) => {
        if (categories[scenario.category]) {
          categories[scenario.category].total++;
        }
      });
    }

    categories.controls.required = getRequiredScore(
      categories.controls.total,
      6,
      8,
    );
    categories.signs.required = getRequiredScore(
      categories.signs.total,
      23,
      28,
    );
    categories.rules.required = getRequiredScore(
      categories.rules.total,
      22,
      28,
    );

    const itemsToProcess =
      testMode === "questions" ? testQuestions : testScenarios;
    itemsToProcess.forEach((item, index) => {
      if (finalAnswers[index] === item.correct) {
        if (categories[item.category]) {
          categories[item.category].correct++;
        }
      }
    });

    const testResults: TestResult[] = Object.entries(categories)
      .filter(([, data]) => data.total > 0)
      .map(([category, data]) => ({
        category: category.charAt(0).toUpperCase() + category.slice(1),
        correct: data.correct,
        total: data.total,
        required: data.required,
        passed: data.correct >= data.required,
      }));

    const totalCorrect = testResults.reduce((sum, r) => sum + r.correct, 0);
    const totalQuestions = testResults.reduce((sum, r) => sum + r.total, 0);
    const overallPassed = testResults.every((r) => r.passed);

    // Save progress to database (optional - app works without it)
    if (user) {
      try {
        const saved = await saveUserProgress({
          test_type: testMode,
          score: totalCorrect,
          total_questions: totalQuestions,
          categories: Object.fromEntries(
            testResults.map((r) => [
              r.category.toLowerCase(),
              { correct: r.correct, total: r.total, required: r.required },
            ]),
          ),
          passed: overallPassed,
          location_used: userLocation?.displayName,
        });

        if (saved) {
          // Progress saved to database successfully
        } else {
                      // Progress saved locally (database unavailable)
        }
      } catch (error) {
        logError("Progress saved locally only", error, "completeTest");
      }
    }

    setResults(testResults);
    setTestCompleted(true);
  };

  const currentQ =
    testMode === "questions" ? testQuestions[currentQuestion] : null;
  const currentS =
    testMode === "scenarios" ? testScenarios[currentQuestion] : null;
  const currentItem = currentQ || currentS;
  
  // Check if questions are loaded
  if (testMode === "questions" && testQuestions.length === 0) {
    // Questions not loaded yet, this is expected during initial load
  }
  const isCorrect =
    answered &&
    currentItem &&
    selectedAnswer === currentItem.options[currentItem.correct];
  const totalItems =
    testMode === "questions" ? testQuestions.length : testScenarios.length;
  const progress = ((currentQuestion + 1) / totalItems) * 100;

  if (!testStarted) {
    return (
      <>
        <SEO {...SEO_CONFIGS.practice} />
        <div className="min-h-screen bg-slate-900">
          <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="bg-slate-800 border-b border-black mb-8 -mx-4 px-4 py-6">
              <div className="flex items-center justify-between">
                <Button
                  asChild
                  variant="ghost"
                  className="text-slate-300 hover:text-white font-medium uppercase tracking-wide"
                >
                  <Link to="/">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Return to Portal
                  </Link>
                </Button>
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-white uppercase tracking-wide">
                    Assessment Selection Portal
                  </h1>
                  <p className="text-slate-400 uppercase text-sm tracking-wide">
                    K53 Examination Preparation System
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    asChild
                    variant="ghost"
                    size="icon"
                    className="text-slate-300 hover:text-white hover:bg-slate-700"
                    title="Documentation"
                  >
                    <Link to="/docs">
                      <BookOpen className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="ghost"
                    size="icon"
                    className="text-slate-300 hover:text-white hover:bg-slate-700"
                    title="Blog"
                  >
                    <Link to="/blog">
                      <FileText className="h-4 w-4" />
                    </Link>
                  </Button>
                  {user && (
                    <>
                      <Button
                        asChild
                        variant="ghost"
                        size="icon"
                        className="text-slate-300 hover:text-white hover:bg-slate-700"
                        title="View Profile"
                      >
                        <Link to="/profile">
                          <User className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={signOut}
                        className="text-slate-300 hover:text-white hover:bg-slate-700"
                        title="Sign Out"
                      >
                        <LogOut className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="max-w-6xl mx-auto">
              <Card className="border border-black bg-slate-800 mb-8">
                <CardHeader className="bg-slate-700 text-white p-8">
                  <CardTitle className="text-2xl font-bold uppercase tracking-wide mb-2">
                    Assessment Type Selection
                  </CardTitle>
                  <p className="text-slate-300">
                    Select your preferred examination format according to
                    Department of Transport standards
                  </p>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="bg-slate-700 border border-black p-6 mb-8">
                    <h3 className="text-lg font-bold uppercase tracking-wide text-white mb-4 text-center">
                      Official Assessment Categories
                    </h3>
                    <div className="bg-white text-white p-3 text-center mb-4">
                      <div className="text-sm font-bold uppercase tracking-wide">
                        Free and unlimited for all users
                      </div>
                      <div className="text-xs uppercase tracking-wide">
                        No subscription required
                      </div>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="text-center p-4 bg-slate-800 border border-black">
                        <div className="w-12 h-12 bg-slate-700 border border-black flex items-center justify-center mx-auto mb-3">
                          <Settings className="w-6 h-6 text-white" />
                        </div>
                        <div className="font-bold text-white uppercase tracking-wide text-sm">
                          Vehicle Controls
                        </div>
                        <div className="text-sm text-slate-300 mt-1">
                          8 Questions
                        </div>
                        <div className="text-xs text-slate-400 uppercase tracking-wide">
                          Minimum Pass: 6/8 (75%)
                        </div>
                      </div>
                      <div className="text-center p-4 bg-slate-800 border border-black">
                        <div className="w-12 h-12 bg-slate-700 border border-black flex items-center justify-center mx-auto mb-3">
                          <Layers className="w-6 h-6 text-white" />
                        </div>
                        <div className="font-bold text-white uppercase tracking-wide text-sm">
                          Road Signs
                        </div>
                        <div className="text-sm text-slate-300 mt-1">
                          28 Questions
                        </div>
                        <div className="text-xs text-slate-400 uppercase tracking-wide">
                          Minimum Pass: 23/28 (82%)
                        </div>
                      </div>
                      <div className="text-center p-4 bg-slate-800 border border-black">
                        <div className="w-12 h-12 bg-slate-700 border border-black flex items-center justify-center mx-auto mb-3">
                          <ChartBarStacked className="w-6 h-6 text-white" />
                        </div>
                        <div className="font-bold text-white uppercase tracking-wide text-sm">
                          Traffic Rules
                        </div>
                        <div className="text-sm text-slate-300 mt-1">
                          28 Questions
                        </div>
                        <div className="text-xs text-slate-400 uppercase tracking-wide">
                          Minimum Pass: 22/28 (79%)
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-slate-800 border border-black text-white p-6 hover:bg-slate-750 transition-colors">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-slate-700 border border-black flex items-center justify-center mx-auto mb-4">
                          <Clock className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="text-lg font-bold uppercase tracking-wide mb-3">
                          Practice Assessment
                        </h3>
                        <div className="text-3xl font-bold mb-1">12</div>
                        <div className="text-xs uppercase tracking-wide mb-1">
                          Questions
                        </div>
                        <div className="text-xs text-slate-400 mb-2 uppercase tracking-wide">
                          Duration: 5 Minutes
                        </div>
                        <div className="p-2 bg-white text-white border border-black mb-2">
                          <div className="text-xs font-bold uppercase tracking-wide">
                            Free and unlimited
                          </div>
                        </div>
                        <div className="p-2 bg-slate-700 border border-black mb-4">
                          <div className="text-xs text-white uppercase tracking-wide">
                            Skill assessment level: Basic preparation
                          </div>
                        </div>
                        <p className="text-slate-300 mb-4 text-sm leading-relaxed">
                          Abbreviated assessment for rapid skill evaluation.
                        </p>
                        <Button
                          onClick={() => generateTest(false)}
                          className="w-full bg-white text-white hover:bg-slate-100 font-medium uppercase tracking-wide py-2 text-sm"
                        >
                          Begin Practice
                        </Button>
                      </div>
                    </div>

                    <div className="bg-slate-800 border border-black text-white p-6 hover:bg-slate-750 transition-colors">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-slate-700 border border-black flex items-center justify-center mx-auto mb-4">
                          <FileText className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="text-lg font-bold uppercase tracking-wide mb-3">
                          Official Assessment
                        </h3>
                        <div className="text-3xl font-bold mb-1">64</div>
                        <div className="text-xs uppercase tracking-wide mb-1">
                          Questions
                        </div>
                        <div className="text-xs text-slate-400 mb-2 uppercase tracking-wide">
                          Duration: 25 Minutes
                        </div>
                        <div className="p-2 bg-white text-white border border-black mb-2">
                          <div className="text-xs font-bold uppercase tracking-wide">
                            Free and unlimited
                          </div>
                        </div>
                        <div className="p-2 bg-slate-700 border border-black mb-4">
                          <div className="text-xs text-white uppercase tracking-wide">
                            Test readiness level: Comprehensive evaluation
                          </div>
                        </div>
                        <p className="text-slate-300 mb-4 text-sm leading-relaxed">
                          Complete simulation adhering to Department of
                          Transport standards.
                        </p>
                        <Button
                          onClick={() => generateTest(true)}
                          className="w-full border border-black text-slate-300 hover:bg-slate-700 hover:text-white font-medium uppercase tracking-wide py-2 text-sm"
                          variant="outline"
                        >
                          Begin Official Test
                        </Button>
                      </div>
                    </div>

                    <div className="bg-slate-700 border border-black text-white p-6 hover:bg-slate-600 transition-colors">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-slate-600 border border-black flex items-center justify-center mx-auto mb-4">
                          <Car className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="text-lg font-bold uppercase tracking-wide mb-3">
                          Scenario Assessment
                        </h3>
                        <div className="text-3xl font-bold mb-1">426+</div>
                        <div className="text-xs uppercase tracking-wide mb-1">
                          Location-Aware Scenarios
                        </div>
                        <div className="text-xs text-slate-400 mb-2 uppercase tracking-wide">
                          Duration: Unlimited
                        </div>

                        {/* Location Display */}
                        {userLocation ? (
                          <div className="mb-3 p-2 bg-white/20 rounded border border-white/30">
                            <div className="flex items-center justify-center space-x-1 text-xs">
                              <MapPin className="h-3 w-3" />
                              <span>{userLocation.displayName}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="mb-3 p-2 bg-white/10 rounded border border-white/20">
                            <div className="text-xs text-white/70">
                              Set location for tailored scenarios
                            </div>
                          </div>
                        )}

                        <p className="text-slate-300 mb-4 text-sm leading-relaxed">
                          Real-world driving scenarios tailored to your specific
                          area and South African driving conditions.
                        </p>

                        {/* Progress Indicator */}
                        <div className="mb-4 p-3 bg-white/10 rounded border border-white/20">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <Trophy className="h-4 w-4 text-orange-400" />
                            <span className="text-xs text-white/90 uppercase tracking-wide">
                              Your Progress
                            </span>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-white">
                              {(() => {
                                const progress = getUserProgress();
                                return progress.totalScenariosCompleted;
                              })()}
                            </div>
                            <div className="text-xs text-white/70">
                              scenarios completed
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          {/* Enhanced usage indicator with value messaging */}
                          {usageInfo && !usageInfo.isSubscribed && (
                            <div className="p-3 bg-white/20 rounded border border-white/30">
                              <div className="text-center mb-2">
                                <div className="text-xs text-white/90 uppercase tracking-wide">
                                  Daily scenarios:{" "}
                                  {5 - (usageInfo.remaining || 0)}
                                  /5 used
                                </div>
                                <div className="w-full bg-white/10 border border-white/20 h-1 mt-1">
                                  <div
                                    className="bg-white h-full w-dynamic"
                                    style={{
                                      width: `${((5 - (usageInfo.remaining || 0)) / 5) * 100}%`,
                                    }}
                                  ></div>
                                </div>
                              </div>
                              {usageInfo.remaining === 0 ? (
                                <div className="text-center border-t border-white/20 pt-2">
                                  <div className="text-xs text-white uppercase tracking-wide mb-1">
                                    Daily allocation complete
                                  </div>
                                  <div className="text-xs text-white/70 leading-relaxed">
                                                                      Premium members access 426+ additional
                                  scenarios including location-specific
                                  highway patterns and advanced driving
                                  conditions
                                  </div>
                                </div>
                              ) : (
                                <div className="text-center text-xs text-white/70">
                                  {usageInfo.remaining} scenarios remaining
                                  today
                                </div>
                              )}
                            </div>
                          )}

                          <Button
                            onClick={() => generateScenarioTest()}
                            disabled={usageInfo && !usageInfo.canAccess}
                            className="w-full bg-white text-white hover:bg-slate-100 font-medium uppercase tracking-wide py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Start Scenarios
                          </Button>

                          {usageInfo && !usageInfo.canAccess && (
                            <div className="space-y-2">
                              <div className="p-2 bg-white/10 border border-white/20 text-center">
                                <div className="text-xs text-white/90 uppercase tracking-wide mb-1">
                                  Premium scenarios locked
                                </div>
                                <div className="text-xs text-white/70">
                                  Cape Town coastal routes, Johannesburg highway
                                  merging, rural farm roads
                                </div>
                              </div>
                              <Button
                                asChild
                                className="w-full bg-slate-600 hover:bg-slate-500 text-white font-medium uppercase tracking-wide py-2 text-xs"
                              >
                                <Link to="/pricing">
                                  Access unlimited scenarios
                                </Link>
                              </Button>
                            </div>
                          )}

                          <Button
                            onClick={() => setShowLocationSelector(true)}
                            variant="outline"
                            className="w-full border-2 border-white/30 text-white hover:bg-white/20 font-semibold uppercase tracking-wide py-2 text-xs"
                          >
                            <MapPin className="h-3 w-3 mr-1" />
                            {userLocation ? "Change Location" : "Set Location"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Premium Scenario Preview */}
              <Card className="border border-black bg-slate-800 mt-8">
                <CardHeader className="bg-slate-700 text-white p-6">
                  <CardTitle className="text-xl font-bold uppercase tracking-wide mb-2">
                    Premium scenario categories
                  </CardTitle>
                  <p className="text-slate-300">
                    Advanced assessment scenarios available through premium
                    access
                  </p>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-slate-700 border border-black p-4">
                      <div className="text-white font-bold uppercase tracking-wide text-sm mb-2">
                        Cape Town coastal routes
                      </div>
                      <div className="text-slate-300 text-sm mb-3">
                        Baboon encounter protocols, mountain pass navigation,
                        coastal wind conditions
                      </div>
                      <div className="bg-black text-white p-2 text-center">
                        <div className="text-xs uppercase tracking-wide">
                          Premium access required
                        </div>
                      </div>
                    </div>
                    <div className="bg-slate-700 border border-black p-4">
                      <div className="text-white font-bold uppercase tracking-wide text-sm mb-2">
                        Johannesburg highway merging
                      </div>
                      <div className="text-slate-300 text-sm mb-3">
                        M1 complex interchanges, taxi lane navigation, rush hour
                        protocols
                      </div>
                      <div className="bg-black text-white p-2 text-center">
                        <div className="text-xs uppercase tracking-wide">
                          Premium access required
                        </div>
                      </div>
                    </div>
                    <div className="bg-slate-700 border border-black p-4">
                      <div className="text-white font-bold uppercase tracking-wide text-sm mb-2">
                        Rural farm road navigation
                      </div>
                      <div className="text-slate-300 text-sm mb-3">
                        Livestock crossing procedures, gravel road techniques,
                        narrow bridge protocols
                      </div>
                      <div className="bg-black text-white p-2 text-center">
                        <div className="text-xs uppercase tracking-wide">
                          Premium access required
                        </div>
                      </div>
                    </div>
                    <div className="bg-slate-700 border border-black p-4">
                      <div className="text-white font-bold uppercase tracking-wide text-sm mb-2">
                        Night driving assessments
                      </div>
                      <div className="text-slate-300 text-sm mb-3">
                        Reduced visibility protocols, headlight management,
                        pedestrian detection
                      </div>
                      <div className="bg-black text-white p-2 text-center">
                        <div className="text-xs uppercase tracking-wide">
                          Premium access required
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 text-center">
                    <Button
                      asChild
                      className="bg-white text-white hover:bg-slate-100 font-medium uppercase tracking-wide"
                    >
                      <Link to="/pricing">Access premium scenarios</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (testCompleted) {
    const overallPassed = results.every((r) => r.passed);
    const correctAnswers = results.reduce((sum, r) => sum + r.correct, 0);
    const totalQuestions = results.reduce((sum, r) => sum + r.total, 0);
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);

    return (
      <div className="min-h-screen bg-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Card className="border-2 border-black bg-slate-800">
              <CardHeader className="bg-slate-800 text-white p-8">
                <div className="text-center">
                  <div
                    className={`w-24 h-24 mx-auto mb-6 border-4 flex items-center justify-center ${
                      overallPassed
                        ? "bg-white/20 border-white text-white"
                        : "bg-white/20 border-white text-white"
                    }`}
                  >
                    {overallPassed ? (
                      <CheckCircle className="h-12 w-12" />
                    ) : (
                      <XCircle className="h-12 w-12" />
                    )}
                  </div>

                  <CardTitle className="text-3xl font-bold mb-4 uppercase tracking-wide">
                    Assessment Results
                  </CardTitle>

                  <div className="text-6xl font-bold mb-4">
                    <span className="text-white">{percentage}%</span>
                  </div>
                  <p className="text-slate-200 text-lg uppercase tracking-wide">
                    {correctAnswers} of {totalQuestions} Questions Correct
                  </p>

                  <div className="mt-6 p-4 bg-white/20 border border-white/30">
                    <p
                      className={`font-bold text-lg uppercase tracking-wide ${
                        overallPassed ? "text-white" : "text-white"
                      }`}
                    >
                      {overallPassed
                        ? "Assessment Status: PASSED"
                        : "Assessment Status: REQUIRES IMPROVEMENT"}
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-8">
                <h3 className="font-bold text-white mb-6 text-xl uppercase tracking-wide">
                  Category Performance Analysis
                </h3>
                <div className="bg-slate-700 p-6">
                  {results.map((result, index) => (
                    <div
                      key={index}
                      className={`p-6 border-2 mb-4 last:mb-0 ${
                        result.passed
                          ? "bg-slate-800 border-slate-600"
                          : "bg-slate-800 border-slate-600"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-bold text-white uppercase tracking-wide text-lg">
                          {result.category}
                        </span>
                        <div className="flex items-center space-x-4">
                          <span className="text-slate-300 font-semibold">
                            {result.correct}/{result.total}
                          </span>
                          <div
                            className={`w-8 h-8 border-2 flex items-center justify-center ${
                              result.passed
                                ? "border-slate-600 bg-slate-700"
                                : "border-slate-600 bg-slate-700"
                            }`}
                          >
                            {result.passed ? (
                              <CheckCircle className="h-5 w-5 text-white" />
                            ) : (
                              <XCircle className="h-5 w-5 text-white" />
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-slate-300 mb-3 uppercase tracking-wide">
                        Minimum Required: {result.required}/{result.total}
                      </div>
                      <Progress
                        value={(result.correct / result.total) * 100}
                        className="h-3"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <Button
                    onClick={() => generateTest(isFullTest)}
                    variant="outline"
                    className="flex-1 border-2 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white font-semibold uppercase tracking-wide py-3"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Retake Assessment
                  </Button>
                  <Button
                    asChild
                    className="flex-1 bg-slate-800 hover:bg-slate-700 font-semibold uppercase tracking-wide py-3"
                  >
                    <Link to="/progress">View Progress Record</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="bg-white border-b-2 border-black shadow-sm mb-8">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <Button
              asChild
              variant="ghost"
              className="text-slate-700 hover:text-white font-semibold uppercase tracking-wide"
            >
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Exit Assessment
              </Link>
            </Button>

            <div className="text-center">
              <Badge className="mb-2 bg-slate-800 text-white uppercase tracking-wide">
                {testMode === "scenarios"
                  ? "AI Scenarios"
                  : isFullTest
                    ? "Official Assessment"
                    : "Practice Mode"}
              </Badge>
              <div className="text-sm text-slate-600 uppercase tracking-wide">
                {testMode === "scenarios"
                  ? `AI Scenario ${currentQuestion + 1}`
                  : `Question ${currentQuestion + 1} of ${totalItems}`}
              </div>
            </div>

            {testMode !== "scenarios" && (
              <div className="text-sm text-slate-600 font-semibold uppercase tracking-wide">
                {Math.round(progress)}% Complete
              </div>
            )}
          </div>

          {testMode !== "scenarios" && (
            <Progress value={progress} className="h-3 bg-slate-200" />
          )}
        </div>
      </div>
      <div className="container mx-auto px-4 py-6">
        {/* Question Card */}
        <div className="max-w-4xl mx-auto">
          <Card className="border-2 border-black bg-slate-800">
            <CardHeader className="bg-slate-800 text-white p-6">
              <div className="flex items-center justify-between mb-4">
                <Badge className="bg-white/20 text-white uppercase tracking-wide border border-white/30">
                  {currentItem?.category.replace("_", " ")}
                </Badge>
                {testMode !== "scenarios" && (
                  <div className="text-sm text-slate-200 uppercase tracking-wide">
                    {currentQuestion + 1}/{totalItems}
                  </div>
                )}
              </div>
              <CardTitle className="text-2xl font-bold leading-relaxed">
                {testMode === "scenarios" && currentS
                  ? currentS.title
                  : currentItem?.question}
              </CardTitle>
              
              {/* Display relevant image for questions and scenarios */}
              {currentItem && (
                (() => {
                  const imagePath = getRelevantImage(currentItem, testMode);
                  return imagePath ? (
                    <div className="mt-6 flex justify-center">
                      <div className="max-w-md w-full">
                        <img
                          src={imagePath}
                          alt={testMode === "scenarios" ? "Scenario image" : "Question image"}
                          className="w-full h-auto rounded-lg border-2 border-slate-200 shadow-lg"
                          onError={(e) => {
                            // Hide image if it fails to load
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    </div>
                  ) : null;
                })()
              )}
              
              {testMode === "scenarios" && currentS && (
                <div className="mt-4 p-4 bg-white/10 border border-white/20 rounded">
                  <div className="text-slate-200 mb-2 text-sm uppercase tracking-wide font-semibold">
                    Scenario Context
                  </div>
                  <p className="text-slate-100 leading-relaxed">
                    {currentS.scenario}
                  </p>
                </div>
              )}
            </CardHeader>

            <CardContent className="p-8">
              <RadioGroup
                value={selectedAnswer}
                onValueChange={handleAnswerSelect}
              >
                <div className="space-y-4">
                  {currentItem?.options.map((option, index) => {
                    const isSelected = selectedAnswer === option;
                    const isCorrectAnswer =
                      answered && index === currentItem.correct;
                    const isWrongSelected =
                      answered && isSelected && index !== currentItem.correct;

                    return (
                      <div
                        key={index}
                        className={`border-2 p-6 transition-colors cursor-pointer ${
                          answered
                            ? isCorrectAnswer
                              ? "border-slate-600 bg-slate-700"
                              : isWrongSelected
                                ? "border-slate-600 bg-slate-700"
                                : "border-slate-600 bg-slate-800"
                            : isSelected
                              ? "border-slate-600 bg-slate-700"
                              : "border-slate-600 hover:border-slate-500 bg-slate-800"
                        }`}
                        onClick={() => handleAnswerSelect(option)}
                      >
                        <div className="flex items-center space-x-4">
                          <RadioGroupItem
                            value={option}
                            id={`option-${index}`}
                            disabled={answered}
                            className="w-5 h-5"
                          />
                          <Label
                            htmlFor={`option-${index}`}
                            className="flex-1 cursor-pointer font-medium text-white"
                          >
                            {option}
                          </Label>
                          {answered && isCorrectAnswer && (
                            <div className="w-8 h-8 border-2 border-slate-600 bg-slate-700 flex items-center justify-center">
                              <CheckCircle className="h-5 w-5 text-white" />
                            </div>
                          )}
                          {answered && isWrongSelected && (
                            <div className="w-8 h-8 border-2 border-slate-600 bg-slate-700 flex items-center justify-center">
                              <XCircle className="h-5 w-5 text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </RadioGroup>

              {showResult && (
                <div
                  className={`p-6 border-2 ${
                    isCorrect
                      ? "bg-slate-700 border-slate-600"
                      : "bg-slate-700 border-slate-600"
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div
                      className={`w-8 h-8 border-2 flex items-center justify-center ${
                        isCorrect
                          ? "border-slate-600 bg-slate-700"
                          : "border-slate-600 bg-slate-700"
                      }`}
                    >
                      {isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-white" />
                      ) : (
                        <XCircle className="h-5 w-5 text-white" />
                      )}
                    </div>
                    <div>
                      <div
                        className={`font-bold mb-2 uppercase tracking-wide ${
                          isCorrect ? "text-white" : "text-white"
                        }`}
                      >
                        {isCorrect ? "Correct Answer" : "Incorrect Answer"}
                      </div>
                      <div className="text-slate-200 leading-relaxed">
                        {currentItem?.explanation}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {!answered ? (
                <Button
                  onClick={submitAnswer}
                  disabled={!selectedAnswer}
                  className="w-full bg-slate-800 hover:bg-slate-700 font-semibold uppercase tracking-wide py-4 text-lg"
                >
                  Submit Response
                </Button>
              ) : (
                <Button
                  onClick={nextQuestion}
                  className="w-full bg-slate-800 hover:bg-slate-700 font-semibold uppercase tracking-wide py-4 text-lg"
                >
                  {currentQuestion < totalItems - 1
                    ? testMode === "scenarios"
                      ? "Proceed to Next Scenario"
                      : "Proceed to Next Question"
                    : "Complete Assessment"}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Location Selector Modal */}
      {showLocationSelector && (
        <LocationSelector
          onLocationSelected={handleLocationSelected}
          onClose={() => setShowLocationSelector(false)}
          currentLocation={userLocation}
        />
      )}
    </div>
  );
}

export default function Practice() {
  return (
    <AuthenticatedRoute>
      <PracticeComponent />
    </AuthenticatedRoute>
  );
}
