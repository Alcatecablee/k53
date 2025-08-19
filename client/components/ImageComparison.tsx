import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { imageMapping, getImagesByCategory } from '@/data/imageMapping';

interface ComparisonPair {
  left: any;
  right: any;
  differences: DifferencePoint[];
  category: string;
  difficulty: 'basic' | 'intermediate' | 'advanced';
  description: string;
}

interface DifferencePoint {
  x: number;
  y: number;
  description: string;
  type: 'color' | 'shape' | 'text' | 'symbol';
  side: 'left' | 'right' | 'both';
}

export function ImageComparison() {
  const { toast } = useToast();
  const [currentPair, setCurrentPair] = useState<ComparisonPair | null>(null);
  const [showDifferences, setShowDifferences] = useState(false);
  const [mode, setMode] = useState<'study' | 'quiz'>('study');
  const [selectedCategory, setSelectedCategory] = useState<string>('signs');
  const [comparisonPairs, setComparisonPairs] = useState<ComparisonPair[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quizMode, setQuizMode] = useState<'waiting' | 'answered'>('waiting');
  const [userAnswer, setUserAnswer] = useState<'left' | 'right' | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Generate comparison pairs with improved logic
  const generateComparisonPairs = useCallback((category: string): ComparisonPair[] => {
    try {
      const images = getImagesByCategory(category as keyof typeof imageMapping);
      if (!images || images.length === 0) return [];

      const pairs: ComparisonPair[] = [];

      if (category === 'signs') {
        // Group images by sign type with better filtering
        const regulatory = images.filter(img => 
          img.context?.includes('regulatory') || 
          img.filename.includes('R') ||
          /R\d+/.test(img.filename)
        );
        const warning = images.filter(img => 
          img.context?.includes('warning') || 
          img.filename.includes('W') ||
          /W\d+/.test(img.filename)
        );
        const information = images.filter(img => 
          img.context?.includes('information') || 
          img.filename.includes('IN') ||
          /IN\d+/.test(img.filename)
        );

        // Create regulatory vs warning pairs (limit to prevent too many)
        const maxPairs = Math.min(regulatory.length, warning.length, 10);
        for (let i = 0; i < maxPairs; i++) {
          if (regulatory[i] && warning[i]) {
            pairs.push({
              left: regulatory[i],
              right: warning[i],
              differences: generateDifferences(regulatory[i], warning[i], 'regulatory-vs-warning'),
              category: 'regulatory-vs-warning',
              difficulty: 'intermediate',
              description: 'Regulatory vs Warning Signs'
            });
          }
        }

        // Create similar sign pairs (same type, different numbers)
        const similarRegulatory = findSimilarSigns(regulatory);
        similarRegulatory.slice(0, 5).forEach(pair => {
          pairs.push({
            left: pair[0],
            right: pair[1],
            differences: generateDifferences(pair[0], pair[1], 'similar-signs'),
            category: 'similar-signs',
            difficulty: 'advanced',
            description: 'Similar Regulatory Signs'
          });
        });
      }

      if (category === 'controls') {
        // Create control comparison pairs
        const primaryControls = images.filter(img => 
          img.context?.some(ctx => ['steering', 'braking', 'gear-change'].includes(ctx))
        );
        const secondaryControls = images.filter(img => 
          img.context?.some(ctx => ['signaling', 'mirrors', 'parking'].includes(ctx))
        );

        // Create primary vs secondary control pairs
        const maxControlPairs = Math.min(primaryControls.length, secondaryControls.length, 5);
        for (let i = 0; i < maxControlPairs; i++) {
          if (primaryControls[i] && secondaryControls[i]) {
            pairs.push({
              left: primaryControls[i],
              right: secondaryControls[i],
              differences: generateDifferences(primaryControls[i], secondaryControls[i], 'primary-vs-secondary'),
              category: 'primary-vs-secondary',
              difficulty: 'basic',
              description: 'Primary vs Secondary Controls'
            });
          }
        }
      }

      return pairs;
    } catch (error) {
      const errorMessage = 'Error generating comparison pairs. Please try again.';
      setError(errorMessage);
      toast({
        title: "Generation Error",
        description: errorMessage,
        variant: "destructive",
      });
      return [];
    }
  }, [toast]);

  // Find similar signs based on filename patterns
  const findSimilarSigns = useCallback((signs: any[]): any[][] => {
    try {
      const pairs: any[][] = [];
      const processed = new Set();

      for (let i = 0; i < signs.length; i++) {
        if (processed.has(i)) continue;

        const current = signs[i];
        const currentPattern = current.filename.replace(/\d+/g, '');
        
        for (let j = i + 1; j < signs.length; j++) {
          if (processed.has(j)) continue;

          const next = signs[j];
          const nextPattern = next.filename.replace(/\d+/g, '');

          if (currentPattern === nextPattern && currentPattern !== '') {
            pairs.push([current, next]);
            processed.add(i);
            processed.add(j);
            break;
          }
        }
      }

      return pairs;
    } catch (error) {
      const errorMessage = 'Error finding similar signs.';
      setError(errorMessage);
      return [];
    }
  }, []);

  // Generate differences between two images
  const generateDifferences = useCallback((left: any, right: any, type: string): DifferencePoint[] => {
    try {
      const differences: DifferencePoint[] = [];

      // Add some basic differences based on type
      if (type === 'regulatory-vs-warning') {
        differences.push(
          { x: 20, y: 30, description: 'Different sign types', type: 'shape', side: 'both' },
          { x: 80, y: 70, description: 'Different colors', type: 'color', side: 'both' }
        );
      } else if (type === 'similar-signs') {
        differences.push(
          { x: 50, y: 50, description: 'Different numbers', type: 'text', side: 'both' }
        );
      } else if (type === 'primary-vs-secondary') {
        differences.push(
          { x: 30, y: 40, description: 'Different control types', type: 'symbol', side: 'both' }
        );
      }

      return differences;
    } catch (error) {
      const errorMessage = 'Error generating differences.';
      setError(errorMessage);
      return [];
    }
  }, []);

  // Initialize comparison pairs
  useEffect(() => {
    setLoading(true);
    setError(null);
    
    try {
      const pairs = generateComparisonPairs(selectedCategory);
      setComparisonPairs(pairs);
      
      if (pairs.length > 0) {
        setCurrentPair(pairs[0]);
        setCurrentIndex(0);
      } else {
        setCurrentPair(null);
        toast({
          title: "No Comparisons Available",
          description: "No comparison pairs found for the selected category.",
          variant: "default",
        });
      }
    } catch (error) {
      const errorMessage = 'Error initializing comparison pairs.';
      setError(errorMessage);
      toast({
        title: "Initialization Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, generateComparisonPairs, toast]);

  // Handle image loading errors
  const handleImageError = useCallback((error: string) => {
    setImageError(error);
    toast({
      title: "Image Error",
      description: error,
      variant: "destructive",
    });
  }, [toast]);

  // Handle quiz answer
  const handleQuizAnswer = useCallback((answer: 'left' | 'right') => {
    if (!currentPair || quizMode === 'answered') return;

    setUserAnswer(answer);
    setQuizMode('answered');
    setScore(prev => ({
      correct: prev.correct + 1, // Simplified scoring
      total: prev.total + 1
    }));

    toast({
      title: "Answer Submitted",
      description: "Both images are important for different reasons. Review the differences below.",
      variant: "default",
    });
  }, [currentPair, quizMode, toast]);

  // Navigate to next pair
  const nextPair = useCallback(() => {
    if (currentIndex < comparisonPairs.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setCurrentPair(comparisonPairs[nextIndex]);
      setShowDifferences(false);
      setQuizMode('waiting');
      setUserAnswer(null);
      setImageError(null);
    }
  }, [currentIndex, comparisonPairs]);

  // Navigate to previous pair
  const prevPair = useCallback(() => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      setCurrentPair(comparisonPairs[prevIndex]);
      setShowDifferences(false);
      setQuizMode('waiting');
      setUserAnswer(null);
      setImageError(null);
    }
  }, [currentIndex, comparisonPairs]);

  // Reset quiz
  const resetQuiz = useCallback(() => {
    setScore({ correct: 0, total: 0 });
    setQuizMode('waiting');
    setUserAnswer(null);
    setShowDifferences(false);
  }, []);

  // Show error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 uppercase tracking-wide">Image Comparison</h2>
          <p className="text-slate-300 text-sm sm:text-base">
            Compare and analyze K53 images side by side
          </p>
        </div>
        
        <Card className="bg-slate-800 border-slate-600">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="text-red-400 text-lg font-medium">
                {error}
              </div>
              <Button 
                onClick={() => setError(null)}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 uppercase tracking-wide">Image Comparison</h2>
        <p className="text-slate-300 text-sm sm:text-base">
          Compare and analyze K53 images side by side
        </p>
      </div>

      {/* Controls */}
      <Card className="bg-slate-800 border-slate-600">
        <CardHeader>
          <CardTitle className="text-white">Comparison Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Category Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="signs">Road Signs</SelectItem>
                  <SelectItem value="controls">Vehicle Controls</SelectItem>
                  <SelectItem value="scenarios">Driving Scenarios</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Mode Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Mode</label>
              <Select value={mode} onValueChange={setMode}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="study">Study Mode</SelectItem>
                  <SelectItem value="quiz">Quiz Mode</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Quiz Reset */}
            {mode === 'quiz' && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Quiz</label>
                <Button 
                  onClick={resetQuiz}
                  variant="outline"
                  className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  Reset Quiz
                </Button>
              </div>
            )}
          </div>

          {/* Quiz Score */}
          {mode === 'quiz' && (
            <div className="text-center p-3 bg-blue-900/20 border border-blue-700/30 rounded-lg">
              <p className="text-blue-300 text-sm">
                Score: {score.correct}/{score.total} ({score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0}%)
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <Card className="bg-slate-800 border-slate-600">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-slate-300">Loading comparison pairs...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comparison Display */}
      {!loading && currentPair && (
        <Card className="bg-slate-800 border-slate-600">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-white">
                {currentPair.description}
              </CardTitle>
              <div className="flex gap-2">
                <Badge variant="outline" className="text-slate-300">
                  {currentPair.difficulty}
                </Badge>
                <Badge variant="outline" className="text-slate-300">
                  {currentIndex + 1}/{comparisonPairs.length}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Images */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Image */}
              <div className="relative">
                <div className="text-center mb-2">
                  <Badge variant="outline">Left</Badge>
                </div>
                <div className="aspect-square relative overflow-hidden rounded-lg border border-slate-600">
                  <img
                    src={currentPair.left.path}
                    alt={currentPair.left.description || currentPair.left.filename}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      handleImageError('Failed to load left image');
                    }}
                  />
                  {showDifferences && currentPair.differences
                    .filter(diff => diff.side === 'left' || diff.side === 'both')
                    .map((diff, index) => (
                      <div
                        key={`left-${index}`}
                        className="absolute w-4 h-4 bg-red-500 rounded-full cursor-pointer animate-pulse difference-marker"
                        style={{ 
                          left: `${diff.x}%`, 
                          top: `${diff.y}%`,
                          transform: 'translate(-50%, -50%)'
                        }}
                        title={diff.description}
                      />
                    ))}
                </div>
                <p className="text-slate-300 text-sm mt-2 text-center">
                  {currentPair.left.description || currentPair.left.filename}
                </p>
              </div>

              {/* Right Image */}
              <div className="relative">
                <div className="text-center mb-2">
                  <Badge variant="outline">Right</Badge>
                </div>
                <div className="aspect-square relative overflow-hidden rounded-lg border border-slate-600">
                  <img
                    src={currentPair.right.path}
                    alt={currentPair.right.description || currentPair.right.filename}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      handleImageError('Failed to load right image');
                    }}
                  />
                  {showDifferences && currentPair.differences
                    .filter(diff => diff.side === 'right' || diff.side === 'both')
                    .map((diff, index) => (
                      <div
                        key={`right-${index}`}
                        className="absolute w-4 h-4 bg-red-500 rounded-full cursor-pointer animate-pulse difference-marker"
                        style={{ 
                          left: `${diff.x}%`, 
                          top: `${diff.y}%`,
                          transform: 'translate(-50%, -50%)'
                        }}
                        title={diff.description}
                      />
                    ))}
                </div>
                <p className="text-slate-300 text-sm mt-2 text-center">
                  {currentPair.right.description || currentPair.right.filename}
                </p>
              </div>
            </div>

            {/* Quiz Mode */}
            {mode === 'quiz' && (
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-white font-medium mb-4">
                    Which image is more important for K53 learning?
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Button
                      variant={userAnswer === 'left' ? 'default' : 'outline'}
                      onClick={() => handleQuizAnswer('left')}
                      disabled={quizMode === 'answered'}
                      className="min-w-24"
                    >
                      Left
                    </Button>
                    <Button
                      variant={userAnswer === 'right' ? 'default' : 'outline'}
                      onClick={() => handleQuizAnswer('right')}
                      disabled={quizMode === 'answered'}
                      className="min-w-24"
                    >
                      Right
                    </Button>
                  </div>
                </div>

                {quizMode === 'answered' && (
                  <div className="text-center">
                    <p className="text-slate-300">
                      Both images are important for different reasons. Review the differences below.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Differences */}
            {showDifferences && (
              <div className="space-y-3">
                <h4 className="text-white font-medium">Key Differences:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentPair.differences.map((diff, index) => (
                    <div key={index} className="p-3 bg-slate-700 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`w-3 h-3 rounded-full ${
                          diff.type === 'color' ? 'bg-red-500' :
                          diff.type === 'shape' ? 'bg-blue-500' :
                          diff.type === 'text' ? 'bg-green-500' : 'bg-yellow-500'
                        }`} />
                        <span className="text-slate-300 text-sm font-medium capitalize">
                          {diff.type}
                        </span>
                      </div>
                      <p className="text-slate-400 text-sm">{diff.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Controls */}
            <div className="flex gap-4 justify-center">
              <Button
                variant="outline"
                onClick={prevPair}
                disabled={currentIndex === 0}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Previous
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setShowDifferences(!showDifferences)}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                {showDifferences ? 'Hide' : 'Show'} Differences
              </Button>
              
              <Button
                variant="outline"
                onClick={nextPair}
                disabled={currentIndex === comparisonPairs.length - 1}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Pairs Available */}
      {!loading && comparisonPairs.length === 0 && (
        <Card className="bg-slate-800 border-slate-600">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <p className="text-slate-300">
                No comparison pairs available for the selected category.
              </p>
              <Button 
                onClick={() => setSelectedCategory('signs')}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Try Road Signs
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 
