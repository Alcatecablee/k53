import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Clock,
  Award,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { getPlatformStatistics, type PlatformStatistics } from "@/services/statisticsService";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileNavigation } from "@/components/MobileNavigation";
import { AccessibilityEnhancer } from "@/components/AccessibilityEnhancer";

import { SEO, WebsiteSEO, CourseSEO } from "@/components/SEO";
import { SEO_CONFIGS } from "@/hooks/useSEO";

export default function Index() {
  const [stats, setStats] = useState<PlatformStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

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

  // Load platform statistics
  useEffect(() => {
    const loadStats = async () => {
      try {
        const platformStats = await getPlatformStatistics();
        setStats(platformStats);
      } catch (error) {
        console.warn("Error loading platform statistics:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  // Close mobile menu when screen size changes
  useEffect(() => {
    if (!isMobile) {
      setMobileMenuOpen(false);
    }
  }, [isMobile]);

  // Handle escape key to close mobile menu
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [mobileMenuOpen]);

  return (
    <AccessibilityEnhancer>
      <SEO {...SEO_CONFIGS.home} />
      <WebsiteSEO />
      <CourseSEO />
      <div className="min-h-screen bg-slate-900">
        {/* Header */}
        <header id="navigation" className="bg-slate-800 border-b border-black sticky top-0 z-50 transition-all duration-300">
          <div className="container mx-auto px-4 py-4 sm:py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 sm:space-x-6">
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <div className="w-10 h-10 sm:w-14 sm:h-14 bg-slate-700 border border-black flex items-center justify-center transition-all duration-200 hover:bg-slate-600">
                    <div className="text-white font-bold text-xs sm:text-sm tracking-wider">
                      K53
                    </div>
                  </div>
                  <div className="border-l border-black pl-2 sm:pl-4">
                    <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                      SUPERK53
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-400 font-medium uppercase tracking-wide">
                      Official Learner's License Portal
                    </p>
                  </div>
                </div>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-6" role="navigation" aria-label="Main navigation">
                <Link
                  to="/practice"
                  className="text-slate-400 hover:text-white text-xs font-normal transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-800 rounded"
                  aria-label="Practice assessments"
                >
                  Practice
                </Link>
                <Link
                  to="/image-library"
                  className="text-slate-400 hover:text-white text-xs font-normal transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-800 rounded"
                  aria-label="Browse K53 images and tools"
                >
                  Images
                </Link>
                <Link
                  to="/progress"
                  className="text-slate-400 hover:text-white text-xs font-normal transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-800 rounded"
                  aria-label="View progress and results"
                >
                  Results
                </Link>
                <Link
                  to="/pricing"
                  className="text-slate-400 hover:text-white text-xs font-normal transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-800 rounded"
                  aria-label="Premium access options"
                >
                  Premium
                </Link>
                <Link
                  to="/dltc"
                  className="text-slate-400 hover:text-white text-xs font-normal transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-800 rounded"
                  aria-label="Find testing centers"
                >
                  Centers
                </Link>
                <Link
                  to="/docs"
                  className="text-slate-400 hover:text-white text-xs font-normal transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-800 rounded"
                  aria-label="Platform documentation"
                >
                  Docs
                </Link>
                <Link
                  to="/blog"
                  className="text-slate-400 hover:text-white text-xs font-normal transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-800 rounded"
                  aria-label="Blog articles"
                >
                  Blog
                </Link>
                <a
                  href="https://taxfy.co.za"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-500 hover:text-slate-400 text-xs font-normal transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-800 rounded"
                  aria-label="Tax services (opens in new tab)"
                >
                  Tax
                </a>
              </nav>

              <div className="flex items-center space-x-2 border-l border-black pl-4">
                {user ? (
                  <>
                    <Button
                      asChild
                      variant="ghost"
                      size="icon"
                      className="text-slate-300 hover:text-white hover:bg-slate-700 transition-all duration-200 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-800"
                      aria-label="User profile"
                    >
                      <Link to="/profile">
                        <User className="h-5 w-5" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={signOut}
                      className="text-slate-300 hover:text-white hover:bg-slate-700 transition-all duration-200 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-800"
                      aria-label="Sign out"
                    >
                      <LogOut className="h-5 w-5" />
                    </Button>
                  </>
                ) : (
                  <Button
                    asChild
                    variant="ghost"
                    className="text-slate-300 hover:text-white hover:bg-slate-700 font-medium text-sm uppercase tracking-wide transition-all duration-200 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-800"
                    aria-label="Sign in to access practice"
                  >
                    <Link to="/practice">
                      <User className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Sign In</span>
                      <span className="sm:hidden">Sign In</span>
                    </Link>
                  </Button>
                )}

                {/* Mobile Navigation Component */}
                <MobileNavigation
                  isOpen={mobileMenuOpen}
                  onToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
                  onClose={() => setMobileMenuOpen(false)}
                />
              </div>
            </div>


          </div>
        </header>

        {/* Hero Section */}
        <section className="bg-slate-900 py-12 sm:py-20" aria-labelledby="hero-heading">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              {/* Official Header */}
              <div className="bg-slate-800 border border-black p-6 sm:p-12 mb-8 sm:mb-12 transition-all duration-300 hover:shadow-lg">
                <div className="max-w-4xl">
                  <div className="flex items-center mb-4 sm:mb-6">
                    <div className="w-1 sm:w-2 h-12 sm:h-16 bg-white mr-4 sm:mr-6 transition-all duration-300"></div>
                    <div>
                      <div className="flex items-center space-x-3 mb-2 sm:mb-3">
                        <Badge className="bg-slate-700 text-white border-0 text-xs sm:text-sm transition-all duration-200 hover:bg-slate-600">
                          DEPARTMENT OF TRANSPORT
                        </Badge>
                      </div>
                      <h1 id="hero-heading" className="text-2xl sm:text-4xl md:text-5xl font-bold mb-2 tracking-tight text-white transition-all duration-300">
                        OFFICIAL K53 LEARNER'S LICENSE
                      </h1>
                      <h2 className="text-lg sm:text-2xl md:text-3xl text-slate-300 font-normal transition-all duration-300">
                        Digital Assessment Platform
                      </h2>
                    </div>
                  </div>
                  <p className="text-base sm:text-xl text-slate-300 leading-relaxed max-w-3xl transition-all duration-300">
                    Authorized digital examination platform in accordance with
                    the National Road Traffic Act. Comprehensive assessment
                    preparation covering all mandatory testing categories as
                    prescribed by the Department of Transport.
                  </p>
                </div>
              </div>

              {/* Access Information */}
              <div className="bg-slate-800 border border-black p-6 sm:p-8 mb-6 sm:mb-8 transition-all duration-300 hover:shadow-lg">
                <div className="max-w-4xl mx-auto text-center">
                  <div className="bg-slate-700 border border-black p-3 sm:p-4 mb-4 sm:mb-6 transition-all duration-200 hover:bg-slate-600">
                    <div className="text-xs text-white uppercase tracking-wide mb-1">
                      Limited time offer
                    </div>
                    <div className="text-xs sm:text-sm text-slate-300">
                      New users receive enhanced practice access for R29/month
                      during first enrollment period
                    </div>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-white">
                    Assessment Access Categories
                  </h2>
                  <p className="text-sm sm:text-base text-slate-300 mb-4 sm:mb-6">
                    Official assessments (64 questions) and practice assessments
                    (12 questions) are free and unlimited for all users.
                    Scenario-based practice: 5 scenarios daily at no cost.
                    Enhanced scenario access available through certified premium
                    tiers.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link to="/practice">
                      <Button
                        className="bg-slate-600 text-white hover:bg-slate-500 font-medium transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-800"
                        aria-label="Begin practice assessment"
                      >
                        Begin practice assessment
                      </Button>
                    </Link>
                    <Button
                      asChild
                      variant="outline"
                      className="border-black text-slate-300 hover:bg-slate-700 hover:text-white transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-800"
                      aria-label="View premium access options"
                    >
                      <Link to="/pricing">Premium access options</Link>
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16">
                {/* Assessment Portal */}
                <div className="bg-slate-800 border border-black text-white transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group">
                  <div className="bg-slate-700 p-4 sm:p-6 transition-all duration-200 group-hover:bg-slate-600">
                    <h3 className="text-lg sm:text-xl font-bold mb-2 uppercase tracking-wide">
                      Assessment Portal
                    </h3>
                    <p className="text-slate-300 text-xs sm:text-sm">
                      Official Department of Transport Platform
                    </p>
                  </div>
                  <div className="p-6 sm:p-8">
                    <p className="text-sm sm:text-base text-slate-300 mb-4 sm:mb-6">
                      Access comprehensive practice examinations aligned with
                      current K53 regulations and assessment criteria.
                    </p>
                    <Button
                      asChild
                      size="lg"
                      className="bg-slate-600 text-white hover:bg-slate-500 font-medium uppercase tracking-wide w-full transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-800"
                      aria-label="Begin assessment practice"
                    >
                      <Link to="/practice">Begin Assessment</Link>
                    </Button>
                  </div>
                </div>

                {/* Testing Centers */}
                <div className="bg-slate-800 border border-black text-white transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group">
                  <div className="bg-slate-700 p-4 sm:p-6 transition-all duration-200 group-hover:bg-slate-600">
                    <h3 className="text-lg sm:text-xl font-bold mb-2 uppercase tracking-wide">
                      Testing Center Directory
                    </h3>
                    <p className="text-slate-300 text-xs sm:text-sm">
                      Authorized DLTC Facilities
                    </p>
                  </div>
                  <div className="p-6 sm:p-8">
                    <p className="text-sm sm:text-base text-slate-300 mb-4 sm:mb-6">
                      Locate authorized DLTC examination centers and schedule
                      your official learner's license test.
                    </p>
                    <Button
                      asChild
                      variant="outline"
                      size="lg"
                      className="border-black text-slate-300 hover:bg-slate-700 hover:text-white font-medium uppercase tracking-wide w-full transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-800"
                      aria-label="Find testing centers"
                    >
                      <Link to="/dltc">Find Centers</Link>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Platform Statistics */}
              <div className="bg-slate-800 border border-black p-6 sm:p-8 transition-all duration-300 hover:shadow-lg">
                <h3 className="text-center text-base sm:text-lg font-bold uppercase tracking-wide text-white mb-6 sm:mb-8">
                  Platform Statistics
                </h3>
                {loading ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="text-center border-r border-black last:border-r-0">
                        <div className="text-2xl sm:text-4xl font-bold text-white mb-2 animate-pulse">
                          <div className="h-8 sm:h-12 bg-slate-700 rounded transition-all duration-300"></div>
                        </div>
                        <div className="text-xs sm:text-sm text-slate-400 uppercase tracking-wide font-medium">
                          <div className="h-3 sm:h-4 bg-slate-700 rounded animate-pulse transition-all duration-300"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
                    <div className="text-center border-r border-black last:border-r-0 transition-all duration-300 hover:scale-105">
                      <div className="text-2xl sm:text-4xl font-bold text-white mb-2">
                        {stats ? `${stats.totalQuestions + stats.totalScenarios}+` : "0+"}
                      </div>
                      <div className="text-xs sm:text-sm text-slate-400 uppercase tracking-wide font-medium">
                        Assessment Items
                      </div>
                    </div>
                    <div className="text-center border-r border-black last:border-r-0 transition-all duration-300 hover:scale-105">
                      <div className="text-2xl sm:text-4xl font-bold text-white mb-2">
                        {stats?.successRate || 0}%
                      </div>
                      <div className="text-xs sm:text-sm text-slate-400 uppercase tracking-wide font-medium">
                        Success Rate
                      </div>
                    </div>
                    <div className="text-center border-r border-black last:border-r-0 transition-all duration-300 hover:scale-105">
                      <div className="text-2xl sm:text-4xl font-bold text-white mb-2">
                        {stats?.languages || 1}
                      </div>
                      <div className="text-xs sm:text-sm text-slate-400 uppercase tracking-wide font-medium">
                        Languages
                      </div>
                    </div>
                    <div className="text-center transition-all duration-300 hover:scale-105">
                      <div className="text-2xl sm:text-4xl font-bold text-white mb-2">
                        {stats?.testCenters || 0}
                      </div>
                      <div className="text-xs sm:text-sm text-slate-400 uppercase tracking-wide font-medium">
                        Test Centers
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Assessment Categories */}
        <section className="py-12 sm:py-20 bg-slate-900" aria-labelledby="categories-heading">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="mb-8 sm:mb-12">
                <h2 id="categories-heading" className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4 uppercase tracking-wide">
                  Official Assessment Categories
                </h2>
                <p className="text-base sm:text-lg text-slate-300 max-w-3xl">
                  Complete assessment preparation covering all mandatory
                  examination sections as prescribed by the Department of
                  Transport.
                </p>
              </div>

              <div className="bg-slate-800 border border-black transition-all duration-300 hover:shadow-lg">
                <div className="bg-slate-700 p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold uppercase tracking-wide text-white mb-2 sm:mb-3">
                    K53 Examination Structure
                  </h3>
                  <div className="bg-slate-600 text-white p-2 text-center transition-all duration-200 hover:bg-slate-500">
                    <div className="text-xs sm:text-sm font-bold uppercase tracking-wide">
                      Free and unlimited for all users
                    </div>
                  </div>
                </div>

                <div className="divide-y divide-slate-700">
                  <div className="p-4 sm:p-6 hover:bg-slate-750 transition-all duration-300 group">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-start sm:items-center space-x-4 sm:space-x-6">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-700 border border-black flex items-center justify-center transition-all duration-200 group-hover:bg-slate-600 flex-shrink-0">
                          <Settings className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wide">
                            Vehicle Controls
                          </h4>
                          <p className="text-sm sm:text-base text-slate-300 mt-1">
                            Assessment of clutch operation, steering mechanisms,
                            braking systems, and indicator controls
                          </p>
                          <div className="mt-2 text-xs sm:text-sm text-slate-400">
                            8 Questions • Minimum Pass: 6/8 (75%)
                          </div>
                          <div className="mt-2 bg-slate-600 text-white px-2 py-1 text-xs font-bold uppercase tracking-wide inline-block transition-all duration-200 hover:bg-slate-500">
                            Free unlimited
                          </div>
                        </div>
                      </div>
                      <div className="sm:text-right">
                        <Button
                          asChild
                          className="bg-slate-600 text-white hover:bg-slate-500 font-medium uppercase tracking-wide transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-800 w-full sm:w-auto"
                          aria-label="Begin vehicle controls module"
                        >
                          <Link to="/practice">Begin Module</Link>
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 sm:p-6 hover:bg-slate-750 transition-all duration-300 group">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-start sm:items-center space-x-4 sm:space-x-6">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-700 border border-black flex items-center justify-center transition-all duration-200 group-hover:bg-slate-600 flex-shrink-0">
                          <Layers className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wide">
                            Road Signs & Markings
                          </h4>
                          <p className="text-sm sm:text-base text-slate-300 mt-1">
                            Regulatory signs, warning indicators, prohibition
                            notices, and road surface markings
                          </p>
                          <div className="mt-2 text-xs sm:text-sm text-slate-400">
                            28 Questions • Minimum Pass: 23/28 (82%)
                          </div>
                          <div className="mt-2 bg-slate-600 text-white px-2 py-1 text-xs font-bold uppercase tracking-wide inline-block transition-all duration-200 hover:bg-slate-500">
                            Free unlimited
                          </div>
                        </div>
                      </div>
                      <div className="sm:text-right">
                        <Button
                          asChild
                          className="bg-slate-600 text-white hover:bg-slate-500 font-medium uppercase tracking-wide transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-800 w-full sm:w-auto"
                          aria-label="Begin road signs and markings module"
                        >
                          <Link to="/practice">Begin Module</Link>
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 sm:p-6 hover:bg-slate-750 transition-all duration-300 group">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-start sm:items-center space-x-4 sm:space-x-6">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-700 border border-black flex items-center justify-center transition-all duration-200 group-hover:bg-slate-600 flex-shrink-0">
                          <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wide">
                            Traffic Regulations
                          </h4>
                          <p className="text-sm sm:text-base text-slate-300 mt-1">
                            Speed limitations, following distances, parking
                            regulations, and traffic law compliance
                          </p>
                          <div className="mt-2 text-xs sm:text-sm text-slate-400">
                            28 Questions • Minimum Pass: 22/28 (79%)
                          </div>
                          <div className="mt-2 bg-slate-600 text-white px-2 py-1 text-xs font-bold uppercase tracking-wide inline-block transition-all duration-200 hover:bg-slate-500">
                            Free unlimited
                          </div>
                        </div>
                      </div>
                      <div className="sm:text-right">
                        <Button
                          asChild
                          className="bg-slate-600 text-white hover:bg-slate-500 font-medium uppercase tracking-wide transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-800 w-full sm:w-auto"
                          aria-label="Begin traffic regulations module"
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
        <section className="py-12 sm:py-20 bg-slate-900" aria-labelledby="features-heading">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="mb-8 sm:mb-12">
                <h2 id="features-heading" className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4 uppercase tracking-wide">
                  Platform Capabilities
                </h2>
                <p className="text-base sm:text-lg text-slate-300 max-w-3xl">
                  Assessment platform features designed in accordance with
                  Department of Transport standards.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                <div className="bg-slate-800 border border-black p-4 sm:p-6 hover:bg-slate-750 transition-all duration-300 hover:scale-[1.02] group">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-700 border border-black flex items-center justify-center mx-auto mb-4 sm:mb-6 transition-all duration-200 group-hover:bg-slate-600">
                    <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white mb-2 sm:mb-3 uppercase tracking-wide text-center">
                    Certified Content
                  </h3>
                  <p className="text-sm sm:text-base text-slate-300 text-center leading-relaxed">
                    Assessment items based on official K53 learner's license
                    curriculum as prescribed by the Department of Transport
                  </p>
                </div>

                <div className="bg-slate-800 border border-black p-4 sm:p-6 hover:bg-slate-750 transition-all duration-300 hover:scale-[1.02] group">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-700 border border-black flex items-center justify-center mx-auto mb-4 sm:mb-6 transition-all duration-200 group-hover:bg-slate-600">
                    <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white mb-2 sm:mb-3 uppercase tracking-wide text-center">
                    Immediate Evaluation
                  </h3>
                  <p className="text-sm sm:text-base text-slate-300 text-center leading-relaxed">
                    Real-time assessment scoring with comprehensive explanatory
                    feedback for all examination items
                  </p>
                </div>

                <div className="bg-slate-800 border border-black p-4 sm:p-6 hover:bg-slate-750 transition-all duration-300 hover:scale-[1.02] group">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-700 border border-black flex items-center justify-center mx-auto mb-4 sm:mb-6 transition-all duration-200 group-hover:bg-slate-600">
                    <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white mb-2 sm:mb-3 uppercase tracking-wide text-center">
                    Performance Analytics
                  </h3>
                  <p className="text-sm sm:text-base text-slate-300 text-center leading-relaxed">
                    Advanced tracking and analysis of assessment performance
                    across all mandatory categories
                  </p>
                </div>

                <div className="bg-slate-800 border border-black p-4 sm:p-6 hover:bg-slate-750 transition-all duration-300 hover:scale-[1.02] group">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-700 border border-black flex items-center justify-center mx-auto mb-4 sm:mb-6 transition-all duration-200 group-hover:bg-slate-600">
                    <MapIcon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white mb-2 sm:mb-3 uppercase tracking-wide text-center">
                    Center Directory
                  </h3>
                  <p className="text-sm sm:text-base text-slate-300 text-center leading-relaxed">
                    Comprehensive database of authorized DLTC testing facilities
                    with contact information
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Authorization Section */}
        <section className="py-12 sm:py-20 bg-slate-800" aria-labelledby="authorization-heading">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto">
              <div className="w-1 sm:w-2 h-12 sm:h-16 bg-white mx-auto mb-6 sm:mb-8 transition-all duration-300"></div>
              <h2 id="authorization-heading" className="text-2xl sm:text-4xl font-bold text-white mb-4 sm:mb-6 uppercase tracking-wide">
                Authorized Assessment Platform
              </h2>
              <p className="text-base sm:text-xl text-slate-300 mb-8 sm:mb-10 leading-relaxed">
                Thousands of South African citizens have successfully obtained
                their learner's licenses through this official Department of
                Transport certified preparation system.
              </p>
              <div className="grid md:grid-cols-2 gap-4 sm:gap-6 max-w-2xl mx-auto">
                <Button
                  asChild
                  size="lg"
                  className="bg-slate-600 text-white hover:bg-slate-500 font-medium uppercase tracking-wide py-3 sm:py-4 text-base sm:text-lg transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-800"
                  aria-label="Begin assessment preparation"
                >
                  <Link to="/practice">Begin Assessment Preparation</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-black text-slate-300 hover:bg-slate-700 hover:text-white font-medium uppercase tracking-wide py-3 sm:py-4 text-base sm:text-lg transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-800"
                  aria-label="Locate testing centers"
                >
                  <Link to="/dltc">Locate Testing Centers</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-slate-800 text-white py-12 sm:py-16 border-t border-black" role="contentinfo">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-6 sm:gap-8">
              <div>
                <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-700 border border-black flex items-center justify-center transition-all duration-200 hover:bg-slate-600">
                    <div className="text-white font-bold text-sm sm:text-lg tracking-wider">
                      K53
                    </div>
                  </div>
                  <div className="border-l border-black pl-3 sm:pl-4">
                    <div className="font-bold text-white uppercase tracking-wide text-sm sm:text-base">
                      Assessment Portal
                    </div>
                    <div className="text-slate-400 text-xs uppercase tracking-wide">
                      Republic of South Africa
                    </div>
                  </div>
                </div>
                <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                  Official Department of Transport certified K53 learner's
                  license examination preparation system.
                </p>
              </div>

              <div>
                <h4 className="font-bold mb-4 sm:mb-6 uppercase tracking-wide text-white text-sm sm:text-base">
                  Assessment Categories
                </h4>
                <div className="space-y-2 sm:space-y-3 text-slate-400">
                  <Link
                    to="/practice"
                    className="block hover:text-white transition-all duration-200 uppercase tracking-wide text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-800 rounded"
                    aria-label="Practice vehicle controls"
                  >
                    Vehicle Controls
                  </Link>
                  <Link
                    to="/practice"
                    className="block hover:text-white transition-all duration-200 uppercase tracking-wide text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-800 rounded"
                    aria-label="Practice road signs and markings"
                  >
                    Road Signs & Markings
                  </Link>
                  <Link
                    to="/practice"
                    className="block hover:text-white transition-all duration-200 uppercase tracking-wide text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-800 rounded"
                    aria-label="Practice traffic regulations"
                  >
                    Traffic Regulations
                  </Link>
                </div>
              </div>

              <div>
                <h4 className="font-bold mb-4 sm:mb-6 uppercase tracking-wide text-white text-sm sm:text-base">
                  Platform Resources
                </h4>
                <div className="space-y-2 sm:space-y-3 text-slate-400">
                  <Link
                    to="/progress"
                    className="block hover:text-white transition-all duration-200 uppercase tracking-wide text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-800 rounded"
                    aria-label="View performance analytics"
                  >
                    Performance Analytics
                  </Link>
                  <Link
                    to="/dltc"
                    className="block hover:text-white transition-all duration-200 uppercase tracking-wide text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-800 rounded"
                    aria-label="Find testing center directory"
                  >
                    Testing Center Directory
                  </Link>
                  <Link
                    to="/docs"
                    className="block hover:text-white transition-all duration-200 uppercase tracking-wide text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-800 rounded"
                    aria-label="View platform documentation"
                  >
                    Platform Documentation
                  </Link>
                  <a
                    href="https://taxfy.co.za"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block hover:text-white transition-all duration-200 uppercase tracking-wide text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-800 rounded"
                    aria-label="Tax services portal (opens in new tab)"
                  >
                    Tax Services Portal
                  </a>
                  <a
                    href="https://burbgigz.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block hover:text-white transition-all duration-200 uppercase tracking-wide text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-800 rounded"
                    aria-label="IT services portal (opens in new tab)"
                  >
                    IT Services
                  </a>
                  <a
                    href="https://neurolint.dev/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block hover:text-white transition-all duration-200 uppercase tracking-wide text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-800 rounded"
                    aria-label="Development services (opens in new tab)"
                  >
                    Development Services
                  </a>
                  <a
                    href="https://dealeeoo.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block hover:text-white transition-all duration-200 uppercase tracking-wide text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-800 rounded"
                    aria-label="Deal creation platform (opens in new tab)"
                  >
                    Deal Creation Platform
                  </a>
                </div>
              </div>

              <div>
                <h4 className="font-bold mb-4 sm:mb-6 uppercase tracking-wide text-white text-sm sm:text-base">
                  Official Support
                </h4>
                <div className="space-y-2 sm:space-y-3 text-slate-400">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <Phone className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="text-xs sm:text-sm">Support Line: 0800 123 456</span>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="text-xs sm:text-sm">
                      {stats ? `${stats.totalUsers.toLocaleString()}+` : "0+"} Citizens Assisted
                    </span>
                  </div>
                  <div className="bg-slate-700 border border-black p-2 sm:p-3 mt-3 sm:mt-4 transition-all duration-200 hover:bg-slate-600">
                    <div className="text-xs text-slate-300 uppercase tracking-wide">
                      Official Platform
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-black mt-8 sm:mt-12 pt-6 sm:pt-8">
              <div className="text-center text-slate-400">
                <p className="text-xs sm:text-sm uppercase tracking-wide">
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
    </AccessibilityEnhancer>
  );
}
