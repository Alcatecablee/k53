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

    testQuestions.forEach((question) => {
      categories[question.category].total++;
    });

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
      <div className="min-h-screen bg-slate-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="bg-white border-b-2 border-slate-800 shadow-sm mb-8 -mx-4 px-4 py-6">
            <div className="flex items-center justify-between">
              <Button asChild variant="ghost" className="text-slate-700 hover:text-slate-900 font-semibold uppercase tracking-wide">
                <Link to="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Return to Portal
                </Link>
              </Button>
              <div className="text-center">
                <h1 className="text-2xl font-bold text-slate-900 uppercase tracking-wide">
                  Assessment Selection Portal
                </h1>
                <p className="text-slate-600 uppercase text-sm tracking-wide">K53 Examination Preparation System</p>
              </div>
              <div></div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto">
            <Card className="border-2 border-slate-800 bg-white mb-8">
              <CardHeader className="bg-slate-800 text-white p-8">
                <CardTitle className="text-2xl font-bold uppercase tracking-wide mb-2">
                  Assessment Type Selection
                </CardTitle>
                <p className="text-slate-200">
                  Select your preferred examination format according to Department of Transport standards
                </p>
              </CardHeader>
              <CardContent className="p-8">
                <div className="bg-slate-100 p-6 mb-8">
                  <h3 className="text-lg font-bold uppercase tracking-wide text-slate-800 mb-6 text-center">
                    Official Assessment Categories
                  </h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-white border-2 border-slate-300">
                      <div className="w-12 h-12 bg-slate-100 border-2 border-slate-800 flex items-center justify-center mx-auto mb-3">
                        <Settings className="w-6 h-6 text-slate-800" />
                      </div>
                      <div className="font-bold text-slate-800 uppercase tracking-wide text-sm">
                        Vehicle Controls
                      </div>
                      <div className="text-sm text-slate-600 mt-1">8 Questions</div>
                      <div className="text-xs text-slate-500 uppercase tracking-wide">
                        Minimum Pass: 6/8 (75%)
                      </div>
                    </div>
                    <div className="text-center p-4 bg-white border-2 border-slate-300">
                      <div className="w-12 h-12 bg-slate-100 border-2 border-slate-800 flex items-center justify-center mx-auto mb-3">
                        <Layers className="w-6 h-6 text-slate-800" />
                      </div>
                      <div className="font-bold text-slate-800 uppercase tracking-wide text-sm">
                        Road Signs
                      </div>
                      <div className="text-sm text-slate-600 mt-1">28 Questions</div>
                      <div className="text-xs text-slate-500 uppercase tracking-wide">
                        Minimum Pass: 23/28 (82%)
                      </div>
                    </div>
                    <div className="text-center p-4 bg-white border-2 border-slate-300">
                      <div className="w-12 h-12 bg-slate-100 border-2 border-slate-800 flex items-center justify-center mx-auto mb-3">
                        <ChartBarStacked className="w-6 h-6 text-slate-800" />
                      </div>
                      <div className="font-bold text-slate-800 uppercase tracking-wide text-sm">
                        Traffic Rules
                      </div>
                      <div className="text-sm text-slate-600 mt-1">28 Questions</div>
                      <div className="text-xs text-slate-500 uppercase tracking-wide">
                        Minimum Pass: 22/28 (79%)
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-slate-800 text-white p-8 hover:bg-slate-700 transition-colors">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-white/20 border-2 border-white/30 flex items-center justify-center mx-auto mb-6">
                        <Clock className="h-10 w-10" />
                      </div>
                      <h3 className="text-2xl font-bold uppercase tracking-wide mb-4">
                        Practice Assessment
                      </h3>
                      <div className="text-5xl font-bold mb-2">
                        12
                      </div>
                      <div className="text-sm uppercase tracking-wide mb-1">
                        Questions
                      </div>
                      <div className="text-xs text-slate-300 mb-6 uppercase tracking-wide">
                        Duration: ~5 Minutes
                      </div>
                      <p className="text-slate-300 mb-6 leading-relaxed">
                        Abbreviated assessment covering all mandatory categories for rapid skill evaluation.
                      </p>
                      <Button
                        onClick={() => generateTest(false)}
                        className="w-full bg-white text-slate-800 hover:bg-slate-100 font-semibold uppercase tracking-wide py-3"
                      >
                        Initialize Practice Mode
                      </Button>
                    </div>
                  </div>

                  <div className="bg-white border-2 border-slate-800 p-8 hover:shadow-lg transition-shadow">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-slate-100 border-2 border-slate-800 flex items-center justify-center mx-auto mb-6">
                        <FileText className="h-10 w-10 text-slate-800" />
                      </div>
                      <h3 className="text-2xl font-bold uppercase tracking-wide mb-4 text-slate-800">
                        Official Assessment
                      </h3>
                      <div className="text-5xl font-bold mb-2 text-slate-800">
                        64
                      </div>
                      <div className="text-sm uppercase tracking-wide mb-1 text-slate-600">
                        Questions
                      </div>
                      <div className="text-xs text-slate-500 mb-6 uppercase tracking-wide">
                        Duration: ~25 Minutes
                      </div>
                      <p className="text-slate-600 mb-6 leading-relaxed">
                        Complete simulation adhering to official Department of Transport K53 examination standards.
                      </p>
                      <Button
                        onClick={() => generateTest(true)}
                        className="w-full border-2 border-slate-800 text-slate-800 hover:bg-slate-800 hover:text-white font-semibold uppercase tracking-wide py-3"
                        variant="outline"
                      >
                        Begin Official Assessment
                      </Button>
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
      <div className="min-h-screen bg-slate-50">
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
                    <span className="text-white">
                      {percentage}%
                    </span>
                  </div>
                  <p className="text-slate-200 text-lg uppercase tracking-wide">
                    {correctAnswers} of {totalQuestions} Questions Correct
                  </p>

                  <div className="mt-6 p-4 bg-white/20 border border-white/30">
                    <p className={`font-bold text-lg uppercase tracking-wide ${
                      overallPassed ? "text-white" : "text-white"
                    }`}>
                      {overallPassed
                        ? "Assessment Status: PASSED"
                        : "Assessment Status: REQUIRES IMPROVEMENT"
                      }
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
                          <div className={`w-8 h-8 border-2 flex items-center justify-center ${
                            result.passed
                              ? "border-slate-800 bg-slate-100"
                              : "border-red-500 bg-red-50"
                          }`}>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black">
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
                {isFullTest ? "Full K53 Test" : "Quick Practice"}
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
                  {currentQ?.category.replace("_", " ")}
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
              <RadioGroup
                value={selectedAnswer}
                onValueChange={handleAnswerSelect}
              >
                <div className="space-y-3">
                  {currentQ?.options.map((option, index) => {
                    const isSelected = selectedAnswer === option;
                    const isCorrectAnswer =
                      answered && index === currentQ.correct;
                    const isWrongSelected =
                      answered && isSelected && index !== currentQ.correct;

                    return (
                      <div
                        key={index}
                        className={`border rounded-lg p-4 transition-colors cursor-pointer ${
                          answered
                            ? isCorrectAnswer
                              ? "border-green-500 bg-green-50"
                              : isWrongSelected
                                ? "border-red-500 bg-red-50"
                                : "border-gray-200 bg-white"
                            : isSelected
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300 bg-white"
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
                <div
                  className={`p-4 rounded-lg border ${
                    isCorrect
                      ? "bg-green-50 border-green-200"
                      : "bg-red-50 border-red-200"
                  }`}
                >
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
                  {currentQuestion < testQuestions.length - 1
                    ? "Next Question"
                    : "Complete Test"}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
