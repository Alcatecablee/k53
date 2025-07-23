import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Check,
  Star,
  MapPin,
  Zap,
  Users,
  Crown,
  CheckCircle,
  AlertCircle,
  Info,
  Calculator,
  ChevronDown,
  ChevronUp,
  Target,
  Clock,
  Shield,
  Gauge,
} from "lucide-react";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { SEO_CONFIGS } from "@/hooks/useSEO";
import { useAuth } from "@/contexts/AuthContext";
import { AuthenticatedRoute } from "@/components/AuthenticatedRoute";
import { SUBSCRIPTION_PLANS, SCENARIO_PACKS } from "@/types/subscription";
import {
  getUserSubscription,
  canAccessScenarios,
  formatPrice,
} from "@/services/subscriptionService";
import { PayPalCheckout } from "@/components/PayPalCheckout";
import { SOUTH_AFRICAN_LOCATIONS, type UserLocation } from "@/services/locationService";

// Feature explanations for tooltips
const FEATURE_EXPLANATIONS = {
  "Unlimited official assessments (64 questions)": "Complete K53 learner's license test simulations with all 64 questions as per Department of Transport standards",
  "Unlimited practice assessments (12 questions)": "Quick practice sessions to test specific knowledge areas and track improvement",
  "5 scenarios per day": "Daily allocation of realistic driving scenarios for practical application",
  "15 scenarios per day": "Enhanced daily allocation for more comprehensive practice",
  "Unlimited scenarios": "Access to all 226+ driving scenarios without daily limits",
  "Basic progress tracking": "View your scores and completion rates across different categories",
  "Enhanced progress tracking": "Detailed analytics with performance trends and improvement recommendations",
  "Advanced progress tracking": "Comprehensive analytics with detailed breakdowns by category, difficulty, and time",
  "Location-aware scenarios": "Basic location matching for relevant driving scenarios",
  "Location-specific content": "Enhanced location targeting with regional driving challenges and local landmarks",
  "Standard explanations": "Basic explanations for correct and incorrect answers",
  "Detailed explanations": "Comprehensive explanations with references to K53 regulations and best practices",
  "Mock K53 tests": "Full-length simulated K53 examinations under test conditions",
  "All scenario packs included": "Access to all regional scenario collections without additional cost",
  "Offline access capability": "Download scenarios and assessments for practice without internet connection",
  "Advanced performance analytics": "Detailed performance insights with personalized study recommendations",
  "Priority technical support": "Fast-track support with dedicated assistance for technical issues",
  "Personalized study recommendations": "AI-powered study plans based on your performance patterns and weak areas",
};

