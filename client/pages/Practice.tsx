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

  // Generate a randomized test questions
  const [testQuestions, setTestQuestions] = useState<K53Question[]>([]);

  const generateTest = (fullTest: boolean = false) => {
    setIsFullTest(fullTest);

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

    const categories = {
      controls: { correct: 0, total: 0, required: 6 },
      signs: { correct: 0, total: 0, required: 23 },
      rules: { correct: 0, total: 0, required: 22 },
    };

    testQuestions.forEach((question, index) => {
      categories[question.category].total++;
      if (finalAnswers[index] === question.correct) {
        categories[question.category].correct++;
      }
    });

    const testResults: TestResult[] = Object.entries(categories).map(
      ([category, data]) => ({
        category: category.charAt(0).toUpperCase() + category.slice(1),
        correct: data.correct,
        total: data.total,
        required: data.required,
        passed: data.correct >= data.required,
      }),
    );

    setResults(testResults);
    setTestCompleted(true);
  };

  const currentQ = testQuestions[currentQuestion];
  const isCorrect =
    answered && selectedAnswer === currentQ?.options[currentQ.correct];
  const progress = ((currentQuestion + 1) / testQuestions.length) * 100;

  if (!testStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-secondary/10">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Button asChild variant="outline">
              <Link to="/">
                <Home className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-foreground">
                K53 Practice Test
              </h1>
              <p className="text-muted-foreground">
                Test your knowledge before the real exam
              </p>
            </div>
            <div></div>
          </div>

          {/* Test Setup */}
          <div className="max-w-2xl mx-auto">
            <Card className="border-2">
              <CardHeader className="text-center">
                <div className="bg-primary/10 text-primary rounded-full p-4 w-fit mx-auto mb-4">
                  <BookOpen className="h-8 w-8" />
                </div>
                <CardTitle className="text-2xl">
                  Ready to Start Your Practice Test?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <h3 className="font-semibold">K53 Test Categories:</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">🚗 Vehicle Controls</span>
                      <Badge variant="outline">Pass: 6/8 required</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">🚸 Road Signs</span>
                      <Badge variant="outline">Pass: 23/28 required</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">📋 Traffic Rules</span>
                      <Badge variant="outline">Pass: 22/28 required</Badge>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="border-2 border-accent/20">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-primary mb-2">12</div>
                      <div className="text-sm text-muted-foreground mb-3">Questions</div>
                      <div className="text-xs text-muted-foreground mb-3">~5 minutes</div>
                      <Button
                        onClick={() => generateTest(false)}
                        size="sm"
                        variant="outline"
                        className="w-full"
                      >
                        Quick Practice
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-primary/20 bg-primary/5">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-primary mb-2">64</div>
                      <div className="text-sm text-muted-foreground mb-3">Questions</div>
                      <div className="text-xs text-muted-foreground mb-3">~25 minutes</div>
                      <Button
                        onClick={() => generateTest(true)}
                        size="sm"
                        className="w-full"
                      >
                        Full K53 Test
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Choose a quick practice session or take the full 64-question K53 test
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

    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-secondary/10">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card className="border-2">
              <CardHeader className="text-center">
                <div
                  className={`rounded-full p-4 w-fit mx-auto mb-4 ${overallPassed ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
                >
                  {overallPassed ? (
                    <CheckCircle className="h-8 w-8" />
                  ) : (
                    <XCircle className="h-8 w-8" />
                  )}
                </div>
                <CardTitle className="text-2xl">
                  {overallPassed
                    ? "Congratulations! You Passed!"
                    : "Test Complete - More Practice Needed"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Your Results:</h3>
                  {results.map((result, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border-2 ${result.passed ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{result.category}</span>
                        {result.passed ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Score: {result.correct}/{result.total} (Required:{" "}
                        {result.required})
                      </div>
                      <Progress
                        value={(result.correct / result.total) * 100}
                        className="mt-2"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={generateTest}
                    variant="outline"
                    className="flex-1"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Try Again
                  </Button>
                  <Button asChild className="flex-1">
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
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-secondary/10">
      <div className="container mx-auto px-4 py-8">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button asChild variant="outline" size="sm">
              <Link to="/">
                <Home className="h-4 w-4 mr-2" />
                Exit Test
              </Link>
            </Button>
            <Badge variant="secondary" className="text-sm">
              Question {currentQuestion + 1} of {testQuestions.length}
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <div className="max-w-2xl mx-auto">
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="capitalize">
                  {currentQ?.category}
                </Badge>
                <div className="text-sm text-muted-foreground">
                  {currentQuestion + 1}/{testQuestions.length}
                </div>
              </div>
              <CardTitle className="text-xl leading-relaxed">
                {currentQ?.question}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Answer Options */}
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
                        className={`border-2 rounded-lg p-4 transition-colors cursor-pointer ${
                          answered
                            ? isCorrectAnswer
                              ? "border-green-500 bg-green-50"
                              : isWrongSelected
                                ? "border-red-500 bg-red-50"
                                : "border-border bg-background"
                            : isSelected
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
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
                            className="flex-1 cursor-pointer text-base"
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
                <div
                  className={`p-4 rounded-lg border-2 ${isCorrect ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
                >
                  <div className="flex items-start space-x-3">
                    {isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                    )}
                    <div>
                      <div className="font-medium mb-1">
                        {isCorrect ? "Correct!" : "Incorrect"}
                      </div>
                      <div className="text-sm text-muted-foreground">
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
                  size="lg"
                  className="w-full"
                >
                  Submit Answer
                </Button>
              ) : (
                <Button onClick={nextQuestion} size="lg" className="w-full">
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
