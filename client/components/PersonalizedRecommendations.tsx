import React, { useState, useEffect } from "react";
import { 
  Target, 
  Clock, 
  TrendingUp, 
  BookOpen, 
  Settings, 
  Zap,
  Star,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Lightbulb
} from "lucide-react";
import { 
  generatePersonalizedRecommendations, 
  type PersonalizedRecommendation 
} from "@/services/achievementService";
import { getUserProgress, calculatePerformanceStats } from "@/services/achievementService";

interface PersonalizedRecommendationsProps {
  userAnswers?: { correct: boolean; category: string; responseTime: number }[];
  className?: string;
  isPremium?: boolean;
}

const getRecommendationIcon = (type: PersonalizedRecommendation['type']) => {
  switch (type) {
    case "daily_goal":
      return Target;
    case "focus_area":
      return TrendingUp;
    case "study_plan":
      return BookOpen;
    case "difficulty_adjustment":
      return Settings;
    case "time_optimization":
      return Clock;
    case "motivation":
      return Star;
    default:
      return Lightbulb;
  }
};

const getPriorityColor = (priority: PersonalizedRecommendation['priority']) => {
  switch (priority) {
    case "high":
      return "border-l-orange-500 bg-orange-900/20";
    case "medium":
      return "border-l-blue-500 bg-blue-900/20";
    case "low":
      return "border-l-green-500 bg-green-900/20";
    default:
      return "border-l-slate-500 bg-slate-700";
  }
};

const getConfidenceColor = (confidence: number) => {
  if (confidence >= 80) return "text-green-600";
  if (confidence >= 60) return "text-orange-600";
  return "text-red-600";
};

export default function PersonalizedRecommendations({ 
  userAnswers = [], 
  className = "", 
  isPremium = false 
}: PersonalizedRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<PersonalizedRecommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isPremium) {
      setLoading(false);
      return;
    }

    try {
      const progress = getUserProgress();
      if (!progress) {
        setRecommendations([]);
        return;
      }
      
      const stats = userAnswers.length > 0 
        ? calculatePerformanceStats(userAnswers)
        : { accuracy: 0, weakCategories: [], averageResponseTime: 0, correctAnswers: 0, totalAnswers: 0, strongCategories: [] };
      
      const personalizedRecs = generatePersonalizedRecommendations(progress, stats);
      setRecommendations(personalizedRecs || []);
    } catch (error) {
      console.error("Error generating recommendations:", error);
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  }, [userAnswers, isPremium]);

  if (!isPremium) {
    return (
      <div className={`bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">Personalized Recommendations</h3>
          <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
            Premium Feature
          </div>
        </div>
        <div className="text-center py-8">
          <Star className="h-12 w-12 text-purple-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-white mb-2">
            Unlock AI-Powered Study Recommendations
          </h4>
          <p className="text-slate-300 mb-4">
            Get personalized study plans, difficulty adjustments, and time optimization tips based on your performance.
          </p>
          <a 
            href="/pricing" 
            className="inline-flex items-center bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Upgrade to Premium
            <ArrowRight className="h-4 w-4 ml-2" />
          </a>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="bg-slate-800 border border-slate-600 rounded-lg p-6">
          <div className="h-6 bg-slate-600 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-slate-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className={`bg-slate-800 border border-slate-600 rounded-lg p-6 ${className}`}>
        <div className="text-center py-8">
          <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-white mb-2">
            Great Progress!
          </h4>
          <p className="text-slate-300">
            Complete more scenarios to receive personalized recommendations.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg ${className}`}>
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">Personalized Recommendations</h3>
          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            AI-Powered
          </div>
        </div>
        <p className="text-slate-300 mt-2">
          Based on your performance and learning patterns
        </p>
      </div>
      
      <div className="p-6 space-y-4">
        {recommendations.map((recommendation, index) => {
          const IconComponent = getRecommendationIcon(recommendation.type);
          
          return (
            <div 
              key={index}
              className={`border-l-4 p-4 rounded-r-lg ${getPriorityColor(recommendation.priority)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <IconComponent className="h-5 w-5 text-slate-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-white">{recommendation.title}</h4>
                      <span className={`text-xs font-medium ${getConfidenceColor(recommendation.confidence)}`}>
                        {recommendation.confidence}% confidence
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mb-2">{recommendation.description}</p>
                    
                    {recommendation.estimatedTime && (
                      <div className="flex items-center text-xs text-slate-500 mb-2">
                        <Clock className="h-3 w-3 mr-1" />
                        Estimated time: {recommendation.estimatedTime} minutes
                      </div>
                    )}
                    
                    {recommendation.actionable && recommendation.actionText && (
                      <a 
                        href={recommendation.actionUrl || "#"}
                        className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        {recommendation.actionText}
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </a>
                    )}
                  </div>
                </div>
                
                <div className="flex-shrink-0">
                  <div className={`w-2 h-2 rounded-full ${
                    recommendation.priority === "high" ? "bg-orange-500" :
                    recommendation.priority === "medium" ? "bg-blue-500" : "bg-green-500"
                  }`}></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center text-xs text-slate-500">
          <Lightbulb className="h-3 w-3 mr-1" />
          Recommendations update based on your performance and study patterns
        </div>
      </div>
    </div>
  );
} 
