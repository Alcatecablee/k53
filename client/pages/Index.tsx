import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle,
  Shield,
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
  Settings,
  User,
  LogOut,
  Star,
  Award,
  Clock,
  Globe,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { DemoModeIndicator } from "@/components/DemoModeIndicator";

export default function Index() {
  // Safe useAuth call with error handling for HMR issues
  let user = null;
  let signOut = async () => {};

  try {
    const auth = useAuth();
    user = auth.user;
    signOut = auth.signOut;
  } catch (error) {
    console.warn(
      "Auth context not available, continuing without authentication:",
      error,
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-900/95 backdrop-blur-sm border-b border-slate-700 shadow-2xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              {/* South African Government Style Logo */}
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center shadow-lg">
                  <div className="text-white font-bold text-lg tracking-wider">
                    K53
                  </div>
                </div>
                <div className="border-l-2 border-blue-500 pl-4">
                  <h1 className="text-2xl font-bold text-white tracking-tight">
                    SUPERK53
                  </h1>
                  <p className="text-sm text-blue-300 font-medium uppercase tracking-wide">
                    Official Learner's License Portal • Republic of South Africa
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <nav className="hidden md:flex items-center space-x-8">
                <Link
                  to="/practice"
                  className="text-slate-300 hover:text-white font-semibold text-sm uppercase tracking-wide border-b-2 border-transparent hover:border-blue-400 pb-1 transition-all duration-300"
                >
                  Practice Tests
                </Link>
                <Link
                  to="/progress"
                  className="text-slate-300 hover:text-white font-semibold text-sm uppercase tracking-wide border-b-2 border-transparent hover:border-blue-400 pb-1 transition-all duration-300"
                >
                  Results
                </Link>
                <Link
                  to="/pricing"
                  className="text-blue-400 hover:text-blue-300 font-semibold text-sm uppercase tracking-wide border-b-2 border-transparent hover:border-blue-400 pb-1 transition-all duration-300"
                >
                  SuperK53 Premium
                </Link>
                <Link
                  to="/dltc"
                  className="text-slate-300 hover:text-white font-semibold text-sm uppercase tracking-wide border-b-2 border-transparent hover:border-blue-400 pb-1 transition-all duration-300"
                >
                  Test Centers
                </Link>
                <a
                  href="https://taxfy.co.za"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-semibold uppercase tracking-wide transition-all duration-300 shadow-lg"
                >
                  Tax Services
                </a>
              </nav>

              {/* User Profile Icons */}
              <div className="flex items-center space-x-3 border-l border-slate-600 pl-4">
                {user ? (
                  <>
                    <Button
                      asChild
                      variant="ghost"
                      size="icon"
                      className="text-slate-300 hover:text-white hover:bg-slate-700"
                      title="View Profile"
                    >
                      <Link to="/profile">
                        <User className="h-5 w-5" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={signOut}
                      className="text-slate-300 hover:text-white hover:bg-slate-700"
                      title="Sign Out"
                    >
                      <LogOut className="h-5 w-5" />
                    </Button>
                  </>
                ) : (
                  <Button
                    asChild
                    variant="ghost"
                    className="text-slate-300 hover:text-white hover:bg-slate-700 font-semibold text-sm uppercase tracking-wide"
                  >
                    <Link to="/practice">
                      <User className="h-4 w-4 mr-2" />
                      Sign In
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Demo Mode Indicator */}
      <div className="container mx-auto px-4 pt-4">
        <DemoModeIndicator />
      </div>

      {/* Hero Section */}
      <section className="pt-16 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {/* Official Government Header */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-12 mb-12 shadow-2xl">
              <div className="max-w-5xl">
                <div className="flex items-center mb-8">
                  <div className="w-3 h-20 bg-blue-500 mr-8 rounded"></div>
                  <div>
                    <div className="flex items-center space-x-4 mb-4">
                      <Shield className="h-8 w-8 text-blue-400" />
                      <Badge className="bg-blue-600 text-white px-4 py-1">
                        DEPARTMENT OF TRANSPORT
                      </Badge>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight text-white">
                      OFFICIAL K53 LEARNER'S LICENSE
                    </h1>
                    <h2 className="text-3xl md:text-4xl text-blue-300 font-light mb-6">
                      Digital Assessment Platform
                    </h2>
                  </div>
                </div>
                <div className="bg-slate-900/50 border border-slate-600 rounded-lg p-8">
                  <p className="text-xl text-slate-200 leading-relaxed max-w-4xl">
                    Authorized digital examination platform in accordance with the National Road Traffic Act. 
                    Comprehensive assessment preparation covering all mandatory testing categories as prescribed 
                    by the Department of Transport, Republic of South Africa.
                  </p>
                  <div className="flex items-center space-x-6 mt-6">
                    <div className="flex items-center space-x-2">
                      <Award className="h-5 w-5 text-yellow-400" />
                      <span className="text-yellow-400 font-semibold">Officially Certified</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Globe className="h-5 w-5 text-green-400" />
                      <span className="text-green-400 font-semibold">National Coverage</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Premium Access Banner */}
            <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 border border-blue-500 rounded-lg p-8 mb-12 shadow-2xl">
              <div className="max-w-5xl mx-auto text-center">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <Star className="h-8 w-8 text-yellow-300" />
                  <h2 className="text-3xl font-bold text-white">
                    🚀 Start Your Journey Today
                  </h2>
                  <Star className="h-8 w-8 text-yellow-300" />
                </div>
                <p className="text-blue-100 mb-6 text-lg">
                  Access 5 AI-powered scenarios daily for FREE • Location-aware practice tests • 
                  Upgrade to SuperK53 Premium for unlimited access and advanced features
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    asChild
                    size="lg"
                    className="bg-white text-blue-700 hover:bg-blue-50 font-bold py-4 px-8 rounded-lg shadow-lg transition-all duration-300"
                  >
                    <Link to="/practice">Begin Free Assessment</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="border-2 border-white text-white hover:bg-white hover:text-blue-700 font-bold py-4 px-8 rounded-lg transition-all duration-300"
                  >
                    <Link to="/pricing">View Premium Plans</Link>
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {/* Official Assessment Portal */}
              <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-600 text-white shadow-2xl hover:shadow-blue-500/20 transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold uppercase tracking-wide">
                        Official Assessment Portal
                      </CardTitle>
                      <p className="text-blue-100 text-sm">
                        Department of Transport Certified
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-8">
                  <p className="text-slate-300 mb-6 leading-relaxed">
                    Access comprehensive practice examinations aligned with current K53 regulations 
                    and assessment criteria as prescribed by the Department of Transport.
                  </p>
                  <Button
                    asChild
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-wide w-full py-4 rounded-lg shadow-lg transition-all duration-300"
                  >
                    <Link to="/practice">Begin Official Assessment</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Testing Center Directory */}
              <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-600 text-white shadow-2xl hover:shadow-green-500/20 transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 rounded-t-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <MapIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold uppercase tracking-wide">
                        DLTC Directory
                      </CardTitle>
                      <p className="text-green-100 text-sm">
                        Nationwide Testing Centers
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-8">
                  <p className="text-slate-300 mb-6 leading-relaxed">
                    Locate authorized DLTC examination centers and schedule your official 
                    learner's license test at registered facilities across South Africa.
                  </p>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="border-2 border-green-400 text-green-400 hover:bg-green-400 hover:text-slate-900 font-bold uppercase tracking-wide w-full py-4 rounded-lg transition-all duration-300"
                  >
                    <Link to="/dltc">Find Testing Centers</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Official Statistics */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-10 mb-16 shadow-2xl">
              <h3 className="text-center text-2xl font-bold uppercase tracking-wide text-white mb-10">
                Platform Statistics & Compliance
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="text-center p-6 bg-slate-900/50 rounded-lg border border-slate-600">
                  <div className="text-5xl font-bold text-blue-400 mb-3">
                    1000+
                  </div>
                  <div className="text-sm text-slate-300 uppercase tracking-wide font-medium">
                    Assessment Items
                  </div>
                </div>
                <div className="text-center p-6 bg-slate-900/50 rounded-lg border border-slate-600">
                  <div className="text-5xl font-bold text-green-400 mb-3">
                    92%
                  </div>
                  <div className="text-sm text-slate-300 uppercase tracking-wide font-medium">
                    Success Rate
                  </div>
                </div>
                <div className="text-center p-6 bg-slate-900/50 rounded-lg border border-slate-600">
                  <div className="text-5xl font-bold text-yellow-400 mb-3">
                    11
                  </div>
                  <div className="text-sm text-slate-300 uppercase tracking-wide font-medium">
                    Official Languages
                  </div>
                </div>
                <div className="text-center p-6 bg-slate-900/50 rounded-lg border border-slate-600">
                  <div className="text-5xl font-bold text-purple-400 mb-3">
                    500+
                  </div>
                  <div className="text-sm text-slate-300 uppercase tracking-wide font-medium">
                    Certified Centers
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Assessment Categories */}
      <section className="py-20 bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16 text-center">
              <h2 className="text-4xl font-bold text-white mb-6 uppercase tracking-wide">
                Official Assessment Categories
              </h2>
              <p className="text-xl text-slate-300 max-w-4xl mx-auto">
                Complete assessment preparation covering all mandatory examination sections 
                as prescribed by the Department of Transport, Republic of South Africa.
              </p>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-8">
                <h3 className="text-2xl font-bold uppercase tracking-wide text-white text-center">
                  K53 Official Examination Structure
                </h3>
              </div>

              <div className="divide-y divide-slate-700">
                {/* Vehicle Controls */}
                <div className="p-8 hover:bg-slate-800/50 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-8">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                        <Settings className="w-10 h-10 text-white" />
                      </div>
                      <div>
                        <h4 className="text-2xl font-bold text-white uppercase tracking-wide mb-2">
                          Vehicle Controls
                        </h4>
                        <p className="text-slate-300 mb-3 max-w-md">
                          Assessment of clutch operation, steering mechanisms, braking systems, 
                          and indicator controls as per official standards.
                        </p>
                        <div className="bg-slate-900/50 px-4 py-2 rounded-lg border border-slate-600 inline-block">
                          <span className="text-sm text-blue-300 font-semibold">
                            8 Questions • Minimum Pass: 6/8 (75%)
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Button
                        asChild
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-wide px-8 py-4 rounded-lg shadow-lg transition-all duration-300"
                      >
                        <Link to="/practice">Begin Module</Link>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Road Signs & Markings */}
                <div className="p-8 hover:bg-slate-800/50 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-8">
                      <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center shadow-lg">
                        <Layers className="w-10 h-10 text-white" />
                      </div>
                      <div>
                        <h4 className="text-2xl font-bold text-white uppercase tracking-wide mb-2">
                          Road Signs & Markings
                        </h4>
                        <p className="text-slate-300 mb-3 max-w-md">
                          Regulatory signs, warning indicators, prohibition notices, 
                          and road surface markings according to national standards.
                        </p>
                        <div className="bg-slate-900/50 px-4 py-2 rounded-lg border border-slate-600 inline-block">
                          <span className="text-sm text-yellow-300 font-semibold">
                            28 Questions • Minimum Pass: 23/28 (82%)
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Button
                        asChild
                        className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold uppercase tracking-wide px-8 py-4 rounded-lg shadow-lg transition-all duration-300"
                      >
                        <Link to="/practice">Begin Module</Link>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Traffic Regulations */}
                <div className="p-8 hover:bg-slate-800/50 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-8">
                      <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-lg">
                        <ChartBarStacked className="w-10 h-10 text-white" />
                      </div>
                      <div>
                        <h4 className="text-2xl font-bold text-white uppercase tracking-wide mb-2">
                          Traffic Regulations
                        </h4>
                        <p className="text-slate-300 mb-3 max-w-md">
                          Speed limitations, following distances, parking regulations, 
                          and traffic law compliance as mandated by legislation.
                        </p>
                        <div className="bg-slate-900/50 px-4 py-2 rounded-lg border border-slate-600 inline-block">
                          <span className="text-sm text-green-300 font-semibold">
                            28 Questions • Minimum Pass: 22/28 (79%)
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Button
                        asChild
                        className="bg-green-600 hover:bg-green-700 text-white font-bold uppercase tracking-wide px-8 py-4 rounded-lg shadow-lg transition-all duration-300"
                      >
                        <Link to="/practice">Begin Module</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16 text-center">
              <h2 className="text-4xl font-bold text-white mb-6 uppercase tracking-wide">
                Official Platform Capabilities
              </h2>
              <p className="text-xl text-slate-300 max-w-4xl mx-auto">
                Advanced assessment platform features designed in accordance with 
                Department of Transport standards and modern digital governance.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Certified Content */}
              <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-600 text-white hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300">
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <CheckCircle className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-4 uppercase tracking-wide">
                    Certified Content
                  </h3>
                  <p className="text-slate-300 leading-relaxed">
                    Assessment items based on official K53 learner's license curriculum 
                    as prescribed by the Department of Transport.
                  </p>
                </CardContent>
              </Card>

              {/* Immediate Evaluation */}
              <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-600 text-white hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-300">
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Clock className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-4 uppercase tracking-wide">
                    Immediate Evaluation
                  </h3>
                  <p className="text-slate-300 leading-relaxed">
                    Real-time assessment scoring with comprehensive explanatory 
                    feedback for all examination items.
                  </p>
                </CardContent>
              </Card>

              {/* Performance Analytics */}
              <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-600 text-white hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300">
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <BarChart3 className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-4 uppercase tracking-wide">
                    Performance Analytics
                  </h3>
                  <p className="text-slate-300 leading-relaxed">
                    Advanced tracking and analysis of assessment performance 
                    across all mandatory categories.
                  </p>
                </CardContent>
              </Card>

              {/* Center Directory */}
              <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-600 text-white hover:shadow-2xl hover:shadow-yellow-500/20 transition-all duration-300">
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <MapIcon className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-4 uppercase tracking-wide">
                    Center Directory
                  </h3>
                  <p className="text-slate-300 leading-relaxed">
                    Comprehensive database of authorized DLTC testing facilities 
                    with contact information.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-5xl mx-auto">
            <div className="w-3 h-20 bg-white mx-auto mb-10 rounded"></div>
            <h2 className="text-5xl font-bold text-white mb-8 uppercase tracking-wide">
              Begin Your Official Assessment
            </h2>
            <p className="text-2xl text-blue-100 mb-12 leading-relaxed">
              Join thousands of South African citizens who have successfully obtained 
              their learner's licenses through this official Department of Transport 
              certified preparation system.
            </p>
            <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              <Button
                asChild
                size="lg"
                className="bg-white text-blue-900 hover:bg-blue-50 font-bold uppercase tracking-wide py-6 text-lg rounded-lg shadow-2xl transition-all duration-300"
              >
                <Link to="/practice">Begin Assessment Preparation</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-900 font-bold uppercase tracking-wide py-6 text-lg rounded-lg transition-all duration-300"
              >
                <Link to="/dltc">Locate Testing Centers</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-20 border-t border-slate-700">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center shadow-lg">
                  <div className="text-white font-bold text-lg tracking-wider">
                    K53
                  </div>
                </div>
                <div className="border-l-2 border-blue-500 pl-4">
                  <div className="font-bold text-white uppercase tracking-wide text-lg">
                    SuperK53 Portal
                  </div>
                  <div className="text-blue-300 text-sm uppercase tracking-wide">
                    Republic of South Africa
                  </div>
                </div>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Official Department of Transport certified K53 learner's license 
                examination preparation system for the Republic of South Africa.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-8 uppercase tracking-wide text-white text-lg">
                Assessment Categories
              </h4>
              <div className="space-y-4 text-slate-400">
                <Link
                  to="/practice"
                  className="block hover:text-white transition-colors uppercase tracking-wide text-sm font-medium"
                >
                  Vehicle Controls
                </Link>
                <Link
                  to="/practice"
                  className="block hover:text-white transition-colors uppercase tracking-wide text-sm font-medium"
                >
                  Road Signs & Markings
                </Link>
                <Link
                  to="/practice"
                  className="block hover:text-white transition-colors uppercase tracking-wide text-sm font-medium"
                >
                  Traffic Regulations
                </Link>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-8 uppercase tracking-wide text-white text-lg">
                Platform Resources
              </h4>
              <div className="space-y-4 text-slate-400">
                <Link
                  to="/progress"
                  className="block hover:text-white transition-colors uppercase tracking-wide text-sm font-medium"
                >
                  Performance Analytics
                </Link>
                <Link
                  to="/dltc"
                  className="block hover:text-white transition-colors uppercase tracking-wide text-sm font-medium"
                >
                  Testing Center Directory
                </Link>
                <a
                  href="https://taxfy.co.za"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block hover:text-white transition-colors uppercase tracking-wide text-sm font-medium"
                >
                  Tax Services Portal
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-8 uppercase tracking-wide text-white text-lg">
                Official Support
              </h4>
              <div className="space-y-4 text-slate-400">
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-blue-400" />
                  <span className="text-sm">Support: 0800 123 456</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-green-400" />
                  <span className="text-sm">50,000+ Citizens Assisted</span>
                </div>
                <div className="bg-slate-800 border border-slate-600 p-4 mt-6 rounded-lg">
                  <div className="text-xs text-blue-300 uppercase tracking-wide font-bold">
                    Department of Transport
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Authorized Digital Platform
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-700 mt-16 pt-12">
            <div className="text-center text-slate-400">
              <p className="text-sm uppercase tracking-wide mb-2">
                &copy; 2025 Department of Transport K53 Assessment Portal • Republic of South Africa
              </p>
              <p className="text-xs text-slate-500">
                Authorized digital platform for learner's license examination preparation
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