function PricingComponent() {
  const { user } = useAuth();
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);
  const [usageInfo, setUsageInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<UserLocation | null>(null);
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);
  const [expandedPack, setExpandedPack] = useState<string | null>(null);
  const [calculatorValues, setCalculatorValues] = useState({
    dailyScenarios: 10,
    studyDays: 30,
  });

  useEffect(() => {
    const loadSubscriptionData = async () => {
      try {
        const [subscription, usage] = await Promise.all([
          getUserSubscription(),
          canAccessScenarios(),
        ]);

        setCurrentSubscription(subscription);
        setUsageInfo(usage);
      } catch (error) {
        console.warn("Error loading subscription data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadSubscriptionData();
    } else {
      setLoading(false);
    }
  }, []);

  const handleSubscribe = (planId: string) => {
    if (!user) {
      alert("Please sign in to subscribe");
      return;
    }
    setSelectedPlan(planId);
    setPaymentError(null);
    setPaymentSuccess(null);
  };

  const handlePaymentSuccess = async (details: any) => {
    console.log("Payment successful:", details);
    setPaymentSuccess(
      `Payment successful! Your ${details.planId} subscription is now active.`,
    );
    setSelectedPlan(null);

    // Refresh subscription data
    try {
      const [subscription, usage] = await Promise.all([
        getUserSubscription(),
        canAccessScenarios(),
      ]);
      setCurrentSubscription(subscription);
      setUsageInfo(usage);
    } catch (error) {
      console.warn("Error refreshing subscription data:", error);
    }
  };

  const handlePaymentError = (error: any) => {
    console.error("Payment error:", error);
    setPaymentError("Payment failed. Please try again or contact support.");
    setSelectedPlan(null);
  };

  const handlePaymentCancel = () => {
    setSelectedPlan(null);
  };

  const handleBuyPack = (packName: string, price: number) => {
    alert(
      `Purchasing individual scenario packs will be available soon. For now, subscribe to SuperK53 Premium to get all packs included!`,
    );
  };

  // Calculate value for different plans
  const calculateValue = (plan: any) => {
    const { dailyScenarios, studyDays } = calculatorValues;
    const totalScenarios = plan.max_scenarios_per_day === -1 
      ? dailyScenarios * studyDays 
      : Math.min(plan.max_scenarios_per_day * studyDays, dailyScenarios * studyDays);
    
    const costPerScenario = plan.price_cents > 0 ? plan.price_cents / 100 / totalScenarios : 0;
    return { totalScenarios, costPerScenario };
  };

  // Get location-specific scenarios count
  const getLocationScenarios = (location: UserLocation) => {
    const locationPacks = SCENARIO_PACKS.filter(pack => 
      pack.location_region === location.region || 
      pack.location_city === location.city
    );
    return locationPacks.reduce((total, pack) => total + pack.scenario_count, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-semibold uppercase tracking-wide">
            Loading Pricing...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO {...SEO_CONFIGS.pricing} />
      <div className="min-h-screen bg-slate-900">
        {/* Header */}
        <div className="bg-slate-800 border-b border-black mb-8">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <Button
                asChild
                variant="ghost"
                className="text-slate-300 hover:text-white font-medium uppercase tracking-wide"
              >
                <Link to="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Return to portal
                </Link>
              </Button>

              <div className="text-center">
                <h1 className="text-2xl font-bold text-white uppercase tracking-wide">
                  Subscription access tiers
                </h1>
                <p className="text-slate-400 uppercase text-sm tracking-wide">
                  Department of transport certified preparation
                </p>
              </div>

              <div className="flex items-center space-x-2">
                {user && currentSubscription && (
                  <Badge className="bg-slate-700 text-white border border-black">
                    Current: {currentSubscription.plan_type.toUpperCase()}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Success/Error Messages */}
          {paymentSuccess && (
            <Card className="border-2 border-slate-600 bg-slate-800 mb-8 max-w-2xl mx-auto">
              <CardContent className="p-6 text-center">
                <CheckCircle className="h-8 w-8 text-slate-300 mx-auto mb-3" />
                <h3 className="font-bold text-slate-200 mb-2">
                  Payment Successful!
                </h3>
                <p className="text-slate-300">{paymentSuccess}</p>
              </CardContent>
            </Card>
          )}

          {paymentError && (
            <Card className="border border-black bg-slate-800 mb-8 max-w-2xl mx-auto">
              <CardContent className="p-6 text-center">
                <AlertCircle className="h-8 w-8 text-white mx-auto mb-3" />
                <h3 className="font-bold text-white mb-2 uppercase tracking-wide">
                  Payment processing failed
                </h3>
                <p className="text-slate-300">{paymentError}</p>
              </CardContent>
            </Card>
          )}

          {/* Current Usage (for free users) */}
          {user && !usageInfo?.isSubscribed && (
            <Card className="border border-black bg-slate-800 mb-8 max-w-2xl mx-auto">
              <CardContent className="p-6 text-center">
                <div className="bg-slate-700 border border-black p-3 mb-4">
                  <h3 className="font-bold text-white uppercase tracking-wide">
                    Daily allocation status
                  </h3>
                </div>
                <p className="text-slate-300 mb-2">
                  Current remaining allocation:{" "}
                  <span className="font-bold text-white">
                    {usageInfo?.remaining || 0} scenarios
                  </span>
                </p>
                <p className="text-sm text-slate-400 uppercase tracking-wide">
                  Enhanced access available through premium subscription tiers
                </p>
              </CardContent>
            </Card>
          )}

          {/* Value Calculator */}
          <Card className="border border-black bg-slate-800 mb-8 max-w-4xl mx-auto">
            <CardHeader className="bg-slate-700 border-b border-black">
              <CardTitle className="flex items-center text-white uppercase tracking-wide">
                <Calculator className="h-5 w-5 mr-2" />
                Value Calculator
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2 uppercase tracking-wide">
                    Daily Scenarios Target
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    value={calculatorValues.dailyScenarios}
                    onChange={(e) => setCalculatorValues(prev => ({
                      ...prev,
                      dailyScenarios: parseInt(e.target.value)
                    }))}
                    className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="text-center mt-2">
                    <span className="text-white font-bold text-xl">{calculatorValues.dailyScenarios}</span>
                    <span className="text-slate-400 text-sm"> scenarios/day</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2 uppercase tracking-wide">
                    Study Period (Days)
                  </label>
                  <input
                    type="range"
                    min="7"
                    max="90"
                    value={calculatorValues.studyDays}
                    onChange={(e) => setCalculatorValues(prev => ({
                      ...prev,
                      studyDays: parseInt(e.target.value)
                    }))}
                    className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="text-center mt-2">
                    <span className="text-white font-bold text-xl">{calculatorValues.studyDays}</span>
                    <span className="text-slate-400 text-sm"> days</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Choose Your Location Section */}
          <Card className="border border-black bg-slate-800 mb-8 max-w-6xl mx-auto">
            <CardHeader className="bg-slate-700 border-b border-black">
              <CardTitle className="flex items-center text-white uppercase tracking-wide">
                <MapPin className="h-5 w-5 mr-2" />
                Choose Your Location for Targeted Content
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-slate-300 mb-6">
                Select your region to see how our location-specific scenarios will enhance your K53 preparation
              </p>
              
              <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                {SOUTH_AFRICAN_LOCATIONS.slice(0, 12).map((location) => (
                  <button
                    key={`${location.city}-${location.region}`}
                    onClick={() => setSelectedLocation(location)}
                    className={`p-3 border border-black text-left transition-colors ${
                      selectedLocation?.city === location.city
                        ? "bg-white text-slate-900"
                        : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                    }`}
                  >
                    <div className="font-medium text-sm uppercase tracking-wide">
                      {location.city}
                    </div>
                    <div className="text-xs opacity-75">
                      {location.region}
                    </div>
                  </button>
                ))}
              </div>

              {selectedLocation && (
                <Card className="bg-slate-700 border border-black">
                  <CardContent className="p-4">
                    <h4 className="text-white font-bold uppercase tracking-wide mb-2">
                      Location-Specific Content for {selectedLocation.city}
                    </h4>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Target className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-300">
                          {getLocationScenarios(selectedLocation)} targeted scenarios
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Shield className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-300">
                          Regional safety considerations
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Gauge className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-300">
                          Local traffic patterns
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>

          {/* Comparison Toggle */}
          <div className="text-center mb-8">
            <Button
              onClick={() => setShowComparison(!showComparison)}
              variant="outline"
              className="border border-black text-slate-300 hover:bg-slate-700 hover:text-white font-medium uppercase tracking-wide"
            >
              {showComparison ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-2" />
                  Hide Comparison Table
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-2" />
                  Show Detailed Comparison
                </>
              )}
            </Button>
          </div>

          {/* Detailed Comparison Table */}
          {showComparison && (
            <Card className="border border-black bg-slate-800 mb-8 max-w-6xl mx-auto overflow-hidden">
              <CardHeader className="bg-slate-700 border-b border-black">
                <CardTitle className="text-white uppercase tracking-wide text-center">
                  Feature Comparison
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-black">
                        <th className="text-left p-4 bg-slate-700 text-white font-medium uppercase tracking-wide">
                          Features
                        </th>
                        {SUBSCRIPTION_PLANS.map((plan) => (
                          <th key={plan.id} className="text-center p-4 bg-slate-700 text-white font-medium uppercase tracking-wide">
                            {plan.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {/* Extract unique features for comparison */}
                      {Array.from(new Set(SUBSCRIPTION_PLANS.flatMap(plan => plan.features))).map((feature, index) => (
                        <tr key={index} className="border-b border-slate-600">
                          <td className="p-4 text-slate-300 text-sm font-medium">
                            {feature}
                          </td>
                          {SUBSCRIPTION_PLANS.map((plan) => (
                            <td key={plan.id} className="text-center p-4">
                              {plan.features.includes(feature) ? (
                                <Check className="h-4 w-4 text-white mx-auto" />
                              ) : (
                                <span className="text-slate-600">-</span>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                      
                      {/* Value calculation row */}
                      <tr className="border-b border-slate-600 bg-slate-750">
                        <td className="p-4 text-white font-bold uppercase tracking-wide">
                          Cost per scenario (based on calculator)
                        </td>
                        {SUBSCRIPTION_PLANS.map((plan) => {
                          const { costPerScenario } = calculateValue(plan);
                          return (
                            <td key={plan.id} className="text-center p-4">
                              <span className="text-white font-bold">
                                {costPerScenario > 0 ? `R${costPerScenario.toFixed(2)}` : "Free"}
                              </span>
                            </td>
                          );
                        })}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Subscription Plans */}
          <div className="max-w-6xl mx-auto mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4 uppercase tracking-wide">
                Premium access tiers
              </h2>
              <p className="text-slate-300 max-w-2xl mx-auto">
                Authorized subscription plans for enhanced K53 learner's license
                preparation. All tiers include location-specific scenarios
                certified for South African driving assessment standards.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {SUBSCRIPTION_PLANS.map((plan) => {
                const { totalScenarios, costPerScenario } = calculateValue(plan);
                return (
                  <Card
                    key={plan.id}
                    className={`border relative transition-all duration-300 hover:shadow-lg ${
                      plan.popular
                        ? "border-white bg-slate-700 shadow-md"
                        : "border-black bg-slate-800 hover:border-slate-600"
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-white text-slate-900 border border-black px-4 py-1 font-bold uppercase tracking-wide">
                          Recommended tier
                        </Badge>
                      </div>
                    )}

                    <CardHeader
                      className={`text-center ${
                        plan.popular ? "bg-slate-600" : "bg-slate-700"
                      } border-b border-black p-6`}
                    >
                      <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-slate-800 border border-black text-white">
                        {plan.id === "free" && <Zap className="h-8 w-8" />}
                        {(plan.id === "light" || plan.id === "basic") && (
                          <Users className="h-8 w-8" />
                        )}
                        {plan.id === "pro" && <Crown className="h-8 w-8" />}
                      </div>
                      <CardTitle className="text-xl font-bold text-white mb-2 uppercase tracking-wide">
                        {plan.name}
                      </CardTitle>
                      <p className="text-slate-300 text-sm mb-4">
                        {plan.description}
                      </p>
                      <div className="text-4xl font-bold text-white">
                        {formatPrice(plan.price_cents)}
                        {plan.price_cents > 0 && (
                          <span className="text-lg font-normal text-slate-300">
                            /month
                          </span>
                        )}
                      </div>
                      
                      {/* Value display */}
                      <div className="mt-3 p-2 bg-slate-800 border border-black">
                        <div className="text-xs text-slate-400 uppercase tracking-wide">
                          With your settings
                        </div>
                        <div className="text-sm text-white">
                          {totalScenarios} scenarios • {costPerScenario > 0 ? `R${costPerScenario.toFixed(2)} each` : "Free"}
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="p-6">
                      <ul className="space-y-3 mb-6">
                        {plan.features.map((feature, index) => (
                          <li 
                            key={index} 
                            className="flex items-center space-x-3 relative"
                            onMouseEnter={() => setHoveredFeature(feature)}
                            onMouseLeave={() => setHoveredFeature(null)}
                          >
                            <Check className="h-4 w-4 text-white flex-shrink-0" />
                            <span className="text-slate-300 text-sm flex items-center">
                              {feature}
                              {FEATURE_EXPLANATIONS[feature] && (
                                <Info className="h-3 w-3 ml-1 text-slate-500" />
                              )}
                            </span>
                            
                            {/* Tooltip */}
                            {hoveredFeature === feature && FEATURE_EXPLANATIONS[feature] && (
                              <div className="absolute bottom-full left-0 mb-2 w-64 p-3 bg-slate-900 border border-white text-white text-xs z-50">
                                {FEATURE_EXPLANATIONS[feature]}
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>

                      <Button
                        onClick={() => handleSubscribe(plan.id)}
                        disabled={
                          currentSubscription?.plan_type === plan.id ||
                          plan.id === "free"
                        }
                        className={`w-full font-medium uppercase tracking-wide transition-all duration-300 ${
                          plan.popular
                            ? "bg-white text-slate-900 hover:bg-slate-100 hover:scale-105"
                            : "border border-black text-slate-300 hover:bg-slate-700 hover:text-white hover:scale-105"
                        }`}
                        variant={plan.popular ? "default" : "outline"}
                      >
                        {currentSubscription?.plan_type === plan.id
                          ? "Current Plan"
                          : plan.id === "free"
                            ? "Current Plan"
                            : "Subscribe Now"}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Enhanced Scenario Packs */}
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4 uppercase tracking-wide">
                Regional scenario collections
              </h2>
              <p className="text-slate-300 max-w-2xl mx-auto">
                Specialized driving assessment scenarios for specific South
                African regional conditions. Individually certified preparation
                modules for enhanced local area competency.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {SCENARIO_PACKS.map((pack, index) => (
                <Card
                  key={index}
                  className="border border-black bg-slate-800 hover:bg-slate-750 transition-all duration-300 hover:scale-102 hover:shadow-lg"
                >
                  <CardHeader className="bg-slate-700 border-b border-black p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-12 h-12 bg-slate-800 border border-black flex items-center justify-center">
                        <MapPin className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-right">
                        <Badge className="bg-slate-600 text-white border border-black text-xs uppercase tracking-wide mb-2">
                          {pack.scenario_count} scenarios
                        </Badge>
                        <div className="text-xs text-slate-400 uppercase tracking-wide">
                          <div>{pack.location_region}</div>
                          {pack.location_city && <div>{pack.location_city}</div>}
                        </div>
                      </div>
                    </div>
                    <CardTitle className="text-lg font-bold text-white mb-2 uppercase tracking-wide">
                      {pack.name}
                    </CardTitle>
                    <p className="text-slate-300 text-sm mb-3">
                      {pack.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-white">
                        {formatPrice(pack.price_cents)}
                      </span>
                      <Button
                        onClick={() => setExpandedPack(expandedPack === pack.name ? null : pack.name)}
                        variant="ghost"
                        size="sm"
                        className="text-slate-400 hover:text-white"
                      >
                        {expandedPack === pack.name ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </CardHeader>

                  {expandedPack === pack.name && (
                    <div className="border-b border-black bg-slate-750 p-4">
                      <h4 className="text-white font-medium text-sm uppercase tracking-wide mb-2">
                        What's Included:
                      </h4>
                      <ul className="space-y-1 text-sm text-slate-300">
                        <li className="flex items-center space-x-2">
                          <Clock className="h-3 w-3 text-slate-400" />
                          <span>Real-world scenarios from {pack.location_city || pack.location_region}</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <Target className="h-3 w-3 text-slate-400" />
                          <span>Location-specific traffic patterns</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <Shield className="h-3 w-3 text-slate-400" />
                          <span>Regional safety considerations</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <Gauge className="h-3 w-3 text-slate-400" />
                          <span>Local landmark references</span>
                        </li>
                      </ul>
                    </div>
                  )}

                  <CardContent className="p-6">
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleBuyPack(pack.name, pack.price_cents)}
                        className="flex-1 border border-black text-slate-300 hover:bg-slate-700 hover:text-white font-medium uppercase tracking-wide transition-all duration-300 hover:scale-105"
                        variant="outline"
                      >
                        Buy Pack
                      </Button>
                      <div className="text-center">
                        <div className="text-xs text-slate-400 uppercase tracking-wide">
                          Or get with
                        </div>
                        <div className="text-xs text-white font-bold">
                          Premium
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-12">
            <Card className="border-2 border-black bg-slate-800 text-white max-w-2xl mx-auto">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4 uppercase tracking-wide">
                  Ready to Master K53?
                </h3>
                <p className="text-slate-200 mb-6">
                  Join thousands of South African learners who have passed their
                  K53 test with SuperK53
                </p>
                <Button
                  asChild
                  className="bg-white text-slate-800 hover:bg-slate-100 font-semibold px-8 py-3 transition-all duration-300 hover:scale-105"
                >
                  <Link to="/practice">Start Practicing Now</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* PayPal Checkout Modal */}
          {selectedPlan && selectedPlan !== "free" && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">
                      Subscribe to{" "}
                      {
                        SUBSCRIPTION_PLANS.find((p) => p.id === selectedPlan)
                          ?.name
                      }
                    </h2>
                    <Button
                      variant="ghost"
                      onClick={() => setSelectedPlan(null)}
                      className="text-slate-600 hover:text-slate-900"
                    >
                      ✕
                    </Button>
                  </div>

                  <PayPalCheckout
                    planId={selectedPlan}
                    planName={
                      SUBSCRIPTION_PLANS.find((p) => p.id === selectedPlan)
                        ?.name || ""
                    }
                    amount={
                      SUBSCRIPTION_PLANS.find((p) => p.id === selectedPlan)
                        ?.price_cents || 0
                    }
                    currency="ZAR"
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                    onCancel={handlePaymentCancel}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default function Pricing() {
  return (
    <AuthenticatedRoute>
      <PricingComponent />
    </AuthenticatedRoute>
  );
}
