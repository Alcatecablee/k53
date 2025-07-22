import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Clock,
  MapPin,
  Target,
  Smartphone,
  BookOpen,
  TrendingUp,
  Shield,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Index() {
  const features = [
    {
      icon: Target,
      title: "Realistic Practice Tests",
      description:
        "64-question mock tests matching real K53 format: 8 controls, 28 signs, 28 rules",
    },
    {
      icon: Clock,
      title: "Instant Feedback",
      description:
        "Get immediate results with detailed explanations for every question",
    },
    {
      icon: Smartphone,
      title: "Offline Access",
      description:
        "Practice anywhere without internet connection - perfect for South African conditions",
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      description:
        "Monitor your improvement with detailed analytics and weak area identification",
    },
    {
      icon: MapPin,
      title: "DLTC Finder",
      description:
        "Locate nearby Driving License Testing Centres with contact details",
    },
    {
      icon: Shield,
      title: "Taxfy Integration",
      description:
        "Calculate potential test fee refunds with our partner service",
    },
  ];

  const stats = [
    { label: "Practice Questions", value: "150+" },
    { label: "Pass Rate", value: "85%" },
    { label: "Languages", value: "3" },
    { label: "Users Helped", value: "1000+" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-secondary/10">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-primary text-primary-foreground rounded-full p-2">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">K53 Master</h1>
              <p className="text-xs text-muted-foreground">
                Practice Test Simulator
              </p>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/practice"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Practice Tests
            </Link>
            <Link
              to="/progress"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              My Progress
            </Link>
            <Link
              to="/dltc"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Find DLTC
            </Link>
            <a
              href="https://taxfy.co.za"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-secondary hover:text-secondary/80 transition-colors"
            >
              Taxfy Refunds
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-4">
            🇿🇦 Built for South Africa
          </Badge>

          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Pass Your <span className="text-primary">K53 Test</span>
            <br />
            with Confidence
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Master your learner's license with our comprehensive practice
            simulator. Features real K53 questions, progress tracking, and
            offline access designed specifically for South African drivers.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button asChild size="lg" className="text-lg px-8">
              <Link to="/practice">
                Start Practice Test
                <Target className="ml-2 h-5 w-5" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="text-lg px-8"
            >
              <Link to="/progress">
                View Progress
                <TrendingUp className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything You Need to Pass
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our comprehensive platform provides all the tools and resources you
            need to ace your K53 learner's license test.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-2 hover:border-primary/20 transition-colors"
            >
              <CardHeader>
                <div className="bg-primary/10 text-primary rounded-full p-3 w-fit">
                  <feature.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Language Support */}
      <section className="bg-accent/5 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Multilingual Support
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Practice in your preferred language with support for English,
            Afrikaans, and isiZulu.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Badge variant="outline" className="text-base px-4 py-2">
              🇬🇧 English
            </Badge>
            <Badge variant="outline" className="text-base px-4 py-2">
              🇿🇦 Afrikaans
            </Badge>
            <Badge variant="outline" className="text-base px-4 py-2">
              🌍 isiZulu
            </Badge>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border-0">
          <CardContent className="p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Get Your License?
            </h2>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of South Africans who have successfully passed
              their K53 test using our practice simulator.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="text-lg px-8"
              >
                <Link to="/practice">
                  Start Your First Test
                  <CheckCircle className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="text-lg px-8 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                <Link to="/dltc">
                  Find Test Centre
                  <MapPin className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-primary text-primary-foreground rounded-full p-2">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">K53 Master</h3>
                  <p className="text-xs text-muted-foreground">
                    Practice Test Simulator
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                The most comprehensive K53 practice test simulator for South
                African learner drivers.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-3">
                Quick Links
              </h4>
              <div className="space-y-2 text-sm">
                <Link
                  to="/practice"
                  className="block text-muted-foreground hover:text-primary transition-colors"
                >
                  Practice Tests
                </Link>
                <Link
                  to="/progress"
                  className="block text-muted-foreground hover:text-primary transition-colors"
                >
                  Progress Tracking
                </Link>
                <Link
                  to="/dltc"
                  className="block text-muted-foreground hover:text-primary transition-colors"
                >
                  DLTC Finder
                </Link>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-3">
                Partner Services
              </h4>
              <div className="space-y-2 text-sm">
                <a
                  href="https://taxfy.co.za"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-secondary hover:text-secondary/80 transition-colors"
                >
                  Taxfy - Test Fee Refunds
                </a>
              </div>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center">
            <p className="text-sm text-muted-foreground">
              © 2025 K53 Master. Built for South African drivers with ❤️
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
