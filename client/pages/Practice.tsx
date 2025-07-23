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
} from "lucide-react";
import { Link } from "react-router-dom";
import { K53Question } from "../data/k53Questions";
import { K53Scenario } from "../data/k53Scenarios";
import { getScenarios, getQuestions } from "@/services/dataService";
import { LocationSelector } from "@/components/LocationSelector";
import { AuthenticatedRoute } from "@/components/AuthenticatedRoute";
import {
  getStoredLocation,
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

          // Load user location
          try {
            const profile = await getUserProfile();
            if (profile.location) {
              // Parse location from user profile
              const locationParts = profile.location.split(", ");
              if (locationParts.length >= 2) {
                const userLoc: UserLocation = {
                  city: locationParts[0],
                  region: locationParts[1],
                  displayName: profile.location,
                };
                setUserLocation(userLoc);
                return;
              }
            }
          } catch (dbError) {
            console.warn(
              "Database unavailable for user profile, using local storage:",
              dbError,
            );
          }
        }

        // Always fallback to stored location
        const storedLocation = getStoredLocation();
        if (storedLocation) {
          setUserLocation(storedLocation);
        }
      } catch (error) {
        console.warn("Error loading user data, using defaults:", error);
        // Set a default location if nothing works
        const defaultLocation: UserLocation = {
          city: "Cape Town",
          region: "Western Cape",
          displayName: "Cape Town, Western Cape",
        };
        setUserLocation(defaultLocation);
        setUsageInfo({ canAccess: true, remaining: 5, isSubscribed: false });
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
        console.error("Error updating user location:", error);
      }
    }
  };

  const generateTest = async (fullTest: boolean = false) => {
    setIsFullTest(fullTest);
    setTestMode("questions");

    try {
      if (fullTest) {
        const randomTest = await getQuestions(8, 28, 28);
        console.log(
          "Official test randomized order (first 10):",
          randomTest.slice(0, 10).map((q) => q.id),
        );
        setTestQuestions(randomTest);
      } else {
        const randomTest = await getQuestions(2, 5, 5);
        console.log(
          "Practice test randomized order:",
          randomTest.map((q) => q.id),
        );
        setTestQuestions(randomTest);
      }
    } catch (error) {
      console.error("Error generating test:", error);
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
    // Check if user can access scenarios
    const accessInfo = await canAccessScenarios();

    if (!accessInfo.canAccess) {
      alert(
        `You've reached your daily limit of 5 scenarios. Upgrade to SuperK53 for unlimited practice!`,
      );
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

      // Log first few scenario IDs for verification (can be removed later)
      console.log(
        "AI Scenarios randomized order (first 10):",
        randomScenarios.slice(0, 10).map((s) => s.id),
      );
      if (userLocation) {
        console.log("Location-aware scenarios for:", userLocation.displayName);
      }

      setTestScenarios(randomScenarios);

      // Update usage for scenarios (only for free users)
      if (!accessInfo.isSubscribed) {
        await updateDailyUsage("scenarios", 1);
        // Refresh usage info
        const newAccessInfo = await canAccessScenarios();
        setUsageInfo(newAccessInfo);
      }
    } catch (error) {
      console.error("Error generating scenarios:", error);
      // Fallback to empty array
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
          console.log("Progress saved to database successfully");
        } else {
          console.log("Progress saved locally (database unavailable)");
        }
      } catch (error) {
        console.warn("Progress saved locally only:", error);
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
  const isCorrect =
    answered &&
    currentItem &&
    selectedAnswer === currentItem.options[currentItem.correct];
  const totalItems =
    testMode === "questions" ? testQuestions.length : testScenarios.length;
  const progress = ((currentQuestion + 1) / totalItems) * 100;

  if (!testStarted) {
    return (
      <div className="min-h-screen bg-slate-900">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="bg-slate-800 border-b border-slate-700 mb-8 -mx-4 px-4 py-6">
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
            <Card className="border border-slate-700 bg-slate-800 mb-8">
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
                <div className="bg-slate-700 border border-slate-600 p-6 mb-8">
                  <h3 className="text-lg font-bold uppercase tracking-wide text-white mb-6 text-center">
                    Official Assessment Categories
                  </h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-slate-800 border border-slate-600">
                      <div className="w-12 h-12 bg-slate-700 border border-slate-600 flex items-center justify-center mx-auto mb-3">
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
                    <div className="text-center p-4 bg-slate-800 border border-slate-600">
                      <div className="w-12 h-12 bg-slate-700 border border-slate-600 flex items-center justify-center mx-auto mb-3">
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
                    <div className="text-center p-4 bg-slate-800 border border-slate-600">
                      <div className="w-12 h-12 bg-slate-700 border border-slate-600 flex items-center justify-center mx-auto mb-3">
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
                  <div className="bg-slate-800 border border-slate-700 text-white p-6 hover:bg-slate-750 transition-colors">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-slate-700 border border-slate-600 flex items-center justify-center mx-auto mb-4">
                        <Clock className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-lg font-bold uppercase tracking-wide mb-3">
                        Practice Assessment
                      </h3>
                      <div className="text-3xl font-bold mb-1">12</div>
                      <div className="text-xs uppercase tracking-wide mb-1">
                        Questions
                      </div>
                      <div className="text-xs text-slate-400 mb-4 uppercase tracking-wide">
                        Duration: 5 Minutes
                      </div>
                      <p className="text-slate-300 mb-4 text-sm leading-relaxed">
                        Abbreviated assessment for rapid skill evaluation.
                      </p>
                      <Button
                        onClick={() => generateTest(false)}
                        className="w-full bg-white text-slate-900 hover:bg-slate-100 font-medium uppercase tracking-wide py-2 text-sm"
                      >
                        Begin Practice
                      </Button>
                    </div>
                  </div>

                  <div className="bg-slate-800 border border-slate-700 text-white p-6 hover:bg-slate-750 transition-colors">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-slate-700 border border-slate-600 flex items-center justify-center mx-auto mb-4">
                        <FileText className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-lg font-bold uppercase tracking-wide mb-3">
                        Official Assessment
                      </h3>
                      <div className="text-3xl font-bold mb-1">
                        64
                      </div>
                      <div className="text-xs uppercase tracking-wide mb-1">
                        Questions
                      </div>
                      <div className="text-xs text-slate-400 mb-4 uppercase tracking-wide">
                        Duration: 25 Minutes
                      </div>
                      <p className="text-slate-300 mb-4 text-sm leading-relaxed">
                        Complete simulation adhering to Department of Transport
                        standards.
                      </p>
                      <Button
                        onClick={() => generateTest(true)}
                        className="w-full border border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white font-medium uppercase tracking-wide py-2 text-sm"
                        variant="outline"
                      >
                        Begin Official Test
                      </Button>
                    </div>
                  </div>

                  <div className="bg-slate-700 border border-slate-600 text-white p-6 hover:bg-slate-600 transition-colors">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-white/20 border-2 border-white/30 flex items-center justify-center mx-auto mb-4">
                        <Car className="h-8 w-8" />
                      </div>
                      <h3 className="text-lg font-bold uppercase tracking-wide mb-3">
                        🔥 AI Scenarios
                      </h3>
                      <div className="text-3xl font-bold mb-1">220+</div>
                      <div className="text-xs uppercase tracking-wide mb-1">
                        Location-Aware Scenarios
                      </div>
                      <div className="text-xs text-white/80 mb-2 uppercase tracking-wide">
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

                      <p className="text-white/90 mb-4 text-sm leading-relaxed">
                        Real-world driving scenarios tailored to your area -
                        from Cape Town's baboons to Joburg's taxi ranks!
                      </p>

                      <div className="space-y-2">
                        {/* Usage indicator for free users */}
                        {usageInfo && !usageInfo.isSubscribed && (
                          <div className="p-2 bg-white/20 rounded border border-white/30 text-center">
                            <div className="text-xs text-white/90">
                              Daily scenarios: {5 - (usageInfo.remaining || 0)}
                              /5 used
                            </div>
                            {usageInfo.remaining === 0 && (
                              <div className="text-xs text-red-200 mt-1">
                                Daily limit reached!
                              </div>
                            )}
                          </div>
                        )}

                        <Button
                          onClick={() => generateScenarioTest()}
                          disabled={usageInfo && !usageInfo.canAccess}
                          className="w-full bg-white text-orange-600 hover:bg-gray-100 font-semibold uppercase tracking-wide py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          🚀 Start AI Scenarios
                        </Button>

                        {usageInfo && !usageInfo.canAccess && (
                          <Button
                            asChild
                            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold uppercase tracking-wide py-2 text-xs"
                          >
                            <Link to="/pricing">⭐ Upgrade for Unlimited</Link>
                          </Button>
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
          </div>
        </div>
      </div>
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
            <Card className="border-2 border-slate-800 bg-white">
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
                <h3 className="font-bold text-slate-800 mb-6 text-xl uppercase tracking-wide">
                  Category Performance Analysis
                </h3>
                <div className="bg-slate-100 p-6">
                  {results.map((result, index) => (
                    <div
                      key={index}
                      className={`p-6 border-2 mb-4 last:mb-0 ${
                        result.passed
                          ? "bg-white border-slate-300"
                          : "bg-white border-red-300"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-bold text-slate-800 uppercase tracking-wide text-lg">
                          {result.category}
                        </span>
                        <div className="flex items-center space-x-4">
                          <span className="text-slate-600 font-semibold">
                            {result.correct}/{result.total}
                          </span>
                          <div
                            className={`w-8 h-8 border-2 flex items-center justify-center ${
                              result.passed
                                ? "border-slate-800 bg-slate-100"
                                : "border-red-500 bg-red-50"
                            }`}
                          >
                            {result.passed ? (
                              <CheckCircle className="h-5 w-5 text-slate-800" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-500" />
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-slate-600 mb-3 uppercase tracking-wide">
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
                    className="flex-1 border-2 border-slate-800 text-slate-800 hover:bg-slate-800 hover:text-white font-semibold uppercase tracking-wide py-3"
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
      <div className="bg-white border-b-2 border-slate-800 shadow-sm mb-8">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <Button
              asChild
              variant="ghost"
              className="text-slate-700 hover:text-slate-900 font-semibold uppercase tracking-wide"
            >
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Exit Assessment
              </Link>
            </Button>

            <div className="text-center">
              <Badge className="mb-2 bg-slate-800 text-white uppercase tracking-wide">
                {testMode === "scenarios"
                  ? "🔥 AI Scenarios"
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
          <Card className="border-2 border-slate-800 bg-white">
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
                              ? "border-slate-800 bg-slate-100"
                              : isWrongSelected
                                ? "border-red-500 bg-red-50"
                                : "border-slate-300 bg-white"
                            : isSelected
                              ? "border-slate-800 bg-slate-100"
                              : "border-slate-300 hover:border-slate-500 bg-white"
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
                            className="flex-1 cursor-pointer font-medium text-slate-800"
                          >
                            {option}
                          </Label>
                          {answered && isCorrectAnswer && (
                            <div className="w-8 h-8 border-2 border-slate-800 bg-slate-100 flex items-center justify-center">
                              <CheckCircle className="h-5 w-5 text-slate-800" />
                            </div>
                          )}
                          {answered && isWrongSelected && (
                            <div className="w-8 h-8 border-2 border-red-500 bg-red-50 flex items-center justify-center">
                              <XCircle className="h-5 w-5 text-red-500" />
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
                      ? "bg-slate-100 border-slate-800"
                      : "bg-red-50 border-red-500"
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div
                      className={`w-8 h-8 border-2 flex items-center justify-center ${
                        isCorrect
                          ? "border-slate-800 bg-slate-100"
                          : "border-red-500 bg-red-50"
                      }`}
                    >
                      {isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-slate-800" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                    <div>
                      <div
                        className={`font-bold mb-2 uppercase tracking-wide ${
                          isCorrect ? "text-slate-800" : "text-red-700"
                        }`}
                      >
                        {isCorrect ? "Correct Answer" : "Incorrect Answer"}
                      </div>
                      <div className="text-slate-700 leading-relaxed">
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
