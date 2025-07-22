import { Button } from "@/components/ui/button";
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
} from "lucide-react";
import { Link } from "react-router-dom";

export default function ProgressPage() {
  // Mock user progress data (will be replaced with Supabase data)
  const userStats = {
    level: 12,
    currentXP: 2450,
    nextLevelXP: 3000,
    streak: 7,
    testsCompleted: 23,
    averageScore: 82,
    totalStudyTime: 145, // minutes
    bestCategory: "Vehicle Controls",
    weakestCategory: "Road Signs",
  };

  const weeklyProgress = [
    { day: "Mon", xp: 120 },
    { day: "Tue", xp: 85 },
    { day: "Wed", xp: 200 },
    { day: "Thu", xp: 0 },
    { day: "Fri", xp: 150 },
    { day: "Sat", xp: 180 },
    { day: "Sun", xp: 95 },
  ];

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
            <h1 className="text-3xl font-bold text-gray-800">Your Progress</h1>
            <p className="text-gray-600">Track your K53 learning journey</p>
          </div>
          <div className="flex items-center space-x-2">
            <Flame className="h-5 w-5 text-orange-500 animate-pulse" />
            <span className="font-bold text-orange-700">
              {userStats.streak}
            </span>
          </div>
        </div>

        <div className="max-w-6xl mx-auto space-y-8">
          {/* User Level and XP */}
          <Card className="duolingo-card bg-gradient-to-r from-green-400 to-blue-500 text-white">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-white/20 rounded-full p-3">
                      <Crown className="h-8 w-8" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold">
                        Level {userStats.level}
                      </h2>
                      <p className="opacity-90">K53 Learner</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm opacity-90">
                        {userStats.currentXP} / {userStats.nextLevelXP} XP
                      </span>
                      <span className="text-sm opacity-90">
                        {userStats.nextLevelXP - userStats.currentXP} XP to next
                        level
                      </span>
                    </div>
                    <div className="bg-white/20 rounded-full h-3">
                      <div
                        className="bg-white h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${(userStats.currentXP / userStats.nextLevelXP) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-4xl font-bold mb-2">
                    {userStats.averageScore}%
                  </div>
                  <div className="opacity-90">Average Score</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="duolingo-card text-center">
              <CardContent className="p-6">
                <div className="bg-blue-100 rounded-full p-3 w-fit mx-auto mb-3">
                  <Trophy className="h-6 w-6 text-blue-500" />
                </div>
                <div className="text-2xl font-bold text-gray-800 mb-1">
                  {userStats.testsCompleted}
                </div>
                <div className="text-sm text-gray-600">Tests Completed</div>
              </CardContent>
            </Card>

            <Card className="duolingo-card text-center">
              <CardContent className="p-6">
                <div className="bg-orange-100 rounded-full p-3 w-fit mx-auto mb-3">
                  <Flame className="h-6 w-6 text-orange-500" />
                </div>
                <div className="text-2xl font-bold text-gray-800 mb-1">
                  {userStats.streak}
                </div>
                <div className="text-sm text-gray-600">Day Streak</div>
              </CardContent>
            </Card>

            <Card className="duolingo-card text-center">
              <CardContent className="p-6">
                <div className="bg-green-100 rounded-full p-3 w-fit mx-auto mb-3">
                  <Clock className="h-6 w-6 text-green-500" />
                </div>
                <div className="text-2xl font-bold text-gray-800 mb-1">
                  {Math.floor(userStats.totalStudyTime / 60)}h{" "}
                  {userStats.totalStudyTime % 60}m
                </div>
                <div className="text-sm text-gray-600">Study Time</div>
              </CardContent>
            </Card>

            <Card className="duolingo-card text-center">
              <CardContent className="p-6">
                <div className="bg-purple-100 rounded-full p-3 w-fit mx-auto mb-3">
                  <Users className="h-6 w-6 text-purple-500" />
                </div>
                <div className="text-2xl font-bold text-gray-800 mb-1">
                  Top 15%
                </div>
                <div className="text-sm text-gray-600">Leaderboard</div>
              </CardContent>
            </Card>
          </div>

          {/* Weekly Activity */}
          <Card className="duolingo-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-gray-600" />
                <span>This Week's Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-end space-x-2 h-32">
                {weeklyProgress.map((day, index) => (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center"
                  >
                    <div
                      className={`w-full rounded-t-lg transition-all duration-300 ${
                        day.xp > 0 ? "bg-primary" : "bg-gray-200"
                      }`}
                      style={{
                        height: `${Math.max((day.xp / 200) * 100, day.xp > 0 ? 20 : 8)}%`,
                        minHeight: day.xp > 0 ? "20px" : "8px",
                      }}
                    />
                    <div className="text-xs font-medium text-gray-600 mt-2">
                      {day.day}
                    </div>
                    <div className="text-xs text-gray-500">
                      {day.xp > 0 ? `${day.xp} XP` : "-"}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Category Progress */}
          <Card className="duolingo-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-gray-600" />
                <span>Category Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {categoryProgress.map((category, index) => {
                const IconComponent = category.icon;
                return (
                  <div key={index} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${category.color}`}>
                          <IconComponent className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {category.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {category.mastered} of {category.total} lessons
                            completed
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-800">
                          {category.progress}%
                        </div>
                        <div className="text-sm text-gray-600">Complete</div>
                      </div>
                    </div>
                    <Progress value={category.progress} className="h-2" />
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="duolingo-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-gray-600" />
                <span>Achievements</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map((achievement) => {
                  const IconComponent = achievement.icon;
                  return (
                    <div
                      key={achievement.id}
                      className={`p-4 rounded-2xl border-2 transition-all ${
                        achievement.earned
                          ? "bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 shadow-lg"
                          : "bg-gray-50 border-gray-200 opacity-60"
                      }`}
                    >
                      <div
                        className={`mx-auto mb-3 p-3 rounded-full w-fit ${
                          achievement.earned
                            ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg"
                            : "bg-gray-300 text-gray-500"
                        }`}
                      >
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <h3 className="font-bold text-gray-800 text-center mb-1">
                        {achievement.title}
                      </h3>
                      <p className="text-sm text-gray-600 text-center">
                        {achievement.description}
                      </p>
                      {achievement.earned && (
                        <div className="text-center mt-2">
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            Earned!
                          </Badge>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Practice Recommendation */}
          <Card className="duolingo-card bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <CardContent className="p-8 text-center">
              <div className="bg-white/20 rounded-full p-4 w-fit mx-auto mb-4">
                <Target className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold mb-2">
                Ready for More Practice?
              </h3>
              <p className="mb-6 opacity-90">
                Focus on {userStats.weakestCategory} to improve your overall
                score!
              </p>
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="rounded-xl font-semibold"
              >
                <Link to="/practice">
                  Continue Learning
                  <Zap className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
