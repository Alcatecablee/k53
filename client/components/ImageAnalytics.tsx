import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { imageMapping, getImagesByCategory } from '@/data/imageMapping';
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Target, 
  Award, 
  AlertTriangle,
  BarChart3,
  PieChart,
  Activity,
  Calendar,
  Zap,
  Brain,
  Lightbulb,
  Eye,
  Timer,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface CategoryPerformance {
  category: string;
  totalAttempts: number;
  correctAttempts: number;
  averageTime: number;
  lastAttempt: Date;
  improvement: number;
  difficulty: 'basic' | 'intermediate' | 'advanced';
}

interface TimeSpentData {
  date: string;
  category: string;
  timeSpent: number;
  imagesViewed: number;
  sessions: number;
}

interface DifficultyProgress {
  difficulty: 'basic' | 'intermediate' | 'advanced';
  totalImages: number;
  masteredImages: number;
  inProgressImages: number;
  notStartedImages: number;
  averageAccuracy: number;
}

interface Recommendation {
  id: string;
  type: 'focus' | 'review' | 'practice' | 'mastery';
  category: string;
  difficulty: string;
  priority: 'high' | 'medium' | 'low';
  description: string;
  estimatedTime: number;
  reason: string;
}

interface AnalyticsData {
  userId: string;
  categoryPerformance: CategoryPerformance[];
  timeSpent: TimeSpentData[];
  difficultyProgress: DifficultyProgress[];
  recommendations: Recommendation[];
  totalStudyTime: number;
  totalSessions: number;
  averageAccuracy: number;
  readinessScore: number;
  lastStudyDate: Date;
  streakDays: number;
}

interface HeatmapData {
  category: string;
  difficulty: string;
  accuracy: number;
  attempts: number;
  timeSpent: number;
}

