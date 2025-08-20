import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { imageMapping, getImagesByCategory } from '@/data/imageMapping';
import { 
  Target, 
  Clock, 
  Award, 
  TrendingUp, 
  Brain, 
  Lightbulb,
  Map,
  Flag,
  CheckCircle,
  Circle,
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  Settings,
  BookOpen,
  Zap,
  Star
} from 'lucide-react';

interface LearningObjective {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'basic' | 'intermediate' | 'advanced';
  estimatedTime: number;
  completed: boolean;
  progress: number;
  prerequisites: string[];
  skills: string[];
}

interface LearningPath {
  id: string;
  title: string;
  description: string;
  objectives: LearningObjective[];
  totalTime: number;
  completedTime: number;
  progress: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  adaptive: boolean;
  createdAt: Date;
  lastAccessed: Date;
  status: 'active' | 'paused' | 'completed';
}

interface PerformanceGap {
  category: string;
  difficulty: string;
  currentLevel: number;
  targetLevel: number;
  gap: number;
  priority: 'high' | 'medium' | 'low';
  recommendedActions: string[];
}

interface IntelligentRecommendation {
  id: string;
  type: 'difficulty_adjustment' | 'content_suggestion' | 'review_reminder' | 'mastery_check';
  title: string;
  description: string;
  action: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  difficulty: string;
}

