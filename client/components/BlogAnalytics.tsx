import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  Eye,
  ThumbsUp,
  MessageCircle,
  Share2,
  Users,
  Clock,
  Calendar,
  BarChart3,
  Target,
  Award,
  BookOpen,
} from "lucide-react";
import { BlogPost } from "@/services/blogService";
import type { BlogAnalytics } from "@/services/blogService";

interface BlogAnalyticsProps {
  posts: BlogPost[];
  onPostClick?: (post: BlogPost) => void;
}

export function BlogAnalytics({ posts, onPostClick }: BlogAnalyticsProps) {
  const [analytics, setAnalytics] = useState<BlogAnalytics | null>(null);
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [posts, timeRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const data = await calculateAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error("Failed to load analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAnalytics = async (): Promise<BlogAnalytics> => {
    const totalViews = posts.reduce((sum, post) => sum + post.views, 0);
    const totalLikes = posts.reduce((sum, post) => sum + post.likes, 0);
    const totalPosts = posts.length;

    const popularPosts = [...posts]
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);

    const recentPosts = [...posts]
      .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime())
      .slice(0, 5);

    const categoryStats = posts.reduce((stats, post) => {
      const existing = stats.find(s => s.category === post.category);
      if (existing) {
        existing.count++;
        existing.views += post.views;
      } else {
        stats.push({
          category: post.category,
          count: 1,
          views: post.views
        });
      }
      return stats;
    }, [] as Array<{ category: string; count: number; views: number }>);

    return {
      totalViews,
      totalLikes,
      totalPosts,
      popularPosts,
      recentPosts,
      categoryStats: categoryStats.sort((a, b) => b.views - a.views)
    };
  };

  const getEngagementRate = () => {
    if (!analytics || analytics.totalViews === 0) return 0;
    return ((analytics.totalLikes / analytics.totalViews) * 100).toFixed(1);
  };

  const getAverageViewsPerPost = () => {
    if (!analytics || analytics.totalPosts === 0) return 0;
    return Math.round(analytics.totalViews / analytics.totalPosts);
  };

  const getAverageLikesPerPost = () => {
    if (!analytics || analytics.totalPosts === 0) return 0;
    return Math.round(analytics.totalLikes / analytics.totalPosts);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="bg-slate-800 border border-black">
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-slate-700 rounded mb-2"></div>
                  <div className="h-8 bg-slate-700 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <Card className="bg-slate-800 border border-black">
        <CardContent className="p-6 text-center">
          <p className="text-slate-400">No analytics data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Blog Analytics</h2>
        <div className="flex space-x-2">
          {(["7d", "30d", "90d"] as const).map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange(range)}
              className={
                timeRange === range
                  ? "bg-slate-700 text-white hover:bg-slate-600"
                  : "border-black text-slate-300 hover:bg-slate-700 hover:text-white"
              }
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-800 border border-black">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Total Views</p>
                <p className="text-2xl font-bold text-white">
                  {analytics.totalViews.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <Eye className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-slate-400">
                Avg: {getAverageViewsPerPost()} per post
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border border-black">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Total Likes</p>
                <p className="text-2xl font-bold text-white">
                  {analytics.totalLikes.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                <ThumbsUp className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-slate-400">
                Avg: {getAverageLikesPerPost()} per post
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border border-black">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Engagement Rate</p>
                <p className="text-2xl font-bold text-white">
                  {getEngagementRate()}%
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-slate-400">
                Likes per view
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border border-black">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Total Posts</p>
                <p className="text-2xl font-bold text-white">
                  {analytics.totalPosts}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-slate-400">
                Published articles
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Popular Posts */}
      <Card className="bg-slate-800 border border-black">
        <CardHeader>
          <CardTitle className="text-white text-lg flex items-center">
            <Award className="h-5 w-5 mr-2" />
            Most Popular Posts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.popularPosts.map((post, index) => (
              <div
                key={post.id}
                className="flex items-center justify-between p-4 bg-slate-700 border border-black rounded-lg hover:bg-slate-600 transition-colors cursor-pointer"
                onClick={() => onPostClick?.(post)}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-white">#{index + 1}</span>
                  </div>
                  <div>
                    <h3 className="text-white font-medium text-sm line-clamp-1">
                      {post.title}
                    </h3>
                    <div className="flex items-center space-x-4 text-xs text-slate-400 mt-1">
                      <span className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        {post.views.toLocaleString()}
                      </span>
                      <span className="flex items-center">
                        <ThumbsUp className="h-3 w-3 mr-1" />
                        {post.likes}
                      </span>
                      <Badge className="bg-slate-600 text-white text-xs">
                        {post.category}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">
                    {new Date(post.publishedDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Category Performance */}
      <Card className="bg-slate-800 border border-black">
        <CardHeader>
          <CardTitle className="text-white text-lg flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Category Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.categoryStats.map((stat) => (
              <div key={stat.category} className="flex items-center justify-between p-3 bg-slate-700 border border-black rounded">
                <div className="flex items-center space-x-3">
                  <Badge className="bg-slate-600 text-white">
                    {stat.category}
                  </Badge>
                  <span className="text-sm text-slate-300">
                    {stat.count} posts
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-white">
                    {stat.views.toLocaleString()} views
                  </p>
                  <p className="text-xs text-slate-400">
                    Avg: {Math.round(stat.views / stat.count).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="bg-slate-800 border border-black">
        <CardHeader>
          <CardTitle className="text-white text-lg flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.recentPosts.slice(0, 3).map((post) => (
              <div
                key={post.id}
                className="flex items-center justify-between p-3 bg-slate-700 border border-black rounded hover:bg-slate-600 transition-colors cursor-pointer"
                onClick={() => onPostClick?.(post)}
              >
                <div>
                  <h3 className="text-white font-medium text-sm line-clamp-1">
                    {post.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Published {new Date(post.publishedDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2 text-xs text-slate-400">
                    <span className="flex items-center">
                      <Eye className="h-3 w-3 mr-1" />
                      {post.views.toLocaleString()}
                    </span>
                    <span className="flex items-center">
                      <ThumbsUp className="h-3 w-3 mr-1" />
                      {post.likes}
                    </span>
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