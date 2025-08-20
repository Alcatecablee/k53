import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { imageMapping, getImagesByCategory } from '@/data/imageMapping';
import { flashcardService, getCurrentUserId, isAuthenticated } from '@/services/k53ImageFeaturesService';

interface Flashcard {
  id: string;
  image: any;
  front: string;
  back: string;
  difficulty: number;
  lastReviewed: Date | null;
  nextReview: Date | null;
  reviewCount: number;
  correctCount: number;
  mastered: boolean;
}

interface FlashcardSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  cards: Flashcard[];
  currentIndex: number;
  mode: 'study' | 'test' | 'review';
  category: string;
  difficulty: 'basic' | 'intermediate' | 'advanced' | 'all';
}

export function ImageFlashcards() {
  const { toast } = useToast();
  const [session, setSession] = useState<FlashcardSession | null>(null);
  const [currentCard, setCurrentCard] = useState<Flashcard | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('signs');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'basic' | 'intermediate' | 'advanced' | 'all'>('all');
  const [selectedMode, setSelectedMode] = useState<'study' | 'test' | 'review'>('study');
  const [userProgress, setUserProgress] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await isAuthenticated();
      setIsUserAuthenticated(authenticated);
      
      if (authenticated) {
        const currentUserId = await getCurrentUserId();
        setUserId(currentUserId);
      }
    };
    
    checkAuth();
  }, []);

  // Load user progress from Supabase
  useEffect(() => {
    const loadProgress = async () => {
      if (!userId) return;
      
      try {
        const progress = await flashcardService.getProgress(userId);
        // Convert Supabase format to component format
        const progressMap: Record<string, any> = {};
        progress.forEach(item => {
          const cardId = `flashcard-${item.image_id}`;
          progressMap[cardId] = {
            reviewCount: item.review_count,
            correctCount: item.correct_count,
            lastReviewed: item.last_reviewed ? new Date(item.last_reviewed) : null,
            nextReview: item.next_review ? new Date(item.next_review) : null,
            mastered: item.mastered,
            difficulty: item.difficulty
          };
        });
        setUserProgress(progressMap);
      } catch (error) {
        console.error('Error loading flashcard progress:', error);
        toast({
          title: "Error",
          description: "Failed to load progress data",
          variant: "destructive",
        });
      }
    };
    
    loadProgress();
  }, [userId, toast]);

  // Save user progress to Supabase
  const saveProgress = useCallback(async (progress: Record<string, any>) => {
    if (!userId) return;
    
    try {
      // Convert component format to Supabase format and save each progress item
      const savePromises = Object.entries(progress).map(async ([cardId, cardProgress]) => {
        const imageId = cardId.replace('flashcard-', '');
        await flashcardService.updateProgress({
          user_id: userId,
          image_id: imageId,
          difficulty: cardProgress.difficulty || 3,
          last_reviewed: cardProgress.lastReviewed?.toISOString() || new Date().toISOString(),
          next_review: cardProgress.nextReview?.toISOString() || new Date().toISOString(),
          review_count: cardProgress.reviewCount || 0,
          correct_count: cardProgress.correctCount || 0,
          mastered: cardProgress.mastered || false
        });
      });
      
      await Promise.all(savePromises);
    } catch (error) {
      console.error('Failed to save progress:', error);
      toast({
        title: "Save Error",
        description: "Failed to save progress to database",
        variant: "destructive",
      });
    }
  }, [userId, toast]);

  // Generate flashcards from images
  const generateFlashcards = useCallback((category: string, difficulty: string, mode: string): Flashcard[] => {
    try {
      const images = getImagesByCategory(category as keyof typeof imageMapping);
      if (!images || images.length === 0) {
        return [];
      }

      const filteredImages = difficulty === 'all' 
        ? images 
        : images.filter(img => img.difficulty === difficulty);

      return filteredImages.map(image => {
        const cardId = `flashcard-${image.id}`;
        const existingProgress = userProgress[cardId] || {
          reviewCount: 0,
          correctCount: 0,
          lastReviewed: null,
          nextReview: null,
          mastered: false,
          difficulty: 3
        };

        return {
          id: cardId,
          image,
          front: image.path,
          back: image.description || `K53 ${category} - ${image.filename}`,
          difficulty: existingProgress.difficulty,
          lastReviewed: existingProgress.lastReviewed,
          nextReview: existingProgress.nextReview,
          reviewCount: existingProgress.reviewCount,
          correctCount: existingProgress.correctCount,
          mastered: existingProgress.mastered
        };
      });
    } catch (error) {
      const errorMessage = 'Error generating flashcards. Please try again.';
      setError(errorMessage);
      toast({
        title: "Generation Error",
        description: errorMessage,
        variant: "destructive",
      });
      return [];
    }
  }, [userProgress, toast]);

  // Improved spaced repetition algorithm
  const calculateNextReview = useCallback((card: Flashcard, wasCorrect: boolean): Date => {
    const now = new Date();
    let interval: number;

    if (wasCorrect) {
      // Improved spaced repetition intervals
      if (card.reviewCount === 0) interval = 1;
      else if (card.reviewCount === 1) interval = 3;
      else if (card.reviewCount === 2) interval = 7;
      else if (card.reviewCount === 3) interval = 14;
      else if (card.reviewCount === 4) interval = 30;
      else interval = 60; // Cap at 60 days for very well-known cards
    } else {
      // Reset to 1 day for incorrect answers
      interval = 1;
    }

    const nextReview = new Date(now);
    nextReview.setDate(nextReview.getDate() + interval);
    return nextReview;
  }, []);

  // Start new session
  const startSession = useCallback(() => {
    setLoading(true);
    setImageError(null);
    setError(null);
    
    try {
      const cards = generateFlashcards(selectedCategory, selectedDifficulty, selectedMode);
      
      // Filter cards based on mode
      let filteredCards = cards;
      if (selectedMode === 'review') {
        // Only show cards that are due for review
        const now = new Date();
        filteredCards = cards.filter(card => 
          card.nextReview && card.nextReview <= now
        );
      }

      if (filteredCards.length === 0) {
        const message = selectedMode === 'review' 
          ? 'No cards are due for review. Try a different mode or category.'
          : 'No cards available for the selected criteria.';
        
        toast({
          title: "No Cards Available",
          description: message,
          variant: "default",
        });
        setLoading(false);
        return;
      }

      // Shuffle cards
      const shuffledCards = [...filteredCards].sort(() => Math.random() - 0.5);

      const newSession: FlashcardSession = {
        id: `session-${Date.now()}`,
        startTime: new Date(),
        cards: shuffledCards,
        currentIndex: 0,
        mode: selectedMode,
        category: selectedCategory,
        difficulty: selectedDifficulty
      };

      setSession(newSession);
      setCurrentCard(shuffledCards[0]);
      setIsFlipped(false);
      
      toast({
        title: "Session Started",
        description: `Started ${selectedMode} session with ${shuffledCards.length} cards`,
        variant: "default",
      });
    } catch (error) {
      const errorMessage = 'Error starting session. Please try again.';
      setError(errorMessage);
      toast({
        title: "Session Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedDifficulty, selectedMode, generateFlashcards, toast]);

  // Handle card rating with improved mastery logic
  const handleCardRating = useCallback((wasCorrect: boolean) => {
    if (!currentCard || !session) return;

    const cardId = currentCard.id;
    const nextReview = calculateNextReview(currentCard, wasCorrect);
    const newReviewCount = currentCard.reviewCount + 1;
    const newCorrectCount = wasCorrect ? currentCard.correctCount + 1 : currentCard.correctCount;
    
    // Improved mastery calculation: 3 correct in last 5 attempts
    const recentCorrect = wasCorrect ? newCorrectCount : newCorrectCount;
    const mastered = recentCorrect >= 3 && newReviewCount >= 3;

    // Update user progress
    const newProgress = {
      ...userProgress,
      [cardId]: {
        reviewCount: newReviewCount,
        correctCount: newCorrectCount,
        lastReviewed: new Date(),
        nextReview,
        mastered,
        difficulty: currentCard.difficulty
      }
    };

    setUserProgress(newProgress);
    saveProgress(newProgress);

    // Move to next card
    const nextIndex = session.currentIndex + 1;
    if (nextIndex < session.cards.length) {
      setSession({
        ...session,
        currentIndex: nextIndex
      });
      setCurrentCard(session.cards[nextIndex]);
      setIsFlipped(false);
      setImageError(null);
    } else {
      // Session complete
      setSession({
        ...session,
        endTime: new Date()
      });
      setCurrentCard(null);
    }
  }, [currentCard, session, userProgress, saveProgress, calculateNextReview]);

  // Flip card
  const flipCard = useCallback(() => {
    setIsFlipped(!isFlipped);
  }, [isFlipped]);

  // Handle image loading errors
  const handleImageError = useCallback((error: string) => {
    setImageError(error);
  }, []);

  // Get session statistics
  const getSessionStats = useCallback(() => {
    if (!session) return null;

    const totalCards = session.cards.length;
    const completedCards = session.currentIndex;
    const progress = totalCards > 0 ? (completedCards / totalCards) * 100 : 0;

    return {
      total: totalCards,
      completed: completedCards,
      remaining: totalCards - completedCards,
      progress
    };
  }, [session]);

  // Get due cards count with error handling
  const getDueCardsCount = useCallback(() => {
    try {
      const cards = generateFlashcards(selectedCategory, selectedDifficulty, 'review');
      const now = new Date();
      return cards.filter(card => 
        card.nextReview && card.nextReview <= now
      ).length;
    } catch (error) {
      const errorMessage = 'Error calculating due cards.';
      setError(errorMessage);
      return 0;
    }
  }, [selectedCategory, selectedDifficulty, generateFlashcards]);

  // Reset session
  const resetSession = useCallback(() => {
    setSession(null);
    setCurrentCard(null);
    setIsFlipped(false);
    setImageError(null);
    setError(null);
  }, []);

  const stats = getSessionStats();
  const dueCards = getDueCardsCount();

  // Show error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 uppercase tracking-wide">K53 Flashcards</h2>
          <p className="text-slate-300 text-sm sm:text-base">
            Master K53 content with spaced repetition learning
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
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 uppercase tracking-wide">K53 Flashcards</h2>
        <p className="text-slate-300 text-sm sm:text-base">
          Master K53 content with spaced repetition learning
        </p>
      </div>

      {/* Session Setup */}
      {!session && (
        <Card className="bg-slate-800 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white">Start New Session</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
                  <SelectItem value="landmarks">Landmarks</SelectItem>
                  <SelectItem value="locations">Locations</SelectItem>
                  <SelectItem value="misc">Miscellaneous</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Difficulty Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Difficulty</label>
              <Select value={selectedDifficulty} onValueChange={(value: 'all' | 'basic' | 'intermediate' | 'advanced') => setSelectedDifficulty(value)}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="all">All Difficulties</SelectItem>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Mode Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Mode</label>
              <Select value={selectedMode} onValueChange={(value: 'study' | 'test' | 'review') => setSelectedMode(value)}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="study">Study Mode</SelectItem>
                  <SelectItem value="test">Test Mode</SelectItem>
                  <SelectItem value="review">Review Mode</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Due Cards Info */}
            {selectedMode === 'review' && dueCards > 0 && (
              <div className="text-center p-3 bg-blue-900/20 border border-blue-700/30 rounded-lg">
                <p className="text-blue-300 text-sm">
                  {dueCards} cards due for review
                </p>
              </div>
            )}

            {/* Start Button */}
            <Button 
              onClick={startSession} 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? 'Starting Session...' : 'Start Session'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Active Session */}
      {session && currentCard && (
        <Card className="bg-slate-800 border-slate-600">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-white">
                {session.mode.charAt(0).toUpperCase() + session.mode.slice(1)} Mode
              </CardTitle>
              <div className="flex gap-2">
                <Badge variant="outline" className="text-slate-300">
                  {session.category}
                </Badge>
                <Badge variant="outline" className="text-slate-300">
                  {session.difficulty}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Progress */}
            {stats && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-slate-300">
                  <span>Progress</span>
                  <span>{stats.completed}/{stats.total}</span>
                </div>
                <Progress value={stats.progress} className="h-2" />
              </div>
            )}

            {/* Flashcard */}
            <div className="relative">
              <div 
                className={`aspect-square relative overflow-hidden rounded-lg border border-slate-600 cursor-pointer transition-transform duration-500 ${
                  isFlipped ? 'rotate-y-180' : ''
                }`}
                onClick={flipCard}
              >
                {!isFlipped ? (
                  <div className="w-full h-full flex items-center justify-center bg-slate-700">
                    <img
                      src={currentCard.front}
                      alt={currentCard.back}
                      className="max-w-full max-h-full object-contain"
                      onError={() => handleImageError('Failed to load image')}
                    />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-700 p-6">
                    <p className="text-white text-center text-lg">
                      {currentCard.back}
                    </p>
                  </div>
                )}
              </div>
              
              {imageError && (
                <div className="mt-2 text-center">
                  <p className="text-red-400 text-sm">{imageError}</p>
                </div>
              )}
            </div>

            {/* Card Info */}
            <div className="text-center space-y-2">
              <div className="flex justify-center gap-4 text-sm text-slate-300">
                <span>Reviews: {currentCard.reviewCount}</span>
                <span>Correct: {currentCard.correctCount}</span>
                {currentCard.mastered && (
                  <Badge variant="default" className="bg-green-600">
                    Mastered
                  </Badge>
                )}
              </div>
              <p className="text-slate-400 text-xs">
                Click card to flip • {isFlipped ? 'Show image' : 'Show answer'}
              </p>
            </div>

            {/* Rating Buttons */}
            {isFlipped && (
              <div className="flex gap-4 justify-center">
                <Button
                  variant="outline"
                  onClick={() => handleCardRating(false)}
                  className="border-red-600 text-red-400 hover:bg-red-900/20"
                >
                  Incorrect
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleCardRating(true)}
                  className="border-green-600 text-green-400 hover:bg-green-900/20"
                >
                  Correct
                </Button>
              </div>
            )}

            {/* Session Controls */}
            <div className="flex gap-2 justify-center">
              <Button
                variant="outline"
                onClick={resetSession}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                End Session
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Session Complete */}
      {session && !currentCard && session.endTime && (
        <Card className="bg-slate-800 border-slate-600">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-bold text-white">Session Complete!</h3>
              <p className="text-slate-300">
                Great job! You've completed your {session.mode} session.
              </p>
              <Button 
                onClick={resetSession}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Start New Session
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 