export function ImageAnalytics() {
  const { toast } = useToast();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'basic' | 'intermediate' | 'advanced' | 'all'>('all');

  // Validate analytics data structure
  const validateAnalyticsData = useCallback((data: any): AnalyticsData | null => {
    try {
      // Check if data exists and has required structure
      if (!data || typeof data !== 'object') {
        return null;
      }

      // Validate required fields
      if (!Array.isArray(data.categoryPerformance) || 
          !Array.isArray(data.timeSpent) || 
          !Array.isArray(data.difficultyProgress) ||
          !Array.isArray(data.recommendations)) {
        return null;
      }

      // Validate numeric fields
      if (typeof data.totalStudyTime !== 'number' || data.totalStudyTime < 0 ||
          typeof data.totalSessions !== 'number' || data.totalSessions < 0 ||
          typeof data.averageAccuracy !== 'number' || data.averageAccuracy < 0 ||
          typeof data.readinessScore !== 'number' || data.readinessScore < 0) {
        return null;
      }

      // Validate date fields
      if (data.lastStudyDate && isNaN(new Date(data.lastStudyDate).getTime())) {
        return null;
      }

      return data;
    } catch (error) {
      return null;
    }
  }, []);

  // Load analytics data from localStorage
  useEffect(() => {
    const loadAnalyticsData = () => {
      setLoading(true);
      try {
        const saved = localStorage.getItem('k53-image-analytics');
        if (saved) {
          const parsed = JSON.parse(saved);
          
          // Validate the parsed data
          const validatedData = validateAnalyticsData(parsed);
          if (!validatedData) {
            throw new Error('Invalid data structure');
          }

          // Convert date strings back to Date objects
          if (validatedData.lastStudyDate) {
            validatedData.lastStudyDate = new Date(validatedData.lastStudyDate);
          }
          validatedData.categoryPerformance?.forEach((cp: CategoryPerformance) => {
            if (cp.lastAttempt) {
              cp.lastAttempt = new Date(cp.lastAttempt);
            }
          });
          setAnalyticsData(validatedData);
        } else {
          // Generate initial analytics data
          generateInitialAnalytics();
        }
      } catch (error) {
        const errorMessage = 'Error loading analytics data. Data has been reset.';
        setError(errorMessage);
        toast({
          title: "Data Error",
          description: errorMessage,
          variant: "destructive",
        });
        localStorage.removeItem('k53-image-analytics');
        generateInitialAnalytics();
      } finally {
        setLoading(false);
      }
    };

    loadAnalyticsData();
  }, [toast, validateAnalyticsData]);

  // Generate initial analytics data
  const generateInitialAnalytics = useCallback(() => {
    const categories = Object.keys(imageMapping);
    const categoryPerformance: CategoryPerformance[] = categories.map(category => {
      const images = getImagesByCategory(category as keyof typeof imageMapping);
      const difficulties = ['basic', 'intermediate', 'advanced'] as const;
      
      return difficulties.map(difficulty => ({
        category,
        difficulty,
        totalAttempts: 0,
        correctAttempts: 0,
        averageTime: 0,
        lastAttempt: new Date(),
        improvement: 0
      }));
    }).flat();

    const difficultyProgress: DifficultyProgress[] = (['basic', 'intermediate', 'advanced'] as const).map((difficulty: 'basic' | 'intermediate' | 'advanced') => {
      const totalImages = categories.reduce((sum, category) => {
        const images = getImagesByCategory(category as keyof typeof imageMapping);
        return sum + images.filter(img => img.difficulty === difficulty).length;
      }, 0);

      return {
        difficulty,
        totalImages,
        masteredImages: 0,
        inProgressImages: 0,
        notStartedImages: totalImages,
        averageAccuracy: 0
      };
    });

    const recommendations: Recommendation[] = [
      {
        id: 'rec-1',
        type: 'focus',
        category: 'signs',
        difficulty: 'basic',
        priority: 'high',
        description: 'Start with basic road signs',
        estimatedTime: 15,
        reason: 'Foundation for all driving knowledge'
      },
      {
        id: 'rec-2',
        type: 'practice',
        category: 'controls',
        difficulty: 'basic',
        priority: 'medium',
        description: 'Practice vehicle controls',
        estimatedTime: 20,
        reason: 'Essential for practical driving'
      }
    ];

    const initialData: AnalyticsData = {
      userId: 'user-' + Date.now(),
      categoryPerformance,
      timeSpent: [],
      difficultyProgress,
      recommendations,
      totalStudyTime: 0,
      totalSessions: 0,
      averageAccuracy: 0,
      readinessScore: 0,
      lastStudyDate: new Date(),
      streakDays: 0
    };

    setAnalyticsData(initialData);
    saveAnalyticsData(initialData);
  }, [toast]);

  // Save analytics data to localStorage
  const saveAnalyticsData = useCallback((data: AnalyticsData) => {
    try {
      localStorage.setItem('k53-image-analytics', JSON.stringify(data));
    } catch (error) {
      const errorMessage = 'Failed to save analytics data. Please check your browser storage.';
      setError(errorMessage);
      toast({
        title: "Save Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [toast]);

  // Update analytics with new session data
  const updateAnalytics = useCallback((sessionData: {
    category: string;
    difficulty: string;
    correct: boolean;
    timeSpent: number;
    imagesViewed: number;
  }) => {
    if (!sessionData || !analyticsData) return;

    const updatedData = { ...analyticsData };
    
    // Update category performance
    const categoryIndex = updatedData.categoryPerformance.findIndex(
      cp => cp.category === sessionData.category && cp.difficulty === sessionData.difficulty
    );
    
    if (categoryIndex !== -1) {
      const cp = updatedData.categoryPerformance[categoryIndex];
      cp.totalAttempts += 1;
      if (sessionData.correct) cp.correctAttempts += 1;
      
      // Safe average time calculation
      if (cp.totalAttempts > 0) {
        cp.averageTime = (cp.averageTime * (cp.totalAttempts - 1) + sessionData.timeSpent) / cp.totalAttempts;
      }
      
      cp.lastAttempt = new Date();
      
      // Safe improvement calculation
      cp.improvement = cp.totalAttempts > 0 ? cp.correctAttempts / cp.totalAttempts : 0;
    }

    // Update time spent
    const today = new Date().toISOString().split('T')[0];
    const timeSpentIndex = updatedData.timeSpent.findIndex(ts => ts.date === today && ts.category === sessionData.category);
    
    if (timeSpentIndex !== -1) {
      updatedData.timeSpent[timeSpentIndex].timeSpent += sessionData.timeSpent;
      updatedData.timeSpent[timeSpentIndex].imagesViewed += sessionData.imagesViewed;
      updatedData.timeSpent[timeSpentIndex].sessions += 1;
    } else {
      updatedData.timeSpent.push({
        date: today,
        category: sessionData.category,
        timeSpent: sessionData.timeSpent,
        imagesViewed: sessionData.imagesViewed,
        sessions: 1
      });
    }

    // Update overall stats
    updatedData.totalStudyTime += sessionData.timeSpent;
    updatedData.totalSessions += 1;
    updatedData.lastStudyDate = new Date();
    
    // Safe readiness score calculation
    const totalAttempts = updatedData.categoryPerformance.reduce((sum, cp) => sum + cp.totalAttempts, 0);
    const totalCorrect = updatedData.categoryPerformance.reduce((sum, cp) => sum + cp.correctAttempts, 0);
    updatedData.averageAccuracy = totalAttempts > 0 ? (totalCorrect / totalAttempts) * 100 : 0;
    
    // Safe readiness score calculation (0-100)
    const totalCategories = updatedData.categoryPerformance.length;
    const attemptedCategories = updatedData.categoryPerformance.filter(cp => cp.totalAttempts > 0).length;
    const categoryCoverage = totalCategories > 0 ? attemptedCategories / totalCategories : 0;
    
    const accuracyWeight = 0.6;
    const coverageWeight = 0.4;
    updatedData.readinessScore = Math.round(
      (updatedData.averageAccuracy * accuracyWeight) + (categoryCoverage * 100 * coverageWeight)
    );

    setAnalyticsData(updatedData);
    saveAnalyticsData(updatedData);
  }, [analyticsData, saveAnalyticsData]);

  // Integration function to be called from other components
  const recordLearningSession = useCallback((sessionData: {
    category: string;
    difficulty: string;
    correct: boolean;
    timeSpent: number;
    imagesViewed: number;
  }) => {
    updateAnalytics(sessionData);
    
    toast({
      title: "Session Recorded",
      description: `Analytics updated for ${sessionData.category} - ${sessionData.difficulty}`,
    });
  }, [updateAnalytics, toast]);

  // Generate recommendations based on current performance
  const generateRecommendations = useCallback(() => {
    if (!analyticsData) return [];

    const recommendations: Recommendation[] = [];
    
    // Find weak areas
    analyticsData.categoryPerformance.forEach(cp => {
      if (cp.totalAttempts > 0 && cp.improvement < 0.7) {
        recommendations.push({
          id: `rec-${cp.category}-${cp.difficulty}`,
          type: 'focus',
          category: cp.category,
          difficulty: cp.difficulty,
          priority: cp.improvement < 0.5 ? 'high' : 'medium',
          description: `Focus on ${cp.category} - ${cp.difficulty} level`,
          estimatedTime: 15,
          reason: `Current accuracy: ${Math.round(cp.improvement * 100)}%`
        });
      }
    });

    // Find areas not started
    analyticsData.categoryPerformance.forEach(cp => {
      if (cp.totalAttempts === 0) {
        recommendations.push({
          id: `rec-start-${cp.category}-${cp.difficulty}`,
          type: 'practice',
          category: cp.category,
          difficulty: cp.difficulty,
          priority: 'medium',
          description: `Start learning ${cp.category} - ${cp.difficulty}`,
          estimatedTime: 20,
          reason: 'Not yet attempted'
        });
      }
    });

    // Add mastery recommendations
    analyticsData.categoryPerformance.forEach(cp => {
      if (cp.totalAttempts > 10 && cp.improvement > 0.8) {
        recommendations.push({
          id: `rec-master-${cp.category}-${cp.difficulty}`,
          type: 'mastery',
          category: cp.category,
          difficulty: cp.difficulty,
          priority: 'low',
          description: `Master ${cp.category} - ${cp.difficulty}`,
          estimatedTime: 10,
          reason: 'Ready for mastery level'
        });
      }
    });

    return recommendations.slice(0, 5); // Return top 5 recommendations
  }, [analyticsData]);

  // Filter data based on selected criteria
  const filteredData = useMemo(() => {
    if (!analyticsData) return null;

    let filtered = { ...analyticsData };

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered.categoryPerformance = filtered.categoryPerformance.filter(
        cp => cp.category === selectedCategory
      );
    }

    // Filter by difficulty
    if (selectedDifficulty !== 'all') {
      filtered.categoryPerformance = filtered.categoryPerformance.filter(
        cp => cp.difficulty === selectedDifficulty
      );
    }

    // Filter time spent data by time range
    if (timeRange !== 'all') {
      const cutoffDate = new Date();
      switch (timeRange) {
        case '7d':
          cutoffDate.setDate(cutoffDate.getDate() - 7);
          break;
        case '30d':
          cutoffDate.setDate(cutoffDate.getDate() - 30);
          break;
        case '90d':
          cutoffDate.setDate(cutoffDate.getDate() - 90);
          break;
      }
      
      filtered.timeSpent = filtered.timeSpent.filter(ts => {
        const date = new Date(ts.date);
        return date >= cutoffDate;
      });
    }

    // Filter recommendations based on selected criteria
    if (selectedCategory !== 'all' || selectedDifficulty !== 'all') {
      filtered.recommendations = filtered.recommendations.filter(rec => {
        const categoryMatch = selectedCategory === 'all' || rec.category === selectedCategory;
        const difficultyMatch = selectedDifficulty === 'all' || rec.difficulty === selectedDifficulty;
        return categoryMatch && difficultyMatch;
      });
    }

    return filtered;
  }, [analyticsData, selectedCategory, selectedDifficulty, timeRange]);

  // Calculate heatmap data with memoization
  const heatmapData = useMemo(() => {
    if (!filteredData) return [];

    const heatmap: HeatmapData[] = [];
    filteredData.categoryPerformance.forEach(cp => {
      if (cp.totalAttempts > 0) {
        heatmap.push({
          category: cp.category,
          difficulty: cp.difficulty,
          accuracy: cp.improvement,
          attempts: cp.totalAttempts,
          timeSpent: cp.averageTime * cp.totalAttempts
        });
      }
    });

    return heatmap;
  }, [filteredData]);

  // Memoize recommendations to prevent unnecessary recalculations
  const currentRecommendations = useMemo(() => {
    if (!filteredData) return [];
    return generateRecommendations();
  }, [filteredData, generateRecommendations]);

  if (error) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Analytics Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600 mb-4">{error}</p>
            <div className="flex space-x-2">
              <Button 
                onClick={() => setError(null)}
                variant="outline"
              >
                Dismiss Error
              </Button>
              <Button 
                onClick={() => {
                  setError(null);
                  generateInitialAnalytics();
                }}
              >
                Reset Analytics
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-slate-600 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-slate-600 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>No Analytics Data</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Start using the image learning tools to generate analytics data.</p>
            <Button 
              onClick={generateInitialAnalytics}
              className="mt-4"
            >
              Initialize Analytics
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Image Learning Analytics</h1>
        <p className="text-muted-foreground">
          Track your learning progress, identify weak areas, and get intelligent recommendations based on your performance.
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Analytics Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="time-range">Time Range</Label>
              <Select
                value={timeRange}
                onValueChange={(value: '7d' | '30d' | '90d' | 'all') => setTimeRange(value)}
                aria-label="Select time range for analytics data"
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                  <SelectItem value="90d">Last 90 Days</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="category-filter">Category</Label>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
                aria-label="Filter analytics by category"
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="signs">Signs</SelectItem>
                  <SelectItem value="controls">Controls</SelectItem>
                  <SelectItem value="scenarios">Scenarios</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="difficulty-filter">Difficulty</Label>
              <Select
                value={selectedDifficulty}
                onValueChange={(value: 'basic' | 'intermediate' | 'advanced' | 'all') => 
                  setSelectedDifficulty(value)
                }
                aria-label="Filter analytics by difficulty level"
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Difficulties</SelectItem>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Readiness Score</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.readinessScore}%</div>
            <p className="text-xs text-muted-foreground">
              Test readiness assessment
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Accuracy</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(analyticsData.averageAccuracy)}%</div>
            <p className="text-xs text-muted-foreground">
              Overall performance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Study Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(analyticsData.totalStudyTime / 60)}m</div>
            <p className="text-xs text-muted-foreground">
              Time spent learning
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Sessions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalSessions}</div>
            <p className="text-xs text-muted-foreground">
              Total learning sessions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Category Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Category Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredData?.categoryPerformance.map((cp) => (
              <div key={`${cp.category}-${cp.difficulty}`} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{cp.category}</Badge>
                    <Badge variant="outline">{cp.difficulty}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {cp.totalAttempts} attempts
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">
                      {cp.totalAttempts > 0 ? Math.round(cp.improvement * 100) : 0}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {cp.correctAttempts}/{cp.totalAttempts} correct
                    </div>
                  </div>
                </div>
                <Progress 
                  value={cp.totalAttempts > 0 ? cp.improvement * 100 : 0} 
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Personalized Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
                            {currentRecommendations.map((rec) => (
              <div key={rec.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge 
                      variant={rec.priority === 'high' ? 'destructive' : rec.priority === 'medium' ? 'default' : 'secondary'}
                    >
                      {rec.priority} priority
                    </Badge>
                    <Badge variant="outline">{rec.type}</Badge>
                  </div>
                  <h4 className="font-semibold">{rec.description}</h4>
                  <p className="text-sm text-muted-foreground">{rec.reason}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">{rec.estimatedTime} min</div>
                  <Button size="sm" className="mt-2">
                    Start
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Learning Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle>Learning Heatmap</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {['basic', 'intermediate', 'advanced'].map((difficulty) => (
              <div key={difficulty} className="space-y-2">
                <h4 className="font-semibold capitalize">{difficulty}</h4>
                <div className="grid grid-cols-3 gap-1">
                  {['signs', 'controls', 'scenarios'].map((category) => {
                    const data = heatmapData.find(h => h.category === category && h.difficulty === difficulty);
                    const accuracy = data?.accuracy || 0;
                    const intensity = Math.round(accuracy * 255);
                    
                    return (
                      <div
                        key={`${category}-${difficulty}`}
                        className="h-8 rounded text-xs flex items-center justify-center text-white"
                        style={{
                          backgroundColor: data ? `rgb(${255 - intensity}, ${intensity}, 0)` : '#e5e7eb'
                        }}
                        title={`${category} - ${difficulty}: ${Math.round(accuracy * 100)}%`}
                      >
                        {data ? Math.round(accuracy * 100) : 0}%
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-xs text-muted-foreground">
            Color intensity indicates accuracy: Green = High, Red = Low
          </div>
        </CardContent>
      </Card>

      {/* Time Spent Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Study Time Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analyticsData.timeSpent.slice(-7).map((ts) => (
              <div key={ts.date} className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{new Date(ts.date).toLocaleDateString()}</div>
                  <div className="text-sm text-muted-foreground">
                    {ts.category} - {ts.sessions} sessions
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{Math.round(ts.timeSpent / 60)}m</div>
                  <div className="text-sm text-muted-foreground">
                    {ts.imagesViewed} images
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 