export function PersonalizedLearningPaths() {
  const { toast } = useToast();
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [currentPath, setCurrentPath] = useState<LearningPath | null>(null);
  const [performanceGaps, setPerformanceGaps] = useState<PerformanceGap[]>([]);
  const [recommendations, setRecommendations] = useState<IntelligentRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pathMode, setPathMode] = useState<'create' | 'browse' | 'active'>('browse');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');

  // Load learning paths from localStorage
  useEffect(() => {
    const loadLearningPaths = () => {
      setLoading(true);
      try {
        const saved = localStorage.getItem('k53-learning-paths');
        if (saved) {
          const parsed = JSON.parse(saved);
          // Convert date strings back to Date objects
          parsed.forEach((path: LearningPath) => {
            if (path.createdAt) path.createdAt = new Date(path.createdAt);
            if (path.lastAccessed) path.lastAccessed = new Date(path.lastAccessed);
          });
          setLearningPaths(parsed);
        } else {
          // Generate default learning paths
          generateDefaultPaths();
        }
      } catch (error) {
        const errorMessage = 'Error loading learning paths. Data has been reset.';
        setError(errorMessage);
        toast({
          title: "Data Error",
          description: errorMessage,
          variant: "destructive",
        });
        localStorage.removeItem('k53-learning-paths');
        generateDefaultPaths();
      } finally {
        setLoading(false);
      }
    };

    loadLearningPaths();
  }, [toast]);

  // Save learning paths to localStorage
  const saveLearningPaths = useCallback((paths: LearningPath[]) => {
    try {
      localStorage.setItem('k53-learning-paths', JSON.stringify(paths));
    } catch (error) {
      const errorMessage = 'Failed to save learning paths. Please check your browser storage.';
      setError(errorMessage);
      toast({
        title: "Save Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [toast]);

  // Generate default learning paths
  const generateDefaultPaths = useCallback(() => {
    const defaultPaths: LearningPath[] = [
      {
        id: 'path-beginner-signs',
        title: 'Road Signs Mastery - Beginner',
        description: 'Master essential road signs for safe driving',
        objectives: [
          {
            id: 'obj-1',
            title: 'Learn Basic Warning Signs',
            description: 'Understand common warning signs and their meanings',
            category: 'signs',
            difficulty: 'basic',
            estimatedTime: 20,
            completed: false,
            progress: 0,
            prerequisites: [],
            skills: ['sign-recognition', 'warning-understanding']
          },
          {
            id: 'obj-2',
            title: 'Master Regulatory Signs',
            description: 'Learn mandatory and prohibitory signs',
            category: 'signs',
            difficulty: 'basic',
            estimatedTime: 25,
            completed: false,
            progress: 0,
            prerequisites: ['obj-1'],
            skills: ['regulatory-understanding', 'compliance']
          },
          {
            id: 'obj-3',
            title: 'Information Signs',
            description: 'Understand informational and directional signs',
            category: 'signs',
            difficulty: 'basic',
            estimatedTime: 15,
            completed: false,
            progress: 0,
            prerequisites: ['obj-1', 'obj-2'],
            skills: ['information-processing', 'navigation']
          }
        ],
        totalTime: 60,
        completedTime: 0,
        progress: 0,
        difficulty: 'beginner',
        category: 'signs',
        adaptive: true,
        createdAt: new Date(),
        lastAccessed: new Date(),
        status: 'active'
      },
      {
        id: 'path-intermediate-controls',
        title: 'Vehicle Controls - Intermediate',
        description: 'Advanced vehicle control techniques and understanding',
        objectives: [
          {
            id: 'obj-4',
            title: 'Advanced Control Systems',
            description: 'Master complex vehicle control systems',
            category: 'controls',
            difficulty: 'intermediate',
            estimatedTime: 30,
            completed: false,
            progress: 0,
            prerequisites: [],
            skills: ['system-understanding', 'control-mastery']
          },
          {
            id: 'obj-5',
            title: 'Emergency Procedures',
            description: 'Learn emergency control procedures',
            category: 'controls',
            difficulty: 'intermediate',
            estimatedTime: 25,
            completed: false,
            progress: 0,
            prerequisites: ['obj-4'],
            skills: ['emergency-response', 'quick-thinking']
          }
        ],
        totalTime: 55,
        completedTime: 0,
        progress: 0,
        difficulty: 'intermediate',
        category: 'controls',
        adaptive: true,
        createdAt: new Date(),
        lastAccessed: new Date(),
        status: 'active'
      },
      {
        id: 'path-advanced-scenarios',
        title: 'Complex Driving Scenarios - Advanced',
        description: 'Master complex real-world driving situations',
        objectives: [
          {
            id: 'obj-6',
            title: 'Multi-lane Traffic',
            description: 'Navigate complex multi-lane traffic situations',
            category: 'scenarios',
            difficulty: 'advanced',
            estimatedTime: 35,
            completed: false,
            progress: 0,
            prerequisites: [],
            skills: ['traffic-analysis', 'lane-management']
          },
          {
            id: 'obj-7',
            title: 'Emergency Situations',
            description: 'Handle emergency driving scenarios',
            category: 'scenarios',
            difficulty: 'advanced',
            estimatedTime: 40,
            completed: false,
            progress: 0,
            prerequisites: ['obj-6'],
            skills: ['emergency-handling', 'decision-making']
          }
        ],
        totalTime: 75,
        completedTime: 0,
        progress: 0,
        difficulty: 'advanced',
        category: 'scenarios',
        adaptive: true,
        createdAt: new Date(),
        lastAccessed: new Date(),
        status: 'active'
      }
    ];

    setLearningPaths(defaultPaths);
    saveLearningPaths(defaultPaths);
  }, [saveLearningPaths]);

  // Analyze performance gaps using real data
  const analyzePerformanceGaps = useCallback(() => {
    const gaps: PerformanceGap[] = [];
    const categories = ['signs', 'controls', 'scenarios'];
    const difficulties = ['basic', 'intermediate', 'advanced'];

    // Get real analytics data
    const analyticsData = localStorage.getItem('k53-image-analytics');
    let parsedAnalytics = null;
    
    try {
      if (analyticsData) {
        parsedAnalytics = JSON.parse(analyticsData);
      }
    } catch (error) {
      console.warn('Failed to parse analytics data for gap analysis');
    }

    categories.forEach(category => {
      difficulties.forEach(difficulty => {
        const images = getImagesByCategory(category as keyof typeof imageMapping);
        const categoryImages = images.filter(img => img.difficulty === difficulty);
        const totalImages = categoryImages.length;
        
        // Get real current level from analytics data
        let currentLevel = 0;
        if (parsedAnalytics?.categoryPerformance) {
          const performance = parsedAnalytics.categoryPerformance.find(
            (cp: any) => cp.category === category && cp.difficulty === difficulty
          );
          if (performance && performance.totalAttempts > 0) {
            currentLevel = (performance.correctAttempts / performance.totalAttempts) * 100;
          }
        }
        
        const targetLevel = 80; // Target 80% mastery
        const gap = Math.max(0, targetLevel - currentLevel);
        
        if (gap > 10) { // Only show significant gaps
          gaps.push({
            category,
            difficulty,
            currentLevel: Math.round(currentLevel),
            targetLevel,
            gap: Math.round(gap),
            priority: gap > 30 ? 'high' : gap > 15 ? 'medium' : 'low',
            recommendedActions: [
              `Focus on ${category} - ${difficulty} level`,
              `Complete practice exercises`,
              `Review missed concepts`
            ]
          });
        }
      });
    });

    setPerformanceGaps(gaps.sort((a, b) => b.gap - a.gap));
  }, []);

  // Generate intelligent recommendations
  const generateRecommendations = useCallback(() => {
    const recs: IntelligentRecommendation[] = [];

    // Analyze current path progress
    if (currentPath) {
      const incompleteObjectives = currentPath.objectives.filter(obj => !obj.completed);
      
      if (incompleteObjectives.length > 0) {
        const nextObjective = incompleteObjectives[0];
        recs.push({
          id: 'rec-next',
          type: 'content_suggestion',
          title: 'Continue Learning Path',
          description: `Next objective: ${nextObjective.title}`,
          action: 'Continue',
          priority: 'high',
          category: nextObjective.category,
          difficulty: nextObjective.difficulty
        });
      }
    }

    // Add performance gap recommendations
    performanceGaps.slice(0, 3).forEach(gap => {
      recs.push({
        id: `rec-gap-${gap.category}-${gap.difficulty}`,
        type: 'difficulty_adjustment',
        title: 'Address Skill Gap',
        description: `Focus on ${gap.category} - ${gap.difficulty} (${gap.gap}% gap)`,
        action: 'Practice',
        priority: gap.priority,
        category: gap.category,
        difficulty: gap.difficulty
      });
    });

    // Add review recommendations
    if (currentPath && currentPath.progress > 50) {
      recs.push({
        id: 'rec-review',
        type: 'review_reminder',
        title: 'Review Completed Objectives',
        description: 'Reinforce learned concepts',
        action: 'Review',
        priority: 'medium',
        category: 'all',
        difficulty: 'all'
      });
    }

    setRecommendations(recs);
  }, [currentPath, performanceGaps]);

  // Update path progress
  const updatePathProgress = useCallback((pathId: string, objectiveId: string, progress: number) => {
    const updatedPaths = learningPaths.map(path => {
      if (path.id === pathId) {
        const updatedObjectives = path.objectives.map(obj => {
          if (obj.id === objectiveId) {
            const updatedProgress = Math.min(100, obj.progress + progress);
            return {
              ...obj,
              progress: updatedProgress,
              completed: updatedProgress >= 100
            };
          }
          return obj;
        });

        const totalProgress = updatedObjectives.reduce((sum, obj) => sum + obj.progress, 0) / updatedObjectives.length;
        const completedTime = updatedObjectives.reduce((sum, obj) => 
          sum + (obj.completed ? obj.estimatedTime : 0), 0
        );

        return {
          ...path,
          objectives: updatedObjectives,
          progress: totalProgress,
          completedTime,
          lastAccessed: new Date()
        };
      }
      return path;
    });

    setLearningPaths(updatedPaths);
    saveLearningPaths(updatedPaths);
  }, [learningPaths, saveLearningPaths]);

  // Create custom learning path
  const createCustomPath = useCallback((pathData: {
    title: string;
    description: string;
    difficulty: string;
    category: string;
    objectives: string[];
  }) => {
    const newPath: LearningPath = {
      id: `path-custom-${Date.now()}`,
      title: pathData.title,
      description: pathData.description,
      objectives: pathData.objectives.map((obj, index) => ({
        id: `obj-custom-${index}`,
        title: obj,
        description: `Custom objective: ${obj}`,
        category: pathData.category,
        difficulty: pathData.difficulty as 'basic' | 'intermediate' | 'advanced',
        estimatedTime: 20,
        completed: false,
        progress: 0,
        prerequisites: [],
        skills: ['custom-learning']
      })),
      totalTime: pathData.objectives.length * 20,
      completedTime: 0,
      progress: 0,
      difficulty: pathData.difficulty as 'beginner' | 'intermediate' | 'advanced',
      category: pathData.category,
      adaptive: true,
      createdAt: new Date(),
      lastAccessed: new Date(),
      status: 'active'
    };

    const updatedPaths = [...learningPaths, newPath];
    setLearningPaths(updatedPaths);
    saveLearningPaths(updatedPaths);
    
    toast({
      title: "Learning Path Created",
      description: `Custom path "${pathData.title}" created successfully.`,
    });
  }, [learningPaths, saveLearningPaths, toast]);

  // Load performance gaps and recommendations
  useEffect(() => {
    analyzePerformanceGaps();
  }, [analyzePerformanceGaps]);

  useEffect(() => {
    generateRecommendations();
  }, [generateRecommendations]);

  if (error) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">{error}</p>
            <Button 
              onClick={() => setError(null)}
              className="mt-4"
            >
              Dismiss Error
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
        <h1 className="text-3xl font-bold">Personalized Learning Paths</h1>
        <p className="text-muted-foreground">
          Intelligent learning paths tailored to your progress and skill gaps using performance analytics.
        </p>
      </div>

      {/* Mode Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Learning Path Mode</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Button
              variant={pathMode === 'browse' ? 'default' : 'outline'}
              onClick={() => setPathMode('browse')}
            >
              Browse Paths
            </Button>
            <Button
              variant={pathMode === 'create' ? 'default' : 'outline'}
              onClick={() => setPathMode('create')}
            >
              Create Custom Path
            </Button>
            <Button
              variant={pathMode === 'active' ? 'default' : 'outline'}
              onClick={() => setPathMode('active')}
            >
              Active Paths
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Browse Mode */}
      {pathMode === 'browse' && (
        <div className="space-y-6">
          {/* Skill Gaps Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Gap Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performanceGaps.slice(0, 5).map((gap) => (
                  <div key={`${gap.category}-${gap.difficulty}`} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="outline">{gap.category}</Badge>
                        <Badge variant="outline">{gap.difficulty}</Badge>
                        <Badge 
                          variant={gap.priority === 'high' ? 'destructive' : gap.priority === 'medium' ? 'default' : 'secondary'}
                        >
                          {gap.priority} priority
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div>
                          <div className="text-sm text-muted-foreground">Current Level</div>
                          <div className="font-semibold">{gap.currentLevel}%</div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="text-sm text-muted-foreground">Target Level</div>
                          <div className="font-semibold">{gap.targetLevel}%</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Gap</div>
                          <div className="font-semibold text-red-600">{gap.gap}%</div>
                        </div>
                      </div>
                    </div>
                    <Button size="sm">
                      Create Path
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Available Learning Paths */}
          <Card>
            <CardHeader>
              <CardTitle>Available Learning Paths</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {learningPaths.map((path) => (
                  <Card key={path.id} className="cursor-pointer hover:bg-slate-700/50">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{path.difficulty}</Badge>
                        <Badge variant="outline">{path.category}</Badge>
                      </div>
                      <CardTitle className="text-lg">{path.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{path.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span>{Math.round(path.progress)}%</span>
                          </div>
                          <Progress value={path.progress} className="h-2" />
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>{path.objectives.length} objectives</span>
                          <span>{path.totalTime} min</span>
                        </div>
                        <Button 
                          onClick={() => {
                            setCurrentPath(path);
                            setPathMode('active');
                          }}
                          className="w-full"
                        >
                          {path.status === 'active' ? 'Continue' : 'Start Path'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Create Mode */}
      {pathMode === 'create' && (
        <Card>
          <CardHeader>
            <CardTitle>Create Custom Learning Path</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="path-title">Path Title</Label>
                <Input
                  id="path-title"
                  placeholder="Enter learning path title"
                />
              </div>
              <div>
                <Label htmlFor="path-description">Description</Label>
                <Textarea
                  id="path-description"
                  placeholder="Describe your learning objectives"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="path-difficulty">Difficulty</Label>
                  <Select
                    value={selectedDifficulty}
                    onValueChange={(value: 'beginner' | 'intermediate' | 'advanced') => 
                      setSelectedDifficulty(value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="path-category">Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="signs">Road Signs</SelectItem>
                      <SelectItem value="controls">Vehicle Controls</SelectItem>
                      <SelectItem value="scenarios">Driving Scenarios</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button className="w-full">
                Create Learning Path
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Path Mode */}
      {pathMode === 'active' && currentPath && (
        <div className="space-y-6">
          {/* Current Path Header */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{currentPath.title}</CardTitle>
                  <p className="text-muted-foreground">{currentPath.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{Math.round(currentPath.progress)}%</div>
                  <div className="text-sm text-muted-foreground">Complete</div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Badge variant="outline">{currentPath.difficulty}</Badge>
                <Badge variant="outline">{currentPath.category}</Badge>
                <Badge variant="outline">{currentPath.objectives.length} objectives</Badge>
                <Badge variant="outline">{currentPath.totalTime} min</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Progress value={currentPath.progress} className="h-4" />
            </CardContent>
          </Card>

          {/* Learning Objectives */}
          <Card>
            <CardHeader>
              <CardTitle>Learning Objectives</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentPath.objectives.map((objective) => (
                  <div key={objective.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="flex-shrink-0">
                      {objective.completed ? (
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      ) : (
                        <Circle className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold">{objective.title}</h4>
                        <Badge variant="outline">{objective.difficulty}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{objective.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>{objective.estimatedTime} min</span>
                        <span>{objective.skills.join(', ')}</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="text-right mb-2">
                        <div className="text-sm text-muted-foreground">Progress</div>
                        <div className="font-semibold">{Math.round(objective.progress)}%</div>
                      </div>
                      <Progress value={objective.progress} className="h-2 w-20" />
                    </div>
                    <Button
                      size="sm"
                      onClick={() => updatePathProgress(currentPath.id, objective.id, 25)}
                      disabled={objective.completed}
                    >
                      {objective.completed ? 'Completed' : 'Practice'}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Adaptive Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Intelligent Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendations.map((rec) => (
                  <div key={rec.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge 
                          variant={rec.priority === 'high' ? 'destructive' : rec.priority === 'medium' ? 'default' : 'secondary'}
                        >
                          {rec.priority} priority
                        </Badge>
                        <Badge variant="outline">{rec.type.replace('_', ' ')}</Badge>
                      </div>
                      <h4 className="font-semibold">{rec.title}</h4>
                      <p className="text-sm text-muted-foreground">{rec.description}</p>
                    </div>
                    <Button size="sm">
                      {rec.action}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
} 