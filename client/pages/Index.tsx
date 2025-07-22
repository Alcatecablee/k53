import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Trophy,
  Flame,
  Star,
  Target,
  Zap,
  BookOpen,
  Users,
  Award,
  Car,
  Shield,
  MapPin,
  Crown,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Index() {
  // Mock user data (will be replaced with real data from Supabase)
  const mockUser = {
    streak: 7,
    level: 12,
    xp: 2450,
    nextLevelXp: 3000,
    completedLessons: 23,
    totalLessons: 64,
  };

  const achievements = [
    { id: 1, icon: Trophy, title: "First Test", description: "Complete your first practice test", earned: true },
    { id: 2, icon: Flame, title: "7 Day Streak", description: "Practice for 7 days in a row", earned: true },
    { id: 3, icon: Star, title: "Perfect Score", description: "Get 100% on a practice test", earned: false },
    { id: 4, icon: Crown, title: "K53 Master", description: "Pass 10 full tests in a row", earned: false },
  ];

  const categories = [
    {
      id: "controls",
      title: "Vehicle Controls",
      icon: Car,
      color: "bg-blue-500",
      progress: 80,
      lessons: "8/8",
      description: "Master your vehicle controls",
    },
    {
      id: "signs",
      title: "Road Signs",
      icon: Shield,
      color: "bg-green-500",
      progress: 65,
      lessons: "18/28",
      description: "Learn all road signs",
    },
    {
      id: "rules",
      title: "Traffic Rules",
      icon: BookOpen,
      color: "bg-purple-500",
      progress: 45,
      lessons: "12/28",
      description: "Know the rules of the road",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50 border-b-2 border-gray-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-primary text-primary-foreground rounded-2xl p-3 shadow-lg">
                <Car className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">K53 Master</h1>
                <p className="text-sm text-gray-600">South African Driving Test</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-orange-100 px-3 py-2 rounded-full">
                <Flame className="h-5 w-5 text-orange-500 streak-flame" />
                <span className="font-bold text-orange-700">{mockUser.streak}</span>
              </div>
              <div className="flex items-center space-x-2 bg-purple-100 px-3 py-2 rounded-full">
                <Crown className="h-5 w-5 text-purple-500" />
                <span className="font-bold text-purple-700">Level {mockUser.level}</span>
              </div>
              <a 
                href="https://taxfy.co.za" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
              >
                Taxfy Refunds
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="bg-gradient-to-r from-green-400 to-blue-500 p-6 rounded-full shadow-2xl bounce-in">
                <Car className="h-16 w-16 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-2 shadow-lg">
                <Star className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Master Your <span className="text-primary">K53 Test</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Learn with confidence using our gamified learning platform. 
            Join thousands of South Africans who passed their K53 test!
          </p>

          {/* XP Progress */}
          <div className="max-w-md mx-auto mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">Level {mockUser.level}</span>
              <span className="text-sm font-medium text-gray-600">{mockUser.xp} / {mockUser.nextLevelXp} XP</span>
            </div>
            <div className="duolingo-progress h-3">
              <div 
                className="duolingo-progress-bar" 
                style={{ width: `${(mockUser.xp / mockUser.nextLevelXp) * 100}%` }}
              />
            </div>
          </div>

          <Button asChild className="duolingo-button text-lg px-8 py-6 mb-8">
            <Link to="/practice">
              Continue Learning
              <Zap className="ml-2 h-6 w-6" />
            </Link>
          </Button>
        </div>

        {/* Learning Categories */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Your Learning Path
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Card key={category.id} className="duolingo-card overflow-hidden group cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-2xl ${category.color} shadow-lg group-hover:scale-110 transition-transform`}>
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      <Badge className="level-badge">{category.lessons}</Badge>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{category.title}</h3>
                    <p className="text-gray-600 mb-4">{category.description}</p>
                    
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-600">Progress</span>
                        <span className="text-sm font-bold text-primary">{category.progress}%</span>
                      </div>
                      <div className="duolingo-progress h-2">
                        <div 
                          className="duolingo-progress-bar" 
                          style={{ width: `${category.progress}%` }}
                        />
                      </div>
                    </div>
                    
                    <Button asChild variant="outline" className="w-full rounded-xl font-semibold">
                      <Link to="/practice">
                        Start Learning
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Achievements */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Your Achievements
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {achievements.map((achievement) => {
              const IconComponent = achievement.icon;
              return (
                <Card 
                  key={achievement.id} 
                  className={`duolingo-card p-4 text-center ${
                    achievement.earned 
                      ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200' 
                      : 'bg-gray-50 border-gray-200 opacity-60'
                  }`}
                >
                  <div className={`mx-auto mb-3 p-3 rounded-full w-fit ${
                    achievement.earned 
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' 
                      : 'bg-gray-300 text-gray-500'
                  }`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-gray-800 mb-1">{achievement.title}</h3>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Users, value: "10K+", label: "Learners", color: "text-blue-500" },
              { icon: Trophy, value: "85%", label: "Pass Rate", color: "text-green-500" },
              { icon: BookOpen, value: "150+", label: "Questions", color: "text-purple-500" },
              { icon: Award, value: "3", label: "Languages", color: "text-orange-500" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`mx-auto mb-2 p-3 rounded-full w-fit bg-gray-100 ${stat.color}`}>
                  <stat.icon className="h-8 w-8" />
                </div>
                <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card className="duolingo-card bg-gradient-to-r from-blue-500 to-purple-600 text-white overflow-hidden">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Quick Practice</h3>
                  <p className="mb-4 opacity-90">Take a 5-minute practice session</p>
                  <Button asChild variant="secondary" className="rounded-xl font-semibold">
                    <Link to="/practice">Start Now</Link>
                  </Button>
                </div>
                <Target className="h-16 w-16 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="duolingo-card bg-gradient-to-r from-green-500 to-blue-500 text-white overflow-hidden">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Find Test Center</h3>
                  <p className="mb-4 opacity-90">Locate your nearest DLTC</p>
                  <Button asChild variant="secondary" className="rounded-xl font-semibold">
                    <Link to="/dltc">Find DLTC</Link>
                  </Button>
                </div>
                <MapPin className="h-16 w-16 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <footer className="text-center py-12 border-t border-gray-200">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <div className="bg-primary text-primary-foreground rounded-xl p-2">
              <Car className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold text-gray-800">K53 Master</span>
          </div>
          <p className="text-gray-600 mb-4">
            The most fun way to learn driving in South Africa
          </p>
          <div className="flex justify-center space-x-6 text-sm text-gray-500">
            <Link to="/practice" className="hover:text-primary transition-colors">Practice</Link>
            <Link to="/progress" className="hover:text-primary transition-colors">Progress</Link>
            <Link to="/dltc" className="hover:text-primary transition-colors">Find DLTC</Link>
            <a href="https://taxfy.co.za" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              Taxfy
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
