import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Clock,
  CheckCircle,
  Users,
  FileText,
  MapPin,
  Phone,
  Car,
  Cog,
  Layers,
  ChartBarStacked,
  BarChart3,
  MapIcon,
  Settings
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black">
      {/* Header */}
      <header className="bg-gray-900/80 backdrop-blur-sm shadow-sm border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <div className="text-white font-bold text-lg">K53</div>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-white">K53 Practice Tests</h1>
                <p className="text-sm text-gray-300">South African Learner's License</p>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/practice" className="text-gray-300 hover:text-blue-400 font-medium">
                Practice Tests
              </Link>
              <Link to="/progress" className="text-gray-300 hover:text-blue-400 font-medium">
                My Results
              </Link>
              <Link to="/dltc" className="text-gray-300 hover:text-blue-400 font-medium">
                Test Centers
              </Link>
              <a 
                href="https://taxfy.co.za" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 font-medium"
              >
                Taxfy Refunds
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Master Your K53 Learner's License Test
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Comprehensive practice tests designed specifically for South African driving regulations. 
              Study the official K53 syllabus with realistic questions and instant feedback.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8">
                <Link to="/practice">
                  Start Practice Test
                </Link>
              </Button>
              
              <Button asChild variant="outline" size="lg" className="text-lg px-8">
                <Link to="/dltc">
                  Find Test Centers
                </Link>
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-gray-700">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">150+</div>
                <div className="text-sm text-gray-300">Practice Questions</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">85%</div>
                <div className="text-sm text-gray-300">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">3</div>
                <div className="text-sm text-gray-300">Languages</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">50+</div>
                <div className="text-sm text-gray-300">Test Centers</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Test Categories */}
      <section className="py-16 bg-gradient-to-r from-slate-900/50 to-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                K53 Test Categories
              </h2>
              <p className="text-lg text-gray-300">
                Practice all three sections required for your learner's license
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Vehicle Controls */}
              <Card className="border border-gray-700 bg-gray-800/40 backdrop-blur-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all">
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Settings className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl text-white">Vehicle Controls</CardTitle>
                  <p className="text-gray-300">8 questions • Pass: 6/8</p>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">
                    Clutch operation, steering, brakes, indicators, and other essential vehicle controls.
                  </p>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>75%</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/practice">Practice</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Road Signs */}
              <Card className="border border-gray-700 bg-gray-800/40 backdrop-blur-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all">
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <Layers className="w-6 h-6 text-green-600" />
                  </div>
                  <CardTitle className="text-xl text-white">Road Signs</CardTitle>
                  <p className="text-gray-300">28 questions • Pass: 23/28</p>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">
                    Warning signs, command signs, prohibition signs, and road markings.
                  </p>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>60%</span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/practice">Practice</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Traffic Rules */}
              <Card className="border border-gray-700 bg-gray-800/40 backdrop-blur-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all">
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                    <FileText className="w-6 h-6 text-orange-600" />
                  </div>
                  <CardTitle className="text-xl text-white">Traffic Rules</CardTitle>
                  <p className="text-gray-300">28 questions • Pass: 22/28</p>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">
                    Speed limits, following distances, parking regulations, and traffic laws.
                  </p>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/practice">Practice</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Why Choose Our Platform?
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Official Content</h3>
                <p className="text-gray-600">
                  Questions based on the official K53 learner's license syllabus
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant Results</h3>
                <p className="text-gray-600">
                  Get immediate feedback with detailed explanations for every question
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Track Progress</h3>
                <p className="text-gray-600">
                  Monitor your performance across all test categories
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <MapIcon className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Find Centers</h3>
                <p className="text-gray-600">
                  Locate DLTC offices near you with contact information
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Pass Your K53 Test?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of South Africans who have successfully obtained their learner's license with our practice tests.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="text-lg px-8">
                <Link to="/practice">
                  Start Practicing Now
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8 border-white text-white hover:bg-white hover:text-blue-600">
                <Link to="/dltc">
                  Find Test Centers
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <div className="text-white font-bold">K53</div>
                </div>
                <span className="text-lg font-semibold">K53 Practice Tests</span>
              </div>
              <p className="text-gray-400">
                The most comprehensive K53 practice test platform for South African learner drivers.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Practice</h4>
              <div className="space-y-2 text-gray-400">
                <Link to="/practice" className="block hover:text-white transition-colors">
                  Vehicle Controls
                </Link>
                <Link to="/practice" className="block hover:text-white transition-colors">
                  Road Signs
                </Link>
                <Link to="/practice" className="block hover:text-white transition-colors">
                  Traffic Rules
                </Link>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <div className="space-y-2 text-gray-400">
                <Link to="/progress" className="block hover:text-white transition-colors">
                  My Progress
                </Link>
                <Link to="/dltc" className="block hover:text-white transition-colors">
                  Test Centers
                </Link>
                <a href="https://taxfy.co.za" target="_blank" rel="noopener noreferrer" className="block hover:text-white transition-colors">
                  Taxfy Refunds
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>Support: 0800 123 456</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>10,000+ learners helped</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 K53 Practice Tests. Designed for South African learner drivers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
