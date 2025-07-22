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
  Clock,
  BookOpen,
  Home,
  RotateCcw,
  Heart,
  Flame,
  Star,
  Crown,
  Zap,
  Car,
  Trophy,
} from "lucide-react";
import { Link } from "react-router-dom";
import { K53Question, generateRandomTest } from "../data/k53Questions";

interface TestResult {
  category: string;
  correct: number;
  total: number;
  required: number;
  passed: boolean;
}

export default function Practice() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [answered, setAnswered] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [isFullTest, setIsFullTest] = useState(false);
  const [lives, setLives] = useState(3); // Duolingo-style lives system
  const [xpEarned, setXpEarned] = useState(0);

  // Generate a randomized test questions
  const [testQuestions, setTestQuestions] = useState<K53Question[]>([]);

  const generateTest = (fullTest: boolean = false) => {
    setIsFullTest(fullTest);
    setLives(fullTest ? 5 : 3); // More lives for full test
    setXpEarned(0);
    
    if (fullTest) {
      // Full K53 test: 8 controls, 28 signs, 28 rules = 64 questions
      const randomTest = generateRandomTest(8, 28, 28);
      setTestQuestions(randomTest);
    } else {
      // Quick demo test: 2 controls, 5 signs, 5 rules = 12 questions  
      const randomTest = generateRandomTest(2, 5, 5);
      setTestQuestions(randomTest);
    }
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
    if (selectedAnswer === "") return;
    
    const answerIndex =
      testQuestions[currentQuestion].options.indexOf(selectedAnswer);
    setUserAnswers([...userAnswers, answerIndex]);
    setAnswered(true);
    setShowResult(true);

    // Duolingo-style XP and lives system
    const isCorrect = answerIndex === testQuestions[currentQuestion].correct;
    if (isCorrect) {
      setXpEarned(prev => prev + 10);
    } else {
      setLives(prev => Math.max(0, prev - 1));
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < testQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer("");
      setAnswered(false);
      setShowResult(false);
    } else {
      completeTest();
    }
  };

  const completeTest = () => {
    // Calculate results by category
    const finalAnswers = [
      ...userAnswers,
      testQuestions[currentQuestion].options.indexOf(selectedAnswer),
    ];

    // K53 scoring requirements (scaled for test size)
    const getRequiredScore = (total: number, fullRequirement: number, fullTotal: number) => {
      if (isFullTest) return fullRequirement;
      return Math.ceil((total / fullTotal) * fullRequirement);
    };

    const categories = {
      controls: { correct: 0, total: 0, required: 0 },
      signs: { correct: 0, total: 0, required: 0 },
      rules: { correct: 0, total: 0, required: 0 },
    };

    // Count questions by category
    testQuestions.forEach((question) => {
      categories[question.category].total++;
    });

    // Set required scores based on K53 standards
    categories.controls.required = getRequiredScore(categories.controls.total, 6, 8);
    categories.signs.required = getRequiredScore(categories.signs.total, 23, 28);  
    categories.rules.required = getRequiredScore(categories.rules.total, 22, 28);

    // Calculate correct answers
    testQuestions.forEach((question, index) => {
      if (finalAnswers[index] === question.correct) {
        categories[question.category].correct++;
      }
    });

    const testResults: TestResult[] = Object.entries(categories)
      .filter(([, data]) => data.total > 0) // Only include categories with questions
      .map(([category, data]) => ({
        category: category.charAt(0).toUpperCase() + category.slice(1),
        correct: data.correct,
        total: data.total,
        required: data.required,
        passed: data.correct >= data.required,
      }));

    setResults(testResults);
    setTestCompleted(true);
  };

  const currentQ = testQuestions[currentQuestion];
  const isCorrect =
    answered && selectedAnswer === currentQ?.options[currentQ.correct];
  const progress = ((currentQuestion + 1) / testQuestions.length) * 100;

  if (!testStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Button asChild variant="ghost" className="rounded-xl">
              <Link to="/">
                <Home className="h-5 w-5 mr-2" />
                Home
              </Link>
            </Button>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-800">K53 Practice</h1>
              <p className="text-gray-600">Choose your challenge</p>
            </div>
            <div className="flex items-center space-x-2">
              <Flame className="h-5 w-5 text-orange-500" />
              <span className="font-bold text-orange-700">7</span>
            </div>
          </div>

          {/* Test Setup */}
          <div className="max-w-4xl mx-auto">
            <Card className="duolingo-card border-2 mb-8">
              <CardHeader className="text-center pb-4">
                <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-full p-6 w-fit mx-auto mb-4 shadow-xl">
                  <BookOpen className="h-12 w-12" />
                </div>
                <CardTitle className="text-3xl font-bold text-gray-800">
                  Ready to Practice?
                </CardTitle>
                <p className="text-gray-600">
                  Test your K53 knowledge with our interactive questions
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-800 text-center">K53 Test Categories:</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-2xl">
                      <Car className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                      <div className="font-semibold text-gray-800">Vehicle Controls</div>
                      <Badge variant="outline" className="mt-1">Pass: 6/8</Badge>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-2xl">
                      <div className="h-8 w-8 mx-auto mb-2 bg-green-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold">⚠</span>
                      </div>
                      <div className="font-semibold text-gray-800">Road Signs</div>
                      <Badge variant="outline" className="mt-1">Pass: 23/28</Badge>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-2xl">
                      <BookOpen className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                      <div className="font-semibold text-gray-800">Traffic Rules</div>
                      <Badge variant="outline" className="mt-1">Pass: 22/28</Badge>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Quick Practice */}
                  <Card className="duolingo-card bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 hover:border-blue-300 transition-colors cursor-pointer group">
                    <CardContent className="p-6 text-center">
                      <div className="bg-blue-500 text-white rounded-full p-4 w-fit mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <Zap className="h-8 w-8" />
                      </div>
                      <div className="text-3xl font-bold text-blue-600 mb-2">12</div>
                      <div className="text-sm text-gray-600 mb-1">Questions</div>
                      <div className="text-xs text-gray-500 mb-4">~5 minutes</div>
                      <div className="flex items-center justify-center space-x-1 mb-4">
                        {[1, 2, 3].map((i) => (
                          <Heart key={i} className="h-4 w-4 text-red-500 fill-current" />
                        ))}
                      </div>
                      <Button 
                        onClick={() => generateTest(false)} 
                        className="duolingo-button w-full"
                      >
                        Quick Practice
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Full Test */}
                  <Card className="duolingo-card bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200 hover:border-green-300 transition-colors cursor-pointer group">
                    <CardContent className="p-6 text-center">
                      <div className="bg-green-500 text-white rounded-full p-4 w-fit mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <Trophy className="h-8 w-8" />
                      </div>
                      <div className="text-3xl font-bold text-green-600 mb-2">64</div>
                      <div className="text-sm text-gray-600 mb-1">Questions</div>
                      <div className="text-xs text-gray-500 mb-4">~25 minutes</div>
                      <div className="flex items-center justify-center space-x-1 mb-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Heart key={i} className="h-4 w-4 text-red-500 fill-current" />
                        ))}
                      </div>
                      <Button 
                        onClick={() => generateTest(true)} 
                        className="duolingo-button w-full bg-green-500 hover:bg-green-600"
                      >
                        Full K53 Test
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Choose Quick Practice for a short session or take the Full K53 Test 
                    that matches the real exam format.
                  </p>
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
    const finalXP = Math.round((correctAnswers / totalQuestions) * 100) + (overallPassed ? 50 : 0);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card className="duolingo-card border-2 text-center">
              <CardContent className="p-8">
                <div className={`mx-auto mb-6 p-6 rounded-full w-fit shadow-lg ${
                  overallPassed 
                    ? 'bg-gradient-to-r from-green-400 to-green-600 text-white' 
                    : 'bg-gradient-to-r from-orange-400 to-red-500 text-white'
                }`}>
                  {overallPassed ? (
                    <Trophy className="h-16 w-16" />
                  ) : (
                    <Heart className="h-16 w-16" />
                  )}
                </div>

                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  {overallPassed ? "Congratulations!" : "Keep Practicing!"}
                </h2>

                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-2xl p-4 mb-6 inline-block">
                  <div className="flex items-center space-x-2">
                    <Star className="h-6 w-6" />
                    <span className="text-xl font-bold">+{finalXP} XP</span>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <h3 className="font-semibold text-gray-800">Your Results:</h3>
                  {results.map((result, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-2xl border-2 ${
                        result.passed 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-red-50 border-red-200'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-800">{result.category}</span>
                        {result.passed ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        Score: {result.correct}/{result.total} (Required: {result.required})
                      </div>
                      <Progress value={(result.correct / result.total) * 100} className="h-2" />
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={() => generateTest(isFullTest)}
                    variant="outline"
                    className="flex-1 rounded-xl font-semibold"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Try Again
                  </Button>
                  <Button asChild className="duolingo-button flex-1">
                    <Link to="/progress">View Progress</Link>
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-6">
        {/* Progress Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <Button asChild variant="ghost" size="sm" className="rounded-xl">
              <Link to="/">
                <Home className="h-4 w-4 mr-2" />
                Exit
              </Link>
            </Button>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Heart 
                    key={i} 
                    className={`h-5 w-5 ${
                      i < lives ? 'text-red-500 fill-current' : 'text-gray-300'
                    }`} 
                  />
                ))}
              </div>
              <div className="bg-yellow-400 text-white px-3 py-1 rounded-full font-bold text-sm">
                +{xpEarned} XP
              </div>
            </div>
          </div>
          
          <div className="duolingo-progress h-3 mb-2">
            <div className="duolingo-progress-bar" style={{ width: `${progress}%` }} />
          </div>
          
          <div className="flex justify-between text-sm text-gray-600">
            <span>Question {currentQuestion + 1} of {testQuestions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
        </div>

        {/* Question Card */}
        <div className="max-w-2xl mx-auto">
          <Card className="duolingo-card border-2">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between mb-4">
                <Badge variant="outline" className="capitalize px-3 py-1 rounded-full">
                  {currentQ?.category.replace('_', ' ')}
                </Badge>
                <div className="text-sm text-gray-500">
                  {currentQuestion + 1}/{testQuestions.length}
                </div>
              </div>
              <CardTitle className="text-xl leading-relaxed text-gray-800">
                {currentQ?.question}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Answer Options */}
              <RadioGroup value={selectedAnswer} onValueChange={handleAnswerSelect}>
                <div className="space-y-3">
                  {currentQ?.options.map((option, index) => {
                    const isSelected = selectedAnswer === option;
                    const isCorrectAnswer = answered && index === currentQ.correct;
                    const isWrongSelected = answered && isSelected && index !== currentQ.correct;
                    
                    return (
                      <div
                        key={index}
                        className={`border-2 rounded-2xl p-4 transition-all cursor-pointer hover:scale-102 ${
                          answered
                            ? isCorrectAnswer
                              ? 'border-green-500 bg-green-50 shadow-lg'
                              : isWrongSelected
                              ? 'border-red-500 bg-red-50 shadow-lg'
                              : 'border-gray-200 bg-white'
                            : isSelected
                            ? 'border-blue-500 bg-blue-50 shadow-md'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                        onClick={() => handleAnswerSelect(option)}
                      >
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem 
                            value={option} 
                            id={`option-${index}`}
                            disabled={answered}
                            className="data-[state=checked]:border-blue-500 data-[state=checked]:text-blue-500"
                          />
                          <Label 
                            htmlFor={`option-${index}`} 
                            className="flex-1 cursor-pointer text-base font-medium"
                          >
                            {option}
                          </Label>
                          {answered && isCorrectAnswer && (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          )}
                          {answered && isWrongSelected && (
                            <XCircle className="h-5 w-5 text-red-600" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </RadioGroup>

              {/* Explanation */}
              {showResult && (
                <div className={`p-4 rounded-2xl border-2 ${
                  isCorrect 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-start space-x-3">
                    {isCorrect ? (
                      <CheckCircle className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-6 w-6 text-red-600 mt-0.5 flex-shrink-0" />
                    )}
                    <div>
                      <div className="font-bold mb-2 text-gray-800">
                        {isCorrect ? "Correct! +10 XP" : "Incorrect"}
                      </div>
                      <div className="text-sm text-gray-700">
                        {currentQ?.explanation}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {!answered ? (
                <Button 
                  onClick={submitAnswer} 
                  disabled={!selectedAnswer}
                  className="duolingo-button w-full text-lg py-6"
                >
                  Submit Answer
                </Button>
              ) : (
                <Button 
                  onClick={nextQuestion} 
                  className="duolingo-button w-full text-lg py-6"
                >
                  {currentQuestion < testQuestions.length - 1 ? "Continue" : "Complete Test"}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
