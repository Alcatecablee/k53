import React, { useState, useEffect, useMemo, useCallback } from "react";
import { 
  Trophy, 
  Target, 
  MapPin, 
  Flame, 
  Zap, 
  Gamepad2, 
  TrafficCone, 
  Clipboard, 
  Dice1,
  Award,
  Star,
  Share2,
  Clock,
  History,
  Calendar
} from "lucide-react";
import type { Achievement, UserProgress, AchievementHistory } from "@/types";
import { 
  getUserProgress, 
  getDefaultProgress, 
  shareAchievement,
  getAchievementHistory,
  addAchievementHistory
} from "@/services/achievementService";
import AchievementNotifications from "./AchievementNotifications";


interface AchievementsProps {
  showUnlockedOnly?: boolean;
  className?: string;
  showNotifications?: boolean;
  showHistory?: boolean;
}

// Error Boundary Component
class AchievementsErrorBoundary extends React.Component<
  { children: React.ReactNode; className?: string },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode; className?: string }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Achievements component error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={`text-center py-8 ${this.props.className || ''}`}>
          <div className="bg-slate-800 border border-slate-600 rounded-lg p-6 max-w-md mx-auto">
            <Trophy className="h-12 w-12 mx-auto mb-4 text-slate-400" />
            <h3 className="text-lg font-semibold text-white mb-2">Achievements Unavailable</h3>
            <p className="text-slate-300 mb-4">
              There was an error loading achievements. Please try refreshing the page.
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="bg-slate-600 text-white hover:bg-slate-500 px-4 py-2 rounded font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const getAchievementIcon = (category: string) => {
  switch (category) {
    case "scenarios":
      return <Target className="h-5 w-5" />;
    case "location":
      return <MapPin className="h-5 w-5" />;
    case "streak":
      return <Flame className="h-5 w-5" />;
    case "mastery":
      return <Trophy className="h-5 w-5" />;
    default:
      return <Trophy className="h-5 w-5" />;
  }
};

const getCategoryIcon = (achievementId: string) => {
  switch (achievementId) {
    case "controls_expert":
      return <Gamepad2 className="h-4 w-4" />;
    case "signs_expert":
      return <TrafficCone className="h-4 w-4" />;
    case "rules_expert":
      return <Clipboard className="h-4 w-4" />;
    case "mixed_expert":
      return <Dice1 className="h-4 w-4" />;
    default:
      return <Trophy className="h-4 w-4" />;
  }
};

// Memoized Achievement Card Component
const AchievementCard = React.memo(({ 
  achievement, 
  onShare, 
  onClick, 
  sharingAchievement,
  formatTimestamp 
}: {
  achievement: Achievement;
  onShare: (achievement: Achievement) => void;
  onClick: (achievement: Achievement) => void;
  sharingAchievement: string | null;
  formatTimestamp: (timestamp: string) => string;
}) => (
  <div
    id={`achievement-${achievement.id}`}
    className={`p-4 rounded-lg border transition-all duration-200 ${
      achievement.unlocked
        ? "bg-slate-700 border-slate-600 shadow-md"
        : "bg-slate-800 border-slate-600 opacity-60"
    }`}
    role="article"
    aria-label={`Achievement: ${achievement.title}`}
    onClick={() => onClick(achievement)}
  >
    <div className="flex items-start justify-between mb-2">
      <div className="flex items-center gap-2">
        {getAchievementIcon(achievement.category)}
        {achievement.category === "mastery" && getCategoryIcon(achievement.id)}
      </div>
      <div className="text-xs text-slate-400">
        {achievement.progress} / {achievement.requirement}
      </div>
    </div>
    
    <h4 className={`font-semibold mb-1 ${
      achievement.unlocked ? "text-white" : "text-slate-300"
    }`}>
      {achievement.title}
    </h4>
    
    <p className={`text-sm mb-3 ${
      achievement.unlocked ? "text-slate-200" : "text-slate-400"
    }`}>
      {achievement.description}
    </p>

    {/* Progress Bar */}
    <div className="w-full bg-slate-700 rounded-full h-1.5 mb-2">
      <div
        className={`h-1.5 rounded-full transition-all duration-300 w-dynamic ${
          achievement.unlocked
            ? "bg-white"
            : "bg-slate-500"
        }`}
        style={{
          width: `${Math.min((achievement.progress / achievement.requirement) * 100, 100)}%`,
        }}
        role="progressbar"
        aria-valuenow={achievement.progress}
        aria-valuemin={0}
        aria-valuemax={achievement.requirement}
        aria-label={`Progress: ${achievement.progress} of ${achievement.requirement}`}
      ></div>
    </div>

    {achievement.unlocked && (
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-white">
          <Trophy className="h-3 w-3" />
          Unlocked
          {achievement.unlockedAt && (
            <span className="text-slate-400 ml-2">
              {formatTimestamp(achievement.unlockedAt)}
            </span>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onShare(achievement);
          }}
          disabled={sharingAchievement === achievement.id}
          className="p-1 text-slate-400 hover:text-white hover:bg-slate-600 rounded transition-colors disabled:opacity-50"
          aria-label={`Share achievement: ${achievement.title}`}
        >
          {sharingAchievement === achievement.id ? (
            <div className="h-3 w-3 animate-spin rounded-full border border-slate-400 border-t-white"></div>
          ) : (
            <Share2 className="h-3 w-3" />
          )}
        </button>
      </div>
    )}
  </div>
));

