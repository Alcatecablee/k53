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
  Settings,
  User,
  LogOut,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function Index() {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b-2 border-slate-800 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-slate-800 flex items-center justify-center">
                <div className="text-white font-bold text-lg tracking-wider">
                  K53
                </div>
              </div>
              <div className="border-l-2 border-slate-200 pl-4">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  LEARNER'S LICENSE TESTING
                </h1>
                <p className="text-sm text-slate-600 font-medium uppercase tracking-wide">
                  Department of Transport • Republic of South Africa
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <nav className="hidden md:flex items-center space-x-8">
                <Link
                  to="/practice"
                  className="text-slate-700 hover:text-slate-900 font-semibold text-sm uppercase tracking-wide border-b-2 border-transparent hover:border-slate-800 pb-1 transition-all"
                >
                  Practice Tests
                </Link>
                <Link
                  to="/progress"
                  className="text-slate-700 hover:text-slate-900 font-semibold text-sm uppercase tracking-wide border-b-2 border-transparent hover:border-slate-800 pb-1 transition-all"
                >
                  Results
                </Link>
                <Link
                  to="/dltc"
                  className="text-slate-700 hover:text-slate-900 font-semibold text-sm uppercase tracking-wide border-b-2 border-transparent hover:border-slate-800 pb-1 transition-all"
                >
                  Test Centers
                </Link>
                <a
                  href="https://taxfy.co.za"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-800 text-white px-4 py-2 text-sm font-semibold uppercase tracking-wide hover:bg-slate-700 transition-colors"
                >
                  Tax Services
                </a>
              </nav>

              {/* User Profile Icon */}
              {user && (
                <div className="flex items-center space-x-2 border-l-2 border-slate-200 pl-4">
                  <Button
                    asChild
                    variant="ghost"
                    size="icon"
                    className="text-slate-700 hover:text-slate-900"
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
                    className="text-slate-700 hover:text-slate-900"
                    title="Sign Out"
                  >
                    <LogOut className="h-5 w-5" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="bg-slate-800 text-white p-12 mb-12">
              <div className="max-w-4xl">
                <div className="flex items-center mb-6">
                  <div className="w-2 h-16 bg-white mr-6"></div>
                  <div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-2 tracking-tight">
                      OFFICIAL K53 LEARNER'S LICENSE
                    </h1>
                    <h2 className="text-2xl md:text-3xl text-slate-300 font-light">
                      Examination Preparation System
                    </h2>
                  </div>
                </div>
                <p className="text-xl text-slate-200 leading-relaxed max-w-3xl">
                  Authorized practice testing platform in accordance with South
                  African National Road Traffic Act. Comprehensive examination
                  preparation covering all three mandatory assessment
                  categories.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <div className="bg-slate-800 text-white p-8">
                <h3 className="text-xl font-bold mb-4 uppercase tracking-wide">
                  Candidate Assessment Portal
                </h3>
                <p className="text-slate-300 mb-6">
                  Access comprehensive practice examinations aligned with
                  current K53 regulations and assessment criteria.
                </p>
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-slate-800 hover:bg-slate-100 font-semibold uppercase tracking-wide w-full"
                >
                  <Link to="/practice">Begin Assessment</Link>
                </Button>
              </div>

              <div className="bg-white border-2 border-slate-800 p-8">
                <h3 className="text-xl font-bold mb-4 uppercase tracking-wide text-slate-800">
                  Testing Center Directory
                </h3>
                <p className="text-slate-600 mb-6">
                  Locate authorized DLTC examination centers and schedule your
                  official learner's license test.
                </p>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-2 border-slate-800 text-slate-800 hover:bg-slate-800 hover:text-white font-semibold uppercase tracking-wide w-full"
                >
                  <Link to="/dltc">Find Centers</Link>
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-slate-100 p-8">
              <h3 className="text-center text-lg font-bold uppercase tracking-wide text-slate-800 mb-8">
                System Statistics
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="text-center border-r border-slate-300 last:border-r-0">
                  <div className="text-4xl font-bold text-slate-800 mb-2">
                    150+
                  </div>
                  <div className="text-sm text-slate-600 uppercase tracking-wide font-medium">
                    Assessment Items
                  </div>
                </div>
                <div className="text-center border-r border-slate-300 last:border-r-0">
                  <div className="text-4xl font-bold text-slate-800 mb-2">
                    85%
                  </div>
                  <div className="text-sm text-slate-600 uppercase tracking-wide font-medium">
                    Pass Rate
                  </div>
                </div>
                <div className="text-center border-r border-slate-300 last:border-r-0">
                  <div className="text-4xl font-bold text-slate-800 mb-2">
                    3
                  </div>
                  <div className="text-sm text-slate-600 uppercase tracking-wide font-medium">
                    Languages
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-slate-800 mb-2">
                    50+
                  </div>
                  <div className="text-sm text-slate-600 uppercase tracking-wide font-medium">
                    Test Centers
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Assessment Categories */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-slate-800 mb-4 uppercase tracking-wide">
                Official Assessment Categories
              </h2>
              <p className="text-lg text-slate-600 max-w-3xl">
                Complete assessment preparation covering all mandatory
                examination sections as prescribed by the Department of
                Transport.
              </p>
            </div>

            <div className="bg-white border-2 border-slate-800">
              <div className="bg-slate-800 text-white p-6">
                <h3 className="text-xl font-bold uppercase tracking-wide">
                  K53 Examination Structure
                </h3>
              </div>

              <div className="divide-y divide-slate-200">
                <div className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <div className="w-16 h-16 bg-slate-100 border-2 border-slate-800 flex items-center justify-center">
                        <Settings className="w-8 h-8 text-slate-800" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-slate-800 uppercase tracking-wide">
                          Vehicle Controls
                        </h4>
                        <p className="text-slate-600 mt-1">
                          Assessment of clutch operation, steering mechanisms,
                          braking systems, and indicator controls
                        </p>
                        <div className="mt-2 text-sm text-slate-500">
                          8 Questions • Minimum Pass: 6/8 (75%)
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Button
                        asChild
                        className="bg-slate-800 text-white hover:bg-slate-700 font-semibold uppercase tracking-wide"
                      >
                        <Link to="/practice">Begin Module</Link>
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <div className="w-16 h-16 bg-slate-100 border-2 border-slate-800 flex items-center justify-center">
                        <Layers className="w-8 h-8 text-slate-800" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-slate-800 uppercase tracking-wide">
                          Road Signs & Markings
                        </h4>
                        <p className="text-slate-600 mt-1">
                          Regulatory signs, warning indicators, prohibition
                          notices, and road surface markings
                        </p>
                        <div className="mt-2 text-sm text-slate-500">
                          28 Questions • Minimum Pass: 23/28 (82%)
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Button
                        asChild
                        className="bg-slate-800 text-white hover:bg-slate-700 font-semibold uppercase tracking-wide"
                      >
                        <Link to="/practice">Begin Module</Link>
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <div className="w-16 h-16 bg-slate-100 border-2 border-slate-800 flex items-center justify-center">
                        <FileText className="w-8 h-8 text-slate-800" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-slate-800 uppercase tracking-wide">
                          Traffic Regulations
                        </h4>
                        <p className="text-slate-600 mt-1">
                          Speed limitations, following distances, parking
                          regulations, and traffic law compliance
                        </p>
                        <div className="mt-2 text-sm text-slate-500">
                          28 Questions • Minimum Pass: 22/28 (79%)
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Button
                        asChild
                        className="bg-slate-800 text-white hover:bg-slate-700 font-semibold uppercase tracking-wide"
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

      {/* System Features */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-slate-800 mb-4 uppercase tracking-wide">
                Official System Capabilities
              </h2>
              <p className="text-lg text-slate-600 max-w-3xl">
                Comprehensive assessment platform features designed in
                accordance with Department of Transport standards.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white border-2 border-slate-300 p-6 hover:border-slate-800 transition-colors">
                <div className="w-16 h-16 bg-slate-100 border-2 border-slate-800 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-8 w-8 text-slate-800" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-3 uppercase tracking-wide text-center">
                  Certified Content
                </h3>
                <p className="text-slate-600 text-center leading-relaxed">
                  Assessment items based on official K53 learner's license
                  curriculum as prescribed by the Department of Transport
                </p>
              </div>

              <div className="bg-white border-2 border-slate-300 p-6 hover:border-slate-800 transition-colors">
                <div className="w-16 h-16 bg-slate-100 border-2 border-slate-800 flex items-center justify-center mx-auto mb-6">
                  <Clock className="h-8 w-8 text-slate-800" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-3 uppercase tracking-wide text-center">
                  Immediate Evaluation
                </h3>
                <p className="text-slate-600 text-center leading-relaxed">
                  Real-time assessment scoring with comprehensive explanatory
                  feedback for all examination items
                </p>
              </div>

              <div className="bg-white border-2 border-slate-300 p-6 hover:border-slate-800 transition-colors">
                <div className="w-16 h-16 bg-slate-100 border-2 border-slate-800 flex items-center justify-center mx-auto mb-6">
                  <BarChart3 className="h-8 w-8 text-slate-800" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-3 uppercase tracking-wide text-center">
                  Performance Analytics
                </h3>
                <p className="text-slate-600 text-center leading-relaxed">
                  Advanced tracking and analysis of assessment performance
                  across all mandatory categories
                </p>
              </div>

              <div className="bg-white border-2 border-slate-300 p-6 hover:border-slate-800 transition-colors">
                <div className="w-16 h-16 bg-slate-100 border-2 border-slate-800 flex items-center justify-center mx-auto mb-6">
                  <MapIcon className="h-8 w-8 text-slate-800" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-3 uppercase tracking-wide text-center">
                  Center Directory
                </h3>
                <p className="text-slate-600 text-center leading-relaxed">
                  Comprehensive database of authorized DLTC testing facilities
                  with contact information
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Assessment Authorization */}
      <section className="py-20 bg-slate-800">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="w-2 h-16 bg-white mx-auto mb-8"></div>
            <h2 className="text-4xl font-bold text-white mb-6 uppercase tracking-wide">
              Authorized Assessment Platform
            </h2>
            <p className="text-xl text-slate-200 mb-10 leading-relaxed">
              Thousands of South African citizens have successfully obtained
              their learner's licenses through this official Department of
              Transport certified preparation system.
            </p>
            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <Button
                asChild
                size="lg"
                className="bg-white text-slate-800 hover:bg-slate-100 font-semibold uppercase tracking-wide py-4 text-lg"
              >
                <Link to="/practice">Begin Assessment Preparation</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-slate-800 font-semibold uppercase tracking-wide py-4 text-lg"
              >
                <Link to="/dltc">Locate Testing Centers</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16 border-t-2 border-slate-800">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-white flex items-center justify-center">
                  <div className="text-slate-900 font-bold text-lg tracking-wider">
                    K53
                  </div>
                </div>
                <div className="border-l-2 border-slate-700 pl-4">
                  <div className="font-bold text-white uppercase tracking-wide">
                    Assessment Portal
                  </div>
                  <div className="text-slate-400 text-xs uppercase tracking-wide">
                    Republic of South Africa
                  </div>
                </div>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Official Department of Transport certified K53 learner's license
                examination preparation system.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-6 uppercase tracking-wide text-white">
                Assessment Categories
              </h4>
              <div className="space-y-3 text-slate-400">
                <Link
                  to="/practice"
                  className="block hover:text-white transition-colors uppercase tracking-wide text-sm"
                >
                  Vehicle Controls
                </Link>
                <Link
                  to="/practice"
                  className="block hover:text-white transition-colors uppercase tracking-wide text-sm"
                >
                  Road Signs & Markings
                </Link>
                <Link
                  to="/practice"
                  className="block hover:text-white transition-colors uppercase tracking-wide text-sm"
                >
                  Traffic Regulations
                </Link>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-6 uppercase tracking-wide text-white">
                System Resources
              </h4>
              <div className="space-y-3 text-slate-400">
                <Link
                  to="/progress"
                  className="block hover:text-white transition-colors uppercase tracking-wide text-sm"
                >
                  Performance Analytics
                </Link>
                <Link
                  to="/dltc"
                  className="block hover:text-white transition-colors uppercase tracking-wide text-sm"
                >
                  Testing Center Directory
                </Link>
                <a
                  href="https://taxfy.co.za"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block hover:text-white transition-colors uppercase tracking-wide text-sm"
                >
                  Tax Services Portal
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-6 uppercase tracking-wide text-white">
                Official Support
              </h4>
              <div className="space-y-3 text-slate-400">
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4" />
                  <span className="text-sm">Support Line: 0800 123 456</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">10,000+ Citizens Assisted</span>
                </div>
                <div className="bg-slate-800 border border-slate-700 p-3 mt-4">
                  <div className="text-xs text-slate-300 uppercase tracking-wide">
                    Official Platform
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t-2 border-slate-800 mt-12 pt-8">
            <div className="text-center text-slate-400">
              <p className="text-sm uppercase tracking-wide">
                &copy; 2025 Department of Transport K53 Assessment Portal •
                Republic of South Africa
              </p>
              <p className="text-xs text-slate-500 mt-2">
                Authorized digital platform for learner's license examination
                preparation
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
