import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { imageMapping, getImagesByCategory } from '@/data/imageMapping';

interface ScenarioImage {
  id: string;
  image: any;
  order: number;
  description: string;
  action?: string;
  delay?: number;
  context?: string[];
}

interface DecisionPoint {
  id: string;
  scenarioImageId: string;
  question: string;
  options: {
    id: string;
    text: string;
    nextImageId?: string;
    feedback: string;
    correct: boolean;
  }[];
}

interface Scenario {
  id: string;
  title: string;
  description: string;
  images: ScenarioImage[];
  decisionPoints: DecisionPoint[];
  difficulty: 'basic' | 'intermediate' | 'advanced';
  category: string;
  estimatedTime: number;
  tags: string[];
}

interface ScenarioSession {
  id: string;
  scenario: Scenario;
  currentImageIndex: number;
  currentDecisionPoint?: DecisionPoint;
  userChoices: Record<string, string>;
  startTime: Date;
  endTime?: Date;
  completed: boolean;
}

export function ScenarioBuilder() {
  const { toast } = useToast();
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);
  const [session, setSession] = useState<ScenarioSession | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('scenarios');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'basic' | 'intermediate' | 'advanced' | 'all'>('all');
  const [builderMode, setBuilderMode] = useState<'create' | 'edit' | 'play'>('create');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDecisionDialog, setShowDecisionDialog] = useState(false);
  const [selectedImageForDecision, setSelectedImageForDecision] = useState<string | null>(null);
  const [decisionQuestion, setDecisionQuestion] = useState('');

  // Load saved scenarios from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('k53-scenarios');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setScenarios(parsed);
      } catch (error) {
        const errorMessage = 'Error loading saved scenarios. Data has been reset.';
        setError(errorMessage);
        toast({
          title: "Data Error",
          description: errorMessage,
          variant: "destructive",
        });
        localStorage.removeItem('k53-scenarios');
      }
    }
  }, [toast]);

  // Save scenarios to localStorage
  const saveScenarios = useCallback((scenarioList: Scenario[]) => {
    try {
      localStorage.setItem('k53-scenarios', JSON.stringify(scenarioList));
    } catch (error) {
      const errorMessage = 'Failed to save scenarios. Please check your browser storage.';
      setError(errorMessage);
      toast({
        title: "Save Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [toast]);

  // Generate scenario templates
  const generateScenarioTemplates = useCallback((): Scenario[] => {
    const templates: Scenario[] = [
      {
        id: 'template-urban-driving',
        title: 'Urban Driving Sequence',
        description: 'Navigate through city traffic with multiple decision points',
        images: [],
        decisionPoints: [],
        difficulty: 'intermediate',
        category: 'urban',
        estimatedTime: 5,
        tags: ['urban', 'traffic', 'intersections']
      },
      {
        id: 'template-highway-driving',
        title: 'Highway Driving Sequence',
        description: 'High-speed driving with lane changes and overtaking',
        images: [],
        decisionPoints: [],
        difficulty: 'advanced',
        category: 'highway',
        estimatedTime: 8,
        tags: ['highway', 'overtaking', 'speed']
      },
      {
        id: 'template-emergency-response',
        title: 'Emergency Response Sequence',
        description: 'Handle emergency situations and vehicle breakdowns',
        images: [],
        decisionPoints: [],
        difficulty: 'advanced',
        category: 'emergency',
        estimatedTime: 6,
        tags: ['emergency', 'breakdown', 'safety']
      },
      {
        id: 'template-parking-scenarios',
        title: 'Parking Scenarios',
        description: 'Various parking situations and techniques',
        images: [],
        decisionPoints: [],
        difficulty: 'basic',
        category: 'parking',
        estimatedTime: 4,
        tags: ['parking', 'maneuvering', 'spatial-awareness']
      }
    ];
    return templates;
  }, []);

  // Create new scenario from template
  const createScenarioFromTemplate = useCallback((template: Scenario) => {
    const newScenario: Scenario = {
      ...template,
      id: `scenario-${Date.now()}`,
      images: [],
      decisionPoints: []
    };
    
    setCurrentScenario(newScenario);
    setBuilderMode('edit');
    
    toast({
      title: "Scenario Created",
      description: `New scenario "${newScenario.title}" created from template.`,
    });
  }, [toast]);

  // Add image to scenario
  const addImageToScenario = useCallback((image: any, description: string, order: number) => {
    if (!currentScenario) return;

    const scenarioImage: ScenarioImage = {
      id: `img-${Date.now()}`,
      image: image.path || image, // Store the path or the image object
      order,
      description: description || image.description,
      context: image.context || []
    };

    const updatedScenario = {
      ...currentScenario,
      images: [...currentScenario.images, scenarioImage].sort((a, b) => a.order - b.order)
    };

    setCurrentScenario(updatedScenario);
    
    toast({
      title: "Image Added",
      description: `Image added to scenario at position ${order}.`,
    });
  }, [currentScenario, toast]);

  // Add decision point to scenario
  const addDecisionPoint = useCallback((imageId: string, question: string, options: DecisionPoint['options']) => {
    if (!currentScenario) return;

    const decisionPoint: DecisionPoint = {
      id: `dp-${Date.now()}`,
      scenarioImageId: imageId,
      question,
      options
    };

    const updatedScenario = {
      ...currentScenario,
      decisionPoints: [...currentScenario.decisionPoints, decisionPoint]
    };

    setCurrentScenario(updatedScenario);
    
    toast({
      title: "Decision Point Added",
      description: "Decision point added to scenario.",
    });
  }, [currentScenario, toast]);

  // Save scenario
  const saveScenario = useCallback(() => {
    if (!currentScenario) return;

    setLoading(true);
    try {
      const updatedScenarios = scenarios.filter(s => s.id !== currentScenario.id);
      const newScenarios = [...updatedScenarios, currentScenario];
      
      setScenarios(newScenarios);
      saveScenarios(newScenarios);
      
      toast({
        title: "Scenario Saved",
        description: `Scenario "${currentScenario.title}" saved successfully.`,
      });
      
      setCurrentScenario(null);
      setBuilderMode('create');
    } catch (error) {
      const errorMessage = 'Failed to save scenario. Please try again.';
      setError(errorMessage);
      toast({
        title: "Save Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [currentScenario, scenarios, saveScenarios, toast]);

  // Start scenario session
  const startScenarioSession = useCallback((scenario: Scenario) => {
    const session: ScenarioSession = {
      id: `session-${Date.now()}`,
      scenario,
      currentImageIndex: 0,
      userChoices: {},
      startTime: new Date(),
      completed: false
    };

    setSession(session);
    setBuilderMode('play');
    
    toast({
      title: "Scenario Started",
      description: `Scenario "${scenario.title}" started.`,
    });
  }, [toast]);

  // Handle user choice at decision point
  const handleUserChoice = useCallback((choiceId: string) => {
    if (!session || !session.currentDecisionPoint) return;

    const choice = session.currentDecisionPoint.options.find(opt => opt.id === choiceId);
    if (!choice) return;

    const updatedSession = {
      ...session,
      userChoices: {
        ...session.userChoices,
        [session.currentDecisionPoint.id]: choiceId
      }
    };

    // Show feedback
    toast({
      title: choice.correct ? "Correct!" : "Incorrect",
      description: choice.feedback,
      variant: choice.correct ? "default" : "destructive",
    });

    // Move to next image if specified
    if (choice.nextImageId) {
      const nextImageIndex = updatedSession.scenario.images.findIndex(
        img => img.id === choice.nextImageId
      );
      if (nextImageIndex !== -1) {
        updatedSession.currentImageIndex = nextImageIndex;
        updatedSession.currentDecisionPoint = undefined;
      }
    } else {
      // Move to next image in sequence
      updatedSession.currentImageIndex += 1;
      updatedSession.currentDecisionPoint = undefined;
    }

    setSession(updatedSession);
  }, [session, toast]);

  // Filter scenarios by category and difficulty
  const filteredScenarios = scenarios.filter(scenario => {
    const categoryMatch = selectedCategory === 'all' || scenario.category === selectedCategory;
    const difficultyMatch = selectedDifficulty === 'all' || scenario.difficulty === selectedDifficulty;
    return categoryMatch && difficultyMatch;
  });

  // Get available images for scenario building
  const availableImages = getImagesByCategory(selectedCategory as keyof typeof imageMapping);

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
        <h1 className="text-3xl font-bold">Scenario Builder</h1>
        <p className="text-muted-foreground">
          Create interactive driving scenarios with multiple decision points and branching paths.
        </p>
      </div>

      {/* Mode Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Scenario Builder Mode</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Button
              variant={builderMode === 'create' ? 'default' : 'outline'}
              onClick={() => setBuilderMode('create')}
            >
              Create New
            </Button>
            <Button
              variant={builderMode === 'edit' ? 'default' : 'outline'}
              onClick={() => setBuilderMode('edit')}
              disabled={!currentScenario}
            >
              Edit Current
            </Button>
            <Button
              variant={builderMode === 'play' ? 'default' : 'outline'}
              onClick={() => setBuilderMode('play')}
            >
              Play Scenarios
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Create Mode */}
      {builderMode === 'create' && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Scenario</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Choose Template</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {generateScenarioTemplates().map((template) => (
                  <Card key={template.id} className="cursor-pointer hover:bg-muted/50">
                    <CardContent className="p-4">
                      <h4 className="font-semibold">{template.title}</h4>
                      <p className="text-sm text-muted-foreground mt-2">{template.description}</p>
                      <div className="flex items-center space-x-2 mt-3">
                        <Badge variant="outline">{template.difficulty}</Badge>
                        <Badge variant="outline">{template.category}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {template.estimatedTime} min
                        </span>
                      </div>
                      <Button
                        onClick={() => createScenarioFromTemplate(template)}
                        className="mt-3 w-full"
                      >
                        Use Template
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Mode */}
      {builderMode === 'edit' && currentScenario && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Edit Scenario: {currentScenario.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="scenario-title">Title</Label>
                  <Input
                    id="scenario-title"
                    value={currentScenario.title}
                    onChange={(e) => setCurrentScenario({
                      ...currentScenario,
                      title: e.target.value
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="scenario-description">Description</Label>
                  <Textarea
                    id="scenario-description"
                    value={currentScenario.description}
                    onChange={(e) => setCurrentScenario({
                      ...currentScenario,
                      description: e.target.value
                    })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="scenario-difficulty">Difficulty</Label>
                    <Select
                      value={currentScenario.difficulty}
                      onValueChange={(value: 'basic' | 'intermediate' | 'advanced') => 
                        setCurrentScenario({
                          ...currentScenario,
                          difficulty: value
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">Basic</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="scenario-time">Estimated Time (minutes)</Label>
                    <Input
                      id="scenario-time"
                      type="number"
                      value={currentScenario.estimatedTime}
                      onChange={(e) => setCurrentScenario({
                        ...currentScenario,
                        estimatedTime: parseInt(e.target.value) || 5
                      })}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Image Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Add Images to Scenario</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="image-category">Image Category</Label>
                    <Select
                      value={selectedCategory}
                      onValueChange={setSelectedCategory}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="scenarios">Scenarios</SelectItem>
                        <SelectItem value="signs">Signs</SelectItem>
                        <SelectItem value="controls">Controls</SelectItem>
                        <SelectItem value="rules">Rules</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="image-difficulty">Difficulty</Label>
                    <Select
                      value={selectedDifficulty}
                      onValueChange={(value: 'basic' | 'intermediate' | 'advanced' | 'all') => 
                        setSelectedDifficulty(value)
                      }
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

                {/* Available Images Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-h-96 overflow-y-auto">
                  {availableImages.slice(0, 24).map((image, index) => (
                    <div
                      key={image.id}
                      className="cursor-pointer border rounded-lg p-2 hover:bg-muted/50"
                      onClick={() => addImageToScenario(
                        image,
                        image.description,
                        currentScenario.images.length + 1
                      )}
                    >
                      <img
                        src={image.path}
                        alt={image.description}
                        className="w-full h-20 object-cover rounded"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.svg';
                        }}
                      />
                      <p className="text-xs mt-1 line-clamp-2">{image.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Scenario Images */}
          {currentScenario.images.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Scenario Images ({currentScenario.images.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentScenario.images.map((scenarioImage, index) => (
                    <div key={scenarioImage.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="flex-shrink-0">
                        <img
                          src={scenarioImage.image}
                          alt={scenarioImage.description}
                          className="w-16 h-16 object-cover rounded"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder.svg';
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">#{scenarioImage.order}</Badge>
                          <h4 className="font-medium">{scenarioImage.description}</h4>
                        </div>
                        {scenarioImage.action && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Action: {scenarioImage.action}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedImageForDecision(scenarioImage.id);
                          setShowDecisionDialog(true);
                        }}
                      >
                        Add Decision
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Save Button */}
          <div className="flex justify-end space-x-4">
            <Button
              variant="outline"
              onClick={() => {
                setCurrentScenario(null);
                setBuilderMode('create');
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={saveScenario}
              disabled={loading || currentScenario.images.length === 0}
            >
              {loading ? 'Saving...' : 'Save Scenario'}
            </Button>
          </div>
        </div>
      )}

      {/* Play Mode */}
      {builderMode === 'play' && (
        <div className="space-y-6">
          {/* Scenario Selection */}
          {!session && (
            <Card>
              <CardHeader>
                <CardTitle>Select Scenario to Play</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="play-category">Category</Label>
                      <Select
                        value={selectedCategory}
                        onValueChange={setSelectedCategory}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          <SelectItem value="urban">Urban</SelectItem>
                          <SelectItem value="highway">Highway</SelectItem>
                          <SelectItem value="emergency">Emergency</SelectItem>
                          <SelectItem value="parking">Parking</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="play-difficulty">Difficulty</Label>
                      <Select
                        value={selectedDifficulty}
                        onValueChange={(value: 'basic' | 'intermediate' | 'advanced' | 'all') => 
                          setSelectedDifficulty(value)
                        }
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

                  {filteredScenarios.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No scenarios found. Create some scenarios first.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredScenarios.map((scenario) => (
                        <Card key={scenario.id} className="cursor-pointer hover:bg-muted/50">
                          <CardContent className="p-4">
                            <h4 className="font-semibold">{scenario.title}</h4>
                            <p className="text-sm text-muted-foreground mt-2">{scenario.description}</p>
                            <div className="flex items-center space-x-2 mt-3">
                              <Badge variant="outline">{scenario.difficulty}</Badge>
                              <Badge variant="outline">{scenario.category}</Badge>
                              <span className="text-sm text-muted-foreground">
                                {scenario.images.length} images
                              </span>
                            </div>
                            <Button
                              onClick={() => startScenarioSession(scenario)}
                              className="mt-3 w-full"
                            >
                              Start Scenario
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Active Session */}
          {session && (
            <Card>
              <CardHeader>
                <CardTitle>Playing: {session.scenario.title}</CardTitle>
                <div className="flex items-center space-x-4">
                  <Progress 
                    value={(session.currentImageIndex / session.scenario.images.length) * 100} 
                    className="flex-1"
                  />
                  <span className="text-sm text-muted-foreground">
                    {session.currentImageIndex + 1} / {session.scenario.images.length}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                {session.currentImageIndex < session.scenario.images.length ? (
                  <div className="space-y-4">
                    {/* Current Image */}
                    <div className="text-center">
                      <img
                        src={session.scenario.images[session.currentImageIndex].image}
                        alt={session.scenario.images[session.currentImageIndex].description}
                        className="mx-auto max-w-full max-h-96 object-contain rounded-lg"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.svg';
                        }}
                      />
                      <p className="mt-4 text-lg font-medium">
                        {session.scenario.images[session.currentImageIndex].description}
                      </p>
                    </div>

                    {/* Decision Point */}
                    {session.currentDecisionPoint && (
                      <div className="space-y-4">
                        <Separator />
                        <h3 className="text-lg font-semibold">Decision Point</h3>
                        <p className="text-muted-foreground">{session.currentDecisionPoint.question}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {session.currentDecisionPoint.options.map((option) => (
                            <Button
                              key={option.id}
                              variant="outline"
                              className="h-auto p-4 text-left"
                              onClick={() => handleUserChoice(option.id)}
                            >
                              {option.text}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Navigation */}
                    <div className="flex justify-between">
                      <Button
                        variant="outline"
                        onClick={() => {
                          if (session.currentImageIndex > 0) {
                            setSession({
                              ...session,
                              currentImageIndex: session.currentImageIndex - 1,
                              currentDecisionPoint: undefined
                            });
                          }
                        }}
                        disabled={session.currentImageIndex === 0}
                      >
                        Previous
                      </Button>
                      <Button
                        onClick={() => {
                          if (session.currentImageIndex < session.scenario.images.length - 1) {
                            setSession({
                              ...session,
                              currentImageIndex: session.currentImageIndex + 1,
                              currentDecisionPoint: undefined
                            });
                          } else {
                            // Scenario completed
                            setSession({
                              ...session,
                              endTime: new Date(),
                              completed: true
                            });
                          }
                        }}
                      >
                        {session.currentImageIndex < session.scenario.images.length - 1 ? 'Next' : 'Complete'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <h3 className="text-xl font-semibold mb-4">Scenario Completed!</h3>
                    <p className="text-muted-foreground mb-4">
                      You have completed the scenario. Review your choices and learn from the experience.
                    </p>
                    <Button
                      onClick={() => {
                        setSession(null);
                        setBuilderMode('play');
                      }}
                    >
                      Play Another Scenario
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Decision Point Dialog */}
      <Dialog open={showDecisionDialog} onOpenChange={setShowDecisionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Decision Point</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="decision-question">Question</Label>
              <Textarea
                id="decision-question"
                value={decisionQuestion}
                onChange={(e) => setDecisionQuestion(e.target.value)}
                placeholder="Enter the decision question..."
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDecisionDialog(false);
                  setDecisionQuestion('');
                  setSelectedImageForDecision(null);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (decisionQuestion.trim() && selectedImageForDecision) {
                    const options = [
                      { id: 'opt1', text: 'Option 1', feedback: 'Feedback 1', correct: true },
                      { id: 'opt2', text: 'Option 2', feedback: 'Feedback 2', correct: false }
                    ];
                    addDecisionPoint(selectedImageForDecision, decisionQuestion.trim(), options);
                    setShowDecisionDialog(false);
                    setDecisionQuestion('');
                    setSelectedImageForDecision(null);
                  }
                }}
                disabled={!decisionQuestion.trim()}
              >
                Add Decision Point
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 