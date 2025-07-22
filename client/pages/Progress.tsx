import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Home, Target, Clock, Award } from "lucide-react";
import { Link } from "react-router-dom";

export default function ProgressPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-secondary/10">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button asChild variant="outline">
            <Link to="/">
              <Home className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">My Progress</h1>
            <p className="text-muted-foreground">Track your K53 preparation journey</p>
          </div>
          <div></div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Coming Soon Message */}
          <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
            <CardContent className="p-8 text-center">
              <div className="bg-primary/10 text-primary rounded-full p-4 w-fit mx-auto mb-4">
                <TrendingUp className="h-8 w-8" />
              </div>
              
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Progress Tracking Coming Soon!
              </h2>
              
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                We're building an advanced progress tracking system that will help you monitor your improvement, 
                identify weak areas, and track your journey to K53 success. Features will include:
              </p>

              <div className="grid md:grid-cols-2 gap-4 mb-8 text-left">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Target className="h-5 w-5 text-primary" />
                    <span>Detailed test analytics</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-primary" />
                    <span>Test history and timing</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Award className="h-5 w-5 text-primary" />
                    <span>Achievement badges</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <span>Performance trends</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link to="/practice">
                    Take a Practice Test
                    <Target className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                
                <Button asChild variant="outline" size="lg">
                  <Link to="/">
                    Back to Home
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Mock Progress Data for Demo */}
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tests Taken</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary mb-2">0</div>
                <p className="text-sm text-muted-foreground">Start practicing to see your stats!</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Best Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary mb-2">--</div>
                <p className="text-sm text-muted-foreground">Complete tests to track progress</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ready for Test?</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="outline" className="mb-2">Not yet</Badge>
                <p className="text-sm text-muted-foreground">Keep practicing to improve!</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
