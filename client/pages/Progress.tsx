import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Home,
  Target,
  Clock,
  Award,
  Calendar,
  Flame,
  Star,
  Trophy,
  Crown,
  Car,
  BookOpen,
  Users,
  Zap,
  Shield,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function ProgressPage() {
  const [userStats, setUserStats] = useState({
    level: 0,
    currentXP: 0,
    nextLevelXP: 1000,
    streak: 0,
    testsCompleted: 0,
    averageScore: 0,
    totalStudyTime: 0,
    bestCategory: "Unknown",
    weakestCategory: "Unknown",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserProgress();
  }, []);

  const loadUserProgress = async () => {
    try {
      // This would require a proper user session
      // For now, show empty stats since we're removing mock data
      setUserStats({
        level: 1,
        currentXP: 0,
        nextLevelXP: 1000,
        streak: 0,
        testsCompleted: 0,
        averageScore: 0,
        totalStudyTime: 0,
        bestCategory: "Not determined",
        weakestCategory: "Not determined",
      });
    } catch (error) {
      console.error("Error loading user progress:", error);
    } finally {
      setLoading(false);
    }
  };

  const [weeklyProgress, setWeeklyProgress] = useState([
    { day: "Mon", xp: 0 },
    { day: "Tue", xp: 0 },
    { day: "Wed", xp: 0 },
    { day: "Thu", xp: 0 },
    { day: "Fri", xp: 0 },
    { day: "Sat", xp: 0 },
    { day: "Sun", xp: 0 },
  ]);

  const achievements = [
    {
      id: 1,
      title: "First Steps",
      description: "Complete your first test",
      icon: Target,
      earned: true,
      color: "text-green-500",
    },
    {
      id: 2,
      title: "Week Warrior",
      description: "7 day streak",
      icon: Flame,
      earned: true,
      color: "text-orange-500",
    },
    {
      id: 3,
      title: "Perfect Score",
      description: "Get 100% on any test",
      icon: Star,
      earned: true,
      color: "text-yellow-500",
    },
    {
      id: 4,
      title: "Speed Demon",
      description: "Complete test in under 10 minutes",
      icon: Zap,
      earned: false,
      color: "text-blue-500",
    },
    {
      id: 5,
      title: "K53 Master",
      description: "Pass 10 full tests",
      icon: Crown,
      earned: false,
      color: "text-purple-500",
    },
    {
      id: 6,
      title: "Legendary",
      description: "Reach level 25",
      icon: Trophy,
      earned: false,
      color: "text-amber-500",
    },
  ];

  const categoryProgress = [
    {
      name: "Vehicle Controls",
      progress: 85,
      mastered: 7,
      total: 8,
      icon: Car,
      color: "bg-blue-500",
    },
    {
      name: "Road Signs",
      progress: 68,
      mastered: 19,
      total: 28,
      icon: Shield,
      color: "bg-green-500",
    },
    {
      name: "Traffic Rules",
      progress: 75,
      mastered: 21,
      total: 28,
      icon: BookOpen,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white border-b-2 border-black shadow-sm mb-8 -mx-4 px-4 py-6">
          <div className="flex items-center justify-between">
            <Button
              asChild
              variant="ghost"
              className="text-slate-700 hover:text-slate-900 font-semibold uppercase tracking-wide"
            >
              <Link to="/">
                <Home className="h-5 w-5 mr-2" />
                Return to Portal
              </Link>
            </Button>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-slate-900 uppercase tracking-wide">
                Progress Analytics
              </h1>
              <p className="text-slate-600 uppercase text-sm tracking-wide">
                K53 Assessment Performance Record
              </p>
            </div>
            <div className="bg-slate-800 text-white px-4 py-2">
              <div className="text-center">
                <div className="text-lg font-bold">{userStats.streak}</div>
                <div className="text-xs uppercase tracking-wide">
                  Day Streak
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto space-y-8">
          {/* Performance Overview */}
          <Card className="border-2 border-black bg-white mb-8">
            <CardHeader className="bg-slate-800 text-white p-8">
              <CardTitle className="text-2xl font-bold uppercase tracking-wide">
                Assessment Performance Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-slate-100 border-2 border-black flex items-center justify-center mx-auto mb-4">
                    <Crown className="h-10 w-10 text-slate-800" />
                  </div>
                  <div className="text-4xl font-bold text-slate-800 mb-2">
                    Level {userStats.level}
                  </div>
                  <div className="text-slate-600 uppercase tracking-wide text-sm">
                    Current Proficiency
                  </div>
                </div>

                <div className="text-center">
                  <div className="w-20 h-20 bg-slate-100 border-2 border-black flex items-center justify-center mx-auto mb-4">
                    <Target className="h-10 w-10 text-slate-800" />
                  </div>
                  <div className="text-4xl font-bold text-slate-800 mb-2">
                    {userStats.averageScore}%
                  </div>
                  <div className="text-slate-600 uppercase tracking-wide text-sm">
                    Overall Average
                  </div>
                </div>

                <div className="text-center">
                  <div className="w-20 h-20 bg-slate-100 border-2 border-black flex items-center justify-center mx-auto mb-4">
                    <Trophy className="h-10 w-10 text-slate-800" />
                  </div>
                  <div className="text-4xl font-bold text-slate-800 mb-2">
                    {userStats.testsCompleted}
                  </div>
                  <div className="text-slate-600 uppercase tracking-wide text-sm">
                    Assessments Completed
                  </div>
                </div>
              </div>

              <div className="mt-8 bg-slate-100 p-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-slate-800 font-semibold uppercase tracking-wide">
                    Experience Points: {userStats.currentXP} /{" "}
                    {userStats.nextLevelXP}
                  </span>
                  <span className="text-slate-600 text-sm uppercase tracking-wide">
                    {userStats.nextLevelXP - userStats.currentXP} XP Required
                  </span>
                </div>
                <Progress
                  value={(userStats.currentXP / userStats.nextLevelXP) * 100}
                  className="h-3"
                />
              </div>
            </CardContent>
          </Card>

          {/* System Statistics */}
          <div className="bg-slate-100 p-8 mb-8">
            <h3 className="text-center text-lg font-bold uppercase tracking-wide text-slate-800 mb-8">
              Performance Metrics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center border-r border-black last:border-r-0">
                <div className="text-4xl font-bold text-slate-800 mb-2">
                  {userStats.testsCompleted}
                </div>
                <div className="text-sm text-slate-600 uppercase tracking-wide font-medium">
                  Assessments
                </div>
              </div>
              <div className="text-center border-r border-black last:border-r-0">
                <div className="text-4xl font-bold text-slate-800 mb-2">
                  {userStats.streak}
                </div>
                <div className="text-sm text-slate-600 uppercase tracking-wide font-medium">
                  Day Streak
                </div>
              </div>
              <div className="text-center border-r border-black last:border-r-0">
                <div className="text-4xl font-bold text-slate-800 mb-2">
                  {Math.floor(userStats.totalStudyTime / 60)}h{" "}
                  {userStats.totalStudyTime % 60}m
                </div>
                <div className="text-sm text-slate-600 uppercase tracking-wide font-medium">
                  Study Time
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-slate-800 mb-2">
                  Top 15%
                </div>
                <div className="text-sm text-slate-600 uppercase tracking-wide font-medium">
                  Ranking
                </div>
              </div>
            </div>
          </div>

          {/* Weekly Activity */}
          <Card className="border-2 border-black bg-white mb-8">
            <CardHeader className="bg-slate-800 text-white p-6">
              <CardTitle className="flex items-center space-x-2 text-xl font-bold uppercase tracking-wide">
                <Calendar className="h-6 w-6" />
                <span>Weekly Activity Report</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="flex justify-between items-end space-x-3 h-40">
                {weeklyProgress.map((day, index) => (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center"
                  >
                    <div
                      className={`w-full transition-all duration-300 ${
                        day.xp > 0 ? "bg-slate-800" : "bg-slate-300"
                      }`}
                      style={{
                        height: `${Math.max((day.xp / 200) * 100, day.xp > 0 ? 25 : 10)}%`,
                        minHeight: day.xp > 0 ? "25px" : "10px",
                      }}
                    />
                    <div className="text-sm font-bold text-slate-800 mt-3 uppercase tracking-wide">
                      {day.day}
                    </div>
                    <div className="text-xs text-slate-600">
                      {day.xp > 0 ? `${day.xp} XP` : "No Activity"}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Category Progress */}
          <Card className="border-2 border-black bg-white mb-8">
            <CardHeader className="bg-slate-800 text-white p-6">
              <CardTitle className="flex items-center space-x-2 text-xl font-bold uppercase tracking-wide">
                <TrendingUp className="h-6 w-6" />
                <span>Category Performance Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-6">
                {categoryProgress.map((category, index) => {
                  const IconComponent = category.icon;
                  return (
                    <div
                      key={index}
                      className="border-2 border-black p-6 hover:border-black transition-colors"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-slate-100 border-2 border-black flex items-center justify-center">
                            <IconComponent className="h-8 w-8 text-slate-800" />
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-800 text-xl uppercase tracking-wide">
                              {category.name}
                            </h3>
                            <p className="text-slate-600 mt-1">
                              {category.mastered} of {category.total} questions
                              mastered
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-4xl font-bold text-slate-800 mb-1">
                            {category.progress}%
                          </div>
                          <div className="text-sm text-slate-600 uppercase tracking-wide font-medium">
                            Proficiency
                          </div>
                        </div>
                      </div>
                      <Progress value={category.progress} className="h-4" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="border-2 border-black bg-white mb-8">
            <CardHeader className="bg-slate-800 text-white p-6">
              <CardTitle className="flex items-center space-x-2 text-xl font-bold uppercase tracking-wide">
                <Award className="h-6 w-6" />
                <span>Achievement Record</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {achievements.map((achievement) => {
                  const IconComponent = achievement.icon;
                  return (
                    <div
                      key={achievement.id}
                      className={`p-6 border-2 transition-all ${
                        achievement.earned
                          ? "bg-slate-100 border-black"
                          : "bg-white border-black opacity-60"
                      }`}
                    >
                      <div
                        className={`mx-auto mb-4 w-16 h-16 border-2 flex items-center justify-center ${
                          achievement.earned
                            ? "border-black bg-slate-100 text-slate-800"
                            : "border-black bg-slate-50 text-slate-400"
                        }`}
                      >
                        <IconComponent className="h-8 w-8" />
                      </div>
                      <h3 className="font-bold text-slate-800 text-center mb-2 uppercase tracking-wide">
                        {achievement.title}
                      </h3>
                      <p className="text-sm text-slate-600 text-center leading-relaxed">
                        {achievement.description}
                      </p>
                      <div className="text-center mt-4">
                        <Badge
                          className={`uppercase tracking-wide font-semibold ${
                            achievement.earned
                              ? "bg-slate-800 text-white"
                              : "bg-slate-300 text-slate-600"
                          }`}
                        >
                          {achievement.earned ? "Achieved" : "Locked"}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Assessment Recommendation */}
          <Card className="bg-slate-800 text-white">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-white/20 border-2 border-white/30 flex items-center justify-center mx-auto mb-6">
                <Target className="h-10 w-10" />
              </div>
              <h3 className="text-3xl font-bold mb-4 uppercase tracking-wide">
                Continue Assessment Training
              </h3>
              <p className="mb-8 text-slate-200 text-lg leading-relaxed max-w-2xl mx-auto">
                Recommended focus area: {userStats.weakestCategory}. Continue
                regular practice sessions to maintain proficiency and improve
                overall assessment performance.
              </p>
              <Button
                asChild
                size="lg"
                className="bg-white text-slate-800 hover:bg-slate-100 font-semibold uppercase tracking-wide px-8 py-4 text-lg"
              >
                <Link to="/practice">
                  Access Assessment Portal
                  <ArrowLeft className="ml-3 h-5 w-5 rotate-180" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
