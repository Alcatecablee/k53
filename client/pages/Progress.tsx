import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  TrendingUp,
  Target,
  Clock,
  Award,
  AlertTriangle,
  Gamepad2,
  TrafficCone,
  Clipboard,
  Dice1,
  BarChart3,
  Users,
  LogOut,
  BookOpen,
  MapPin,
  CheckCircle,
  Info,
} from "lucide-react";
import { Link } from "react-router-dom";
import { AuthenticatedRoute } from "@/components/AuthenticatedRoute";
import { SEO } from "@/components/SEO";
import { SEO_CONFIGS } from "@/hooks/useSEO";
import { useAuth } from "@/contexts/AuthContext";
import { getUserStatistics, type UserStatistics } from "@/services/statisticsService";
import { getUserProgress, getDefaultProgress } from "@/services/achievementService";
import { hasPremiumAccess } from "@/services/subscriptionService";

export default function Progress() {
  const { user, signOut } = useAuth();
  const [userStats, setUserStats] = useState<UserStatistics | null>(null);
  const [progress, setProgress] = useState<any>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [stats, progressData, premiumStatus] = await Promise.all([
          getUserStatistics(),
          getUserProgress(),
          hasPremiumAccess()
        ]);
        
        setUserStats(stats);
        setProgress(progressData);
        setIsPremium(premiumStatus);
      } catch (error) {
        console.warn("Error loading progress data:", error);
        setProgress(getDefaultProgress());
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "controls":
        return <Gamepad2 className="h-6 w-6" />;
      case "signs":
        return <TrafficCone className="h-6 w-6" />;
      case "rules":
        return <Clipboard className="h-6 w-6" />;
      case "mixed":
        return <Dice1 className="h-6 w-6" />;
      default:
        return <BarChart3 className="h-6 w-6" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "controls":
        return "text-slate-300";
      case "signs":
        return "text-slate-300";
      case "rules":
        return "text-slate-300";
      case "mixed":
        return "text-slate-300";
      default:
        return "text-slate-300";
    }
  };

  return (
    <AuthenticatedRoute>
      <SEO {...SEO_CONFIGS.progress} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(SEO_CONFIGS.analytics)
        }}
      />
      <div className="min-h-screen bg-slate-900">
        {/* Header */}
        <header className="bg-slate-800 border-b border-black sticky top-0 z-50">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-slate-700 border border-black flex items-center justify-center">
                    <div className="text-white font-bold text-sm tracking-wider">
                      K53
                    </div>
                  </div>
                  <div className="border-l border-black pl-4">
                    <h1 className="text-xl font-bold text-white tracking-tight">
                      SUPERK53
                    </h1>
                    <p className="text-sm text-slate-400 font-medium uppercase tracking-wide">
                      Assessment Progress Portal
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <nav className="hidden md:flex items-center space-x-6">
                  <Link
                    to="/"
                    className="text-slate-400 hover:text-white text-xs font-normal transition-colors"
                  >
                    Home
                  </Link>
                  <Link
                    to="/practice"
                    className="text-slate-400 hover:text-white text-xs font-normal transition-colors"
                  >
                    Practice
                  </Link>
                  <Link
                    to="/dltc"
                    className="text-slate-400 hover:text-white text-xs font-normal transition-colors"
                  >
                    Centers
                  </Link>
                  <Link
                    to="/pricing"
                    className="text-slate-400 hover:text-white text-xs font-normal transition-colors"
                  >
                    Premium
                  </Link>
                </nav>

                <div className="flex items-center space-x-4">
                  <Button
                    asChild
                    variant="ghost"
                    className="text-slate-400 hover:text-white font-semibold uppercase tracking-wide"
                  >
                    <Link to="/profile">
                      <Users className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={signOut}
                    className="text-slate-400 hover:text-white font-semibold uppercase tracking-wide"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Page Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-white mb-4 uppercase tracking-wide">
                Assessment Progress Report
              </h1>
              <p className="text-slate-300 text-lg">
                Official Department of Transport K53 Learner's License Assessment Tracking
              </p>
            </div>

            {loading ? (
              <div className="space-y-8">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-slate-800 border border-black p-8 animate-pulse">
                    <div className="h-8 bg-slate-700 rounded mb-4"></div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[...Array(3)].map((_, j) => (
                        <div key={j} className="h-32 bg-slate-700 rounded"></div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {/* Performance Overview */}
                <div className="bg-slate-800 border border-black p-8 mb-8">
                  <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wide">
                    Performance Overview
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="text-center border-r border-black last:border-r-0">
                      <div className="text-4xl font-bold text-white mb-2">
                        {userStats?.totalTests || 0}
                      </div>
                      <div className="text-sm text-slate-400 uppercase tracking-wide font-medium">
                        Total Assessments
                      </div>
                    </div>
                    <div className="text-center border-r border-black last:border-r-0">
                      <div className="text-4xl font-bold text-white mb-2">
                        {userStats?.passRate || 0}%
                      </div>
                      <div className="text-sm text-slate-400 uppercase tracking-wide font-medium">
                        Pass Rate
                      </div>
                    </div>
                    <div className="text-center border-r border-black last:border-r-0">
                      <div className="text-4xl font-bold text-white mb-2">
                        {userStats?.averageScore || 0}%
                      </div>
                      <div className="text-sm text-slate-400 uppercase tracking-wide font-medium">
                        Average Score
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-white mb-2">
                        {progress?.currentStreak || 0}
                      </div>
                      <div className="text-sm text-slate-400 uppercase tracking-wide font-medium">
                        Day Streak
                      </div>
                    </div>
                  </div>
                </div>

                {/* Category Performance */}
                <div className="bg-slate-800 border border-black p-8 mb-8">
                  <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wide">
                    Category Performance Analysis
                  </h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-slate-700 border border-black p-6">
                        <div className="flex items-center space-x-4 mb-4">
                          {getCategoryIcon("controls")}
                          <h3 className="text-xl font-bold text-white uppercase tracking-wide">
                            Vehicle Controls
                          </h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-slate-400 uppercase tracking-wide">Tests</div>
                            <div className="text-white font-bold">{userStats?.questionStats.total || 0}</div>
                          </div>
                          <div>
                            <div className="text-slate-400 uppercase tracking-wide">Passed</div>
                            <div className="text-white font-bold">{userStats?.questionStats.passed || 0}</div>
                          </div>
                          <div>
                            <div className="text-slate-400 uppercase tracking-wide">Average</div>
                            <div className="text-white font-bold">{userStats?.questionStats.averageScore || 0}%</div>
                          </div>
                          <div>
                            <div className="text-slate-400 uppercase tracking-wide">Status</div>
                            <div className="text-white font-bold">
                              {userStats?.questionStats.averageScore >= 75 ? "PASS" : "NEEDS WORK"}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-700 border border-black p-6">
                        <div className="flex items-center space-x-4 mb-4">
                          {getCategoryIcon("scenarios")}
                          <h3 className="text-xl font-bold text-white uppercase tracking-wide">
                            Driving Scenarios
                          </h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-slate-400 uppercase tracking-wide">Tests</div>
                            <div className="text-white font-bold">{userStats?.scenarioStats.total || 0}</div>
                          </div>
                          <div>
                            <div className="text-slate-400 uppercase tracking-wide">Passed</div>
                            <div className="text-white font-bold">{userStats?.scenarioStats.passed || 0}</div>
                          </div>
                          <div>
                            <div className="text-slate-400 uppercase tracking-wide">Average</div>
                            <div className="text-white font-bold">{userStats?.scenarioStats.averageScore || 0}%</div>
                          </div>
                          <div>
                            <div className="text-slate-400 uppercase tracking-wide">Status</div>
                            <div className="text-white font-bold">
                              {userStats?.scenarioStats.averageScore >= 75 ? "PASS" : "NEEDS WORK"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Achievements */}
                <div className="bg-slate-800 border border-black p-8 mb-8">
                  <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wide">
                    Assessment Achievements
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {progress?.achievements?.slice(0, 6).map((achievement: any, index: number) => (
                      <div
                        key={index}
                        className={`bg-slate-700 border border-black p-4 ${
                          achievement.unlocked ? "opacity-100" : "opacity-50"
                        }`}
                      >
                        <div className="flex items-center space-x-3 mb-2">
                          <Award className="h-5 w-5 text-white" />
                          <h3 className="font-bold text-white uppercase tracking-wide text-sm">
                            {achievement.title}
                          </h3>
                        </div>
                        <p className="text-slate-300 text-xs">
                          {achievement.description}
                        </p>
                        {achievement.unlocked && (
                          <Badge className="mt-2 bg-slate-600 text-white font-bold uppercase tracking-wide text-xs">
                            ACHIEVED
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Assessment Recommendations */}
                <div className="bg-slate-800 border border-black p-8">
                  <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wide">
                    Assessment Recommendations
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-700 border border-black p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <Target className="h-6 w-6 text-white" />
                        <h3 className="text-lg font-bold text-white uppercase tracking-wide">
                          Focus Areas
                        </h3>
                      </div>
                      <div className="space-y-2 text-sm">
                        {userStats?.questionStats.averageScore < 75 && (
                          <div className="flex items-center space-x-2">
                            <AlertTriangle className="h-4 w-4 text-red-400" />
                            <span className="text-slate-300">Practice vehicle controls more frequently</span>
                          </div>
                        )}
                        {userStats?.scenarioStats.averageScore < 75 && (
                          <div className="flex items-center space-x-2">
                            <AlertTriangle className="h-4 w-4 text-red-400" />
                            <span className="text-slate-300">Complete more driving scenarios</span>
                          </div>
                        )}
                        {userStats?.passRate < 80 && (
                          <div className="flex items-center space-x-2">
                            <AlertTriangle className="h-4 w-4 text-red-400" />
                            <span className="text-slate-300">Review failed assessment areas</span>
                          </div>
                        )}
                        {userStats?.passRate >= 80 && (
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-400" />
                            <span className="text-slate-300">Excellent progress - continue current study pattern</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-slate-700 border border-black p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <Clock className="h-6 w-6 text-white" />
                        <h3 className="text-lg font-bold text-white uppercase tracking-wide">
                          Study Schedule
                        </h3>
                      </div>
                      <div className="space-y-2 text-sm text-slate-300">
                        <div>Complete 5 scenarios daily to maintain streak</div>
                        <div>Focus on weak categories for 30 minutes daily</div>
                        <div>Take full assessment every 3 days</div>
                        <div>Review incorrect answers thoroughly</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center space-x-4 mt-8">
                  <Button
                    asChild
                    className="bg-slate-600 text-white hover:bg-slate-500 font-medium uppercase tracking-wide"
                  >
                    <Link to="/practice">
                      Continue Assessment
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="border-black text-slate-300 hover:bg-slate-700 hover:text-white font-medium uppercase tracking-wide"
                  >
                    <Link to="/profile">
                      View Profile
                    </Link>
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </AuthenticatedRoute>
  );
}
