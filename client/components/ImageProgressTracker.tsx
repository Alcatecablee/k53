import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { imageMapping, getImagesByCategory } from '@/data/imageMapping';

interface ImageProgress {
  category: string;
  total: number;
  viewed: number;
  mastered: number;
  lastViewed?: Date;
  accuracy: number;
}

interface UserProgress {
  [category: string]: {
    [imageId: string]: {
      viewed: boolean;
      mastered: boolean;
      lastViewed: Date;
      attempts: number;
      correctAttempts: number;
    };
  };
}

export function ImageProgressTracker() {
  const [userProgress, setUserProgress] = useState<UserProgress>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [progressData, setProgressData] = useState<ImageProgress[]>([]);

  useEffect(() => {
    loadUserProgress();
  }, []);

  useEffect(() => {
    calculateProgress();
  }, [userProgress, selectedCategory]);

  const loadUserProgress = () => {
    const saved = localStorage.getItem('k53-image-progress');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Convert date strings back to Date objects
        Object.keys(parsed).forEach(category => {
          Object.keys(parsed[category]).forEach(imageId => {
            if (parsed[category][imageId].lastViewed) {
              parsed[category][imageId].lastViewed = new Date(parsed[category][imageId].lastViewed);
            }
          });
        });
        setUserProgress(parsed);
      } catch (error) {
        console.error('Error loading progress:', error);
      }
    }
  };

  const saveUserProgress = (progress: UserProgress) => {
    localStorage.setItem('k53-image-progress', JSON.stringify(progress));
  };

  const markImageViewed = (category: string, imageId: string) => {
    const newProgress = { ...userProgress };
    if (!newProgress[category]) {
      newProgress[category] = {};
    }
    if (!newProgress[category][imageId]) {
      newProgress[category][imageId] = {
        viewed: false,
        mastered: false,
        lastViewed: new Date(),
        attempts: 0,
        correctAttempts: 0
      };
    }
    newProgress[category][imageId].viewed = true;
    newProgress[category][imageId].lastViewed = new Date();
    setUserProgress(newProgress);
    saveUserProgress(newProgress);
  };

  const markImageMastered = (category: string, imageId: string, correct: boolean) => {
    const newProgress = { ...userProgress };
    if (!newProgress[category]) {
      newProgress[category] = {};
    }
    if (!newProgress[category][imageId]) {
      newProgress[category][imageId] = {
        viewed: true,
        mastered: false,
        lastViewed: new Date(),
        attempts: 0,
        correctAttempts: 0
      };
    }
    
    newProgress[category][imageId].attempts += 1;
    if (correct) {
      newProgress[category][imageId].correctAttempts += 1;
    }
    
    // Mark as mastered if 3 correct attempts in a row
    if (newProgress[category][imageId].correctAttempts >= 3) {
      newProgress[category][imageId].mastered = true;
    }
    
    newProgress[category][imageId].lastViewed = new Date();
    setUserProgress(newProgress);
    saveUserProgress(newProgress);
  };

  const calculateProgress = () => {
    const categories = selectedCategory === 'all' 
      ? Object.keys(imageMapping) 
      : [selectedCategory];
    
    const progress: ImageProgress[] = categories.map(category => {
      const images = getImagesByCategory(category as keyof typeof imageMapping);
      const categoryProgress = userProgress[category] || {};
      
      let viewed = 0;
      let mastered = 0;
      let totalAccuracy = 0;
      let accuracyCount = 0;
      
      images.forEach(image => {
        const imageProgress = categoryProgress[image.id];
        if (imageProgress) {
          if (imageProgress.viewed) viewed++;
          if (imageProgress.mastered) mastered++;
          if (imageProgress.attempts > 0) {
            totalAccuracy += imageProgress.correctAttempts / imageProgress.attempts;
            accuracyCount++;
          }
        }
      });
      
      return {
        category,
        total: images.length,
        viewed,
        mastered,
        accuracy: accuracyCount > 0 ? Math.round((totalAccuracy / accuracyCount) * 100) : 0
      };
    });
    
    setProgressData(progress);
  };

  const getOverallProgress = () => {
    const total = progressData.reduce((sum, p) => sum + p.total, 0);
    const viewed = progressData.reduce((sum, p) => sum + p.viewed, 0);
    const mastered = progressData.reduce((sum, p) => sum + p.mastered, 0);
    const avgAccuracy = progressData.length > 0 
      ? Math.round(progressData.reduce((sum, p) => sum + p.accuracy, 0) / progressData.length)
      : 0;
    
    return { total, viewed, mastered, avgAccuracy };
  };

  const resetProgress = () => {
    if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      setUserProgress({});
      localStorage.removeItem('k53-image-progress');
    }
  };

  const overall = getOverallProgress();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Image Learning Progress</h2>
          <p className="text-slate-300">Track your progress through K53 images</p>
        </div>
        <Button variant="outline" onClick={resetProgress}>
          Reset Progress
        </Button>
      </div>

      {/* Overall Progress */}
      <Card className="bg-slate-800 border-slate-600">
        <CardHeader>
          <CardTitle className="text-white">Overall Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{overall.total}</p>
              <p className="text-slate-300 text-sm">Total Images</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-400">{overall.viewed}</p>
              <p className="text-slate-300 text-sm">Viewed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">{overall.mastered}</p>
              <p className="text-slate-300 text-sm">Mastered</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-400">{overall.avgAccuracy}%</p>
              <p className="text-slate-300 text-sm">Avg Accuracy</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-300">Overall Progress</span>
              <span className="text-slate-300">{Math.round((overall.viewed / overall.total) * 100)}%</span>
            </div>
            <Progress value={(overall.viewed / overall.total) * 100} className="w-full" />
          </div>
        </CardContent>
      </Card>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === 'all' ? 'default' : 'outline'}
          onClick={() => setSelectedCategory('all')}
        >
          All Categories
        </Button>
        {Object.keys(imageMapping).map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(category)}
            className="capitalize"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Category Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {progressData.map((progress) => (
          <Card key={progress.category} className="bg-slate-800 border-slate-600">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white capitalize">{progress.category}</CardTitle>
                <Badge variant="outline">{progress.accuracy}% accuracy</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-lg font-bold text-white">{progress.total}</p>
                  <p className="text-slate-300 text-xs">Total</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-blue-400">{progress.viewed}</p>
                  <p className="text-slate-300 text-xs">Viewed</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-green-400">{progress.mastered}</p>
                  <p className="text-slate-300 text-xs">Mastered</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">Progress</span>
                  <span className="text-slate-300">
                    {Math.round((progress.viewed / progress.total) * 100)}%
                  </span>
                </div>
                <Progress value={(progress.viewed / progress.total) * 100} className="w-full" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">Mastery</span>
                  <span className="text-slate-300">
                    {Math.round((progress.mastered / progress.total) * 100)}%
                  </span>
                </div>
                <Progress 
                  value={(progress.mastered / progress.total) * 100} 
                  className="w-full bg-slate-700"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card className="bg-slate-800 border-slate-600">
        <CardHeader>
          <CardTitle className="text-white">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(userProgress)
              .flatMap(([category, images]) => 
                Object.entries(images)
                  .map(([imageId, progress]) => ({
                    category,
                    imageId,
                    ...progress
                  }))
              )
              .sort((a, b) => new Date(b.lastViewed).getTime() - new Date(a.lastViewed).getTime())
              .slice(0, 10)
              .map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-slate-700 rounded">
                  <div>
                    <p className="text-white text-sm capitalize">{activity.category}</p>
                    <p className="text-slate-300 text-xs">{activity.imageId}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {activity.mastered && (
                      <Badge variant="default" className="text-xs">Mastered</Badge>
                    )}
                    <span className="text-slate-400 text-xs">
                      {new Date(activity.lastViewed).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