AchievementCard.displayName = 'AchievementCard';

function AchievementsComponent({ 
  showUnlockedOnly = false, 
  className = "",
  showNotifications = true,
  showHistory = true
}: AchievementsProps) {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [achievementHistory, setAchievementHistory] = useState<AchievementHistory[]>([]);
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);
  const [sharingAchievement, setSharingAchievement] = useState<string | null>(null);

  useEffect(() => {
    const loadProgress = async () => {
      try {
        setLoading(true);
        setError(null);
        const userProgress = getUserProgress();
        const history = getAchievementHistory();
        setProgress(userProgress);
        setAchievementHistory(history);
      } catch (error) {
        console.error("Failed to load achievement progress:", error);
        setError("Failed to load achievements. Please try refreshing the page.");
        // Fallback to default progress if there's an error
        setProgress(getDefaultProgress());
      } finally {
        setLoading(false);
      }
    };

    loadProgress();
  }, []);

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-slate-700 h-24 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="bg-slate-800 border border-slate-600 rounded-lg p-6 max-w-md mx-auto">
          <Trophy className="h-12 w-12 mx-auto mb-4 text-slate-400" />
          <h3 className="text-lg font-semibold text-white mb-2">Unable to Load Achievements</h3>
          <p className="text-slate-300 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-slate-600 text-white hover:bg-slate-500 px-4 py-2 rounded font-medium"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  if (!progress) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="bg-slate-800 border border-slate-600 rounded-lg p-6 max-w-md mx-auto">
          <Trophy className="h-12 w-12 mx-auto mb-4 text-slate-400" />
          <h3 className="text-lg font-semibold text-white mb-2">No Progress Data</h3>
          <p className="text-slate-300">Start practicing to unlock achievements!</p>
        </div>
      </div>
    );
  }

  const filteredAchievements = useMemo(() => {
    return progress.achievements.filter((achievement) => {
      if (showUnlockedOnly && !achievement.unlocked) return false;
      if (selectedCategory !== "all" && achievement.category !== selectedCategory) return false;
      return true;
    });
  }, [progress.achievements, showUnlockedOnly, selectedCategory]);

  const unlockedCount = useMemo(() => 
    progress.achievements.filter((a) => a.unlocked).length, 
    [progress.achievements]
  );
  const totalCount = progress.achievements.length;

  const categories = useMemo(() => [
    { id: "all", name: "All", count: progress.achievements.length },
    { id: "scenarios", name: "Scenarios", count: progress.achievements.filter((a) => a.category === "scenarios").length },
    { id: "location", name: "Location", count: progress.achievements.filter((a) => a.category === "location").length },
    { id: "streak", name: "Streaks", count: progress.achievements.filter((a) => a.category === "streak").length },
    { id: "mastery", name: "Mastery", count: progress.achievements.filter((a) => a.category === "mastery").length },
  ], [progress.achievements]);

  const handleCategorySelect = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);
  }, []);

  const handleShareAchievement = useCallback(async (achievement: Achievement) => {
    setSharingAchievement(achievement.id);
    try {
      const success = await shareAchievement(achievement);
      if (success) {
        // Refresh history after sharing
        const updatedHistory = getAchievementHistory();
        setAchievementHistory(updatedHistory);
        
        // Show success feedback
        const event = new CustomEvent('showToast', {
          detail: {
            type: 'success',
            message: 'Achievement shared successfully!'
          }
        });
        window.dispatchEvent(event);
      } else {
        // Show error feedback
        const event = new CustomEvent('showToast', {
          detail: {
            type: 'error',
            message: 'Failed to share achievement. Please try again.'
          }
        });
        window.dispatchEvent(event);
      }
    } catch (error) {
      console.error('Error sharing achievement:', error);
      // Show error feedback
      const event = new CustomEvent('showToast', {
        detail: {
          type: 'error',
          message: 'Failed to share achievement. Please try again.'
        }
      });
      window.dispatchEvent(event);
    } finally {
      setSharingAchievement(null);
    }
  }, []);

  const handleAchievementClick = useCallback((achievement: Achievement) => {
    addAchievementHistory(achievement.id, "viewed", {
      progress: achievement.progress,
      requirement: achievement.requirement,
      category: achievement.category,
    });
  }, []);

  const formatTimestamp = useCallback((timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  }, []);

  const groupedHistory = useMemo(() => {
    const grouped = achievementHistory.reduce((acc, entry) => {
      const date = new Date(entry.timestamp).toDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(entry);
      return acc;
    }, {} as Record<string, AchievementHistory[]>);

    return Object.entries(grouped)
      .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
      .slice(0, 10); // Show last 10 days
  }, [achievementHistory]);

  return (
    <div className={className}>
      {/* Header with Actions */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Achievements</h2>
        <div className="flex items-center space-x-2">
          {showHistory && (
            <button
              onClick={() => setShowHistoryPanel(!showHistoryPanel)}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-900"
              aria-label="Toggle achievement history"
            >
              <History className="h-5 w-5" />
            </button>
          )}
          {showNotifications && (
            <AchievementNotifications 
              onNotificationClick={(notification) => {
                // Scroll to the achievement if it exists
                const achievementElement = document.getElementById(`achievement-${notification.achievementId}`);
                if (achievementElement) {
                  achievementElement.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            />
          )}
        </div>
      </div>

      {/* Progress Summary */}
      <div className="mb-6 p-4 bg-slate-800 rounded-lg border border-slate-600">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-white">Your Progress</h3>
          <div className="text-sm text-slate-300">
            {unlockedCount} / {totalCount} Achievements
          </div>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2">
          <div
            className="bg-white h-2 rounded-full transition-all duration-300 w-dynamic"
            style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
          ></div>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{progress.totalScenariosCompleted}</div>
            <div className="text-xs text-slate-300">Scenarios Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{progress.currentStreak}</div>
            <div className="text-xs text-slate-300">Current Streak</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{progress.longestStreak}</div>
            <div className="text-xs text-slate-300">Longest Streak</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {Math.round((unlockedCount / totalCount) * 100)}%
            </div>
            <div className="text-xs text-slate-300">Completion</div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-4" role="tablist" aria-label="Achievement categories">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategorySelect(category.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCategorySelect(category.id);
                }
              }}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-900 ${
                selectedCategory === category.id
                  ? "bg-slate-600 text-white"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
              aria-label={`Filter achievements by ${category.name}`}
              aria-pressed={selectedCategory === category.id}
              role="tab"
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>
      </div>

      {/* History Panel */}
      {showHistoryPanel && (
        <div className="mb-6 p-4 bg-slate-800 rounded-lg border border-slate-600">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Achievement History
            </h3>
            <button
              onClick={() => setShowHistoryPanel(false)}
              className="text-slate-400 hover:text-white"
              aria-label="Close history panel"
            >
              ×
            </button>
          </div>
          
          {groupedHistory.length === 0 ? (
            <p className="text-slate-400 text-center py-4">No activity yet</p>
          ) : (
            <div className="space-y-4">
              {groupedHistory.map(([date, entries]) => (
                <div key={date}>
                  <h4 className="text-sm font-medium text-slate-300 mb-2">
                    {new Date(date).toLocaleDateString()}
                  </h4>
                  <div className="space-y-2">
                    {entries.slice(0, 5).map((entry, index) => (
                      <div key={`${entry.achievementId}-${entry.timestamp}-${index}`} className="flex items-center space-x-3 text-sm">
                        <div className="flex-shrink-0">
                          {entry.action === "unlocked" && <Trophy className="h-4 w-4 text-white" />}
                          {entry.action === "shared" && <Share2 className="h-4 w-4 text-white" />}
                          {entry.action === "viewed" && <Clock className="h-4 w-4 text-slate-400" />}
                        </div>
                        <div className="flex-1">
                          <span className="text-slate-300">
                            {entry.action === "unlocked" && "Unlocked achievement"}
                            {entry.action === "shared" && "Shared achievement"}
                            {entry.action === "viewed" && "Viewed achievement"}
                          </span>
                        </div>
                        <span className="text-xs text-slate-400">
                          {formatTimestamp(entry.timestamp)}
                        </span>
                      </div>
                    ))}
                    {entries.length > 5 && (
                      <p className="text-xs text-slate-400">
                        +{entries.length - 5} more activities
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAchievements.map((achievement) => (
          <AchievementCard
            key={achievement.id}
            achievement={achievement}
            onShare={handleShareAchievement}
            onClick={handleAchievementClick}
            sharingAchievement={sharingAchievement}
            formatTimestamp={formatTimestamp}
          />
        ))}
      </div>

      {filteredAchievements.length === 0 && (
        <div className="text-center py-8 text-slate-400">
          <Trophy className="h-12 w-12 mx-auto mb-4 text-slate-500" />
          <p>No achievements found for this category.</p>
        </div>
      )}
    </div>
  );
}



// Export with error boundary wrapper
export default function Achievements(props: AchievementsProps) {
  return (
    <AchievementsErrorBoundary className={props.className}>
      <AchievementsComponent {...props} />
    </AchievementsErrorBoundary>
  );
} 
