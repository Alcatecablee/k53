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
  Gauge,
  Shield,
  BookOpen,
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

  const [testQuestions, setTestQuestions] = useState<K53Question[]>([]);

  const generateTest = (fullTest: boolean = false) => {
    setIsFullTest(fullTest);
    
    if (fullTest) {
      const randomTest = generateRandomTest(8, 28, 28);
      setTestQuestions(randomTest);
    } else {
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
    const finalAnswers = [
      ...userAnswers,
      testQuestions[currentQuestion].options.indexOf(selectedAnswer),
    ];

    const getRequiredScore = (total: number, fullRequirement: number, fullTotal: number) => {
      if (isFullTest) return fullRequirement;
      return Math.ceil((total / fullTotal) * fullRequirement);
    };

    const categories = {
      controls: { correct: 0, total: 0, required: 0 },
      signs: { correct: 0, total: 0, required: 0 },
      rules: { correct: 0, total: 0, required: 0 },
    };

    testQuestions.forEach((question) => {
      categories[question.category].total++;
    });

    categories.controls.required = getRequiredScore(categories.controls.total, 6, 8);
    categories.signs.required = getRequiredScore(categories.signs.total, 23, 28);  
    categories.rules.required = getRequiredScore(categories.rules.total, 22, 28);

    testQuestions.forEach((question, index) => {
      if (finalAnswers[index] === question.correct) {
        categories[question.category].correct++;
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

    setResults(testResults);
    setTestCompleted(true);
  };

  const currentQ = testQuestions[currentQuestion];
  const isCorrect =
    answered && selectedAnswer === currentQ?.options[currentQ.correct];
  const progress = ((currentQuestion + 1) / testQuestions.length) * 100;

  if (!testStarted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Button asChild variant="ghost">
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">K53 Practice Test</h1>
              <p className="text-gray-600">Choose your test format</p>
            </div>
            <div></div>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="border border-gray-200 mb-8">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-gray-900 mb-2">
                  Select Test Format
                </CardTitle>
                <p className="text-gray-600">
                  Choose between a quick practice session or a full K53 simulation
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-600 rounded mx-auto mb-2"></div>
                    <div className="font-medium text-gray-900">Vehicle Controls</div>
                    <div className="text-sm text-gray-600">8 questions</div>
                    <div className="text-xs text-gray-500">Pass: 6/8 required</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="w-8 h-8 bg-green-600 rounded-full mx-auto mb-2"></div>
                    <div className="font-medium text-gray-900">Road Signs</div>
                    <div className="text-sm text-gray-600">28 questions</div>
                    <div className="text-xs text-gray-500">Pass: 23/28 required</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="w-8 h-8 bg-orange-600 rounded-sm mx-auto mb-2"></div>
                    <div className="font-medium text-gray-900">Traffic Rules</div>
                    <div className="text-sm text-gray-600">28 questions</div>
                    <div className="text-xs text-gray-500">Pass: 22/28 required</div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="border-2 border-gray-200 hover:border-blue-300 transition-colors cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <Clock className="h-8 w-8 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Quick Practice</h3>
                      <div className="text-3xl font-bold text-blue-600 mb-1">12</div>
                      <div className="text-sm text-gray-600 mb-1">Questions</div>
                      <div className="text-xs text-gray-500 mb-4">Approximately 5 minutes</div>
                      <p className="text-sm text-gray-600 mb-4">
                        Perfect for a quick review session covering all three categories.
                      </p>
                      <Button 
                        onClick={() => generateTest(false)} 
                        className="w-full bg-blue-600 hover:bg-blue-700"
                      >
                        Start Quick Practice
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-green-200 hover:border-green-300 transition-colors cursor-pointer bg-green-50">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <FileText className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Full K53 Test</h3>
                      <div className="text-3xl font-bold text-green-600 mb-1">64</div>
                      <div className="text-sm text-gray-600 mb-1">Questions</div>
                      <div className="text-xs text-gray-500 mb-4">Approximately 25 minutes</div>
                      <p className="text-sm text-gray-600 mb-4">
                        Complete simulation matching the official K53 test format.
                      </p>
                      <Button 
                        onClick={() => generateTest(true)} 
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        Start Full Test
                      </Button>
                    </CardContent>
                  </Card>
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
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <Card className="border border-gray-200">
              <CardHeader className="text-center">
                <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  overallPassed 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-orange-100 text-orange-600'
                }`}>
                  {overallPassed ? (
                    <CheckCircle className="h-10 w-10" />
                  ) : (
                    <XCircle className="h-10 w-10" />
                  )}
                </div>

                <CardTitle className="text-2xl text-gray-900 mb-2">
                  Test Complete
                </CardTitle>
                
                <div className="text-4xl font-bold mb-2">
                  <span className={overallPassed ? 'text-green-600' : 'text-orange-600'}>
                    {percentage}%
                  </span>
                </div>
                <p className="text-gray-600">
                  {correctAnswers} out of {totalQuestions} questions correct
                </p>
                
                {overallPassed ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                    <p className="text-green-800 font-medium">
                      Congratulations! You've passed all required sections.
                    </p>
                  </div>
                ) : (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mt-4">
                    <p className="text-orange-800 font-medium">
                      Keep practicing to improve your scores in the highlighted areas.
                    </p>
                  </div>
                )}
              </CardHeader>
              
              <CardContent className="space-y-4">
                <h3 className="font-semibold text-gray-900 mb-4">Results by Category:</h3>
                {results.map((result, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      result.passed 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-900">{result.category}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">
                          {result.correct}/{result.total}
                        </span>
                        {result.passed ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      Required to pass: {result.required}/{result.total}
                    </div>
                    <Progress value={(result.correct / result.total) * 100} className="h-2" />
                  </div>
                ))}

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button
                    onClick={() => generateTest(isFullTest)}
                    variant="outline"
                    className="flex-1"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Retake Test
                  </Button>
                  <Button asChild className="flex-1 bg-blue-600 hover:bg-blue-700">
                    <Link to="/progress">View All Results</Link>
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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Progress Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <Button asChild variant="ghost" size="sm">
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Exit Test
              </Link>
            </Button>
            
            <div className="text-center">
              <Badge variant="outline" className="mb-2">
                {isFullTest ? 'Full K53 Test' : 'Quick Practice'}
              </Badge>
              <div className="text-sm text-gray-600">
                Question {currentQuestion + 1} of {testQuestions.length}
              </div>
            </div>
            
            <div className="text-sm text-gray-600">
              {Math.round(progress)}% Complete
            </div>
          </div>
          
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <div className="max-w-3xl mx-auto">
          <Card className="border border-gray-200">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <Badge variant="secondary" className="capitalize">
                  {currentQ?.category.replace('_', ' ')}
                </Badge>
                <div className="text-sm text-gray-500">
                  {currentQuestion + 1}/{testQuestions.length}
                </div>
              </div>
              <CardTitle className="text-xl text-gray-900 leading-relaxed">
                {currentQ?.question}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <RadioGroup value={selectedAnswer} onValueChange={handleAnswerSelect}>
                <div className="space-y-3">
                  {currentQ?.options.map((option, index) => {
                    const isSelected = selectedAnswer === option;
                    const isCorrectAnswer = answered && index === currentQ.correct;
                    const isWrongSelected = answered && isSelected && index !== currentQ.correct;
                    
                    return (
                      <div
                        key={index}
                        className={`border rounded-lg p-4 transition-colors cursor-pointer ${
                          answered
                            ? isCorrectAnswer
                              ? 'border-green-500 bg-green-50'
                              : isWrongSelected
                              ? 'border-red-500 bg-red-50'
                              : 'border-gray-200 bg-white'
                            : isSelected
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                        onClick={() => handleAnswerSelect(option)}
                      >
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem 
                            value={option} 
                            id={`option-${index}`}
                            disabled={answered}
                          />
                          <Label 
                            htmlFor={`option-${index}`} 
                            className="flex-1 cursor-pointer font-medium"
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

              {showResult && (
                <div className={`p-4 rounded-lg border ${
                  isCorrect 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-start space-x-3">
                    {isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                    )}
                    <div>
                      <div className="font-medium mb-1 text-gray-900">
                        {isCorrect ? "Correct" : "Incorrect"}
                      </div>
                      <div className="text-sm text-gray-700">
                        {currentQ?.explanation}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {!answered ? (
                <Button 
                  onClick={submitAnswer} 
                  disabled={!selectedAnswer}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Submit Answer
                </Button>
              ) : (
                <Button 
                  onClick={nextQuestion} 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {currentQuestion < testQuestions.length - 1 ? "Next Question" : "Complete Test"}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
