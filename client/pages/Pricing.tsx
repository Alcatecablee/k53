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
import {
  SOUTH_AFRICAN_LOCATIONS,
  type UserLocation,
} from "@/services/locationService";
import { showError, showInfo, logWarning } from "@/services/notificationService";

// Feature explanations for tooltips
const FEATURE_EXPLANATIONS = {
  "Unlimited official assessments (64 questions)":
    "Complete K53 learner's license test simulations with all 64 questions as per Department of Transport standards",
  "Unlimited practice assessments (12 questions)":
    "Quick practice sessions to test specific knowledge areas and track improvement",
  "5 scenarios per day":
    "Daily allocation of realistic driving scenarios for practical application",
  "15 scenarios per day":
    "Enhanced daily allocation for more comprehensive practice",
  "Unlimited scenarios":
    "Access to all 226+ driving scenarios without daily limits",
  "Basic progress tracking":
    "View your scores and completion rates across different categories",
  "Enhanced progress tracking":
    "Detailed analytics with performance trends and improvement recommendations",
  "Advanced progress tracking":
    "Comprehensive analytics with detailed breakdowns by category, difficulty, and time",
  "Location-aware scenarios":
    "Basic location matching for relevant driving scenarios",
  "Location-specific content":
    "Enhanced location targeting with regional driving challenges and local landmarks",
  "Standard explanations":
    "Basic explanations for correct and incorrect answers",
  "Detailed explanations":
    "Comprehensive explanations with references to K53 regulations and best practices",
  "Mock K53 tests":
    "Full-length simulated K53 examinations under test conditions",
  "All scenario packs included":
    "Access to all regional scenario collections without additional cost",
  "Offline access capability":
    "Download scenarios and assessments for practice without internet connection",
  "Advanced performance analytics":
    "Detailed performance insights with personalized study recommendations",
  "Priority technical support":
    "Fast-track support with dedicated assistance for technical issues",
  "Personalized study recommendations":
    "AI-powered study plans based on your performance patterns and weak areas",
};

function PricingComponent() {
  const { user } = useAuth();
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);
  const [usageInfo, setUsageInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [modalStep, setModalStep] = useState<"confirm" | "payment">("confirm");
  const [showComparison, setShowComparison] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<UserLocation | null>(
    null,
  );
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);
  const [showLocationSelector, setShowLocationSelector] = useState(false);

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
      showError("Please sign in to subscribe", "Authentication Required");
      return;
    }
    setSelectedPlan(planId);
    setModalStep("confirm");
    setPaymentError(null);
    setPaymentSuccess(null);
  };

  const handlePaymentSuccess = async (details: any) => {
          // Payment successful
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
      logWarning("Error refreshing subscription data", { error, context: "handlePaymentSuccess" });
    }
  };

  const handlePaymentError = (error: any) => {
    console.error("Payment error:", error);
    setPaymentError("Payment failed. Please try again or contact support.");
    setSelectedPlan(null);
  };

  const handlePaymentCancel = () => {
    setSelectedPlan(null);
    setModalStep("confirm");
  };

  const handleBuyPack = (packName: string, price: number) => {
    showInfo(
      "Purchasing individual scenario packs will be available soon. For now, subscribe to SuperK53 Premium to get all packs included!",
      "Feature Coming Soon"
    );
  };

  // Get location-specific scenarios count
  const getLocationScenarios = (location: UserLocation) => {
    const locationPacks = SCENARIO_PACKS.filter(
      (pack) =>
        pack.location_region === location.region ||
        pack.location_city === location.city,
    );
    return locationPacks.reduce(
      (total, pack) => total + pack.scenario_count,
      0,
    );
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

          {/* Subscription Plans */}
          <div className="max-w-6xl mx-auto mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4 uppercase tracking-wide">
                Choose your preparation level
              </h2>
              <p className="text-slate-300 max-w-2xl mx-auto mb-6">
                All plans include location-specific scenarios for South African
                driving conditions. Start with Free Practice or upgrade for
                unlimited access and premium features.
              </p>

              {/* Location context banner */}
              <div className="bg-slate-800 border border-black p-4 max-w-2xl mx-auto mb-6">
                <div className="flex items-center justify-center space-x-4">
                  <MapPin className="h-5 w-5 text-slate-400" />
                  <div className="text-left">
                    <div className="text-white font-medium text-sm uppercase tracking-wide">
                      Location-Aware Content Included
                    </div>
                    <div className="text-slate-400 text-xs">
                      Scenarios automatically adapt to South African cities and
                      regions
                    </div>
                  </div>
                  <Button
                    onClick={() =>
                      setShowLocationSelector(!showLocationSelector)
                    }
                    variant="ghost"
                    size="sm"
                    className="text-slate-400 hover:text-white text-xs"
                  >
                    Learn More
                  </Button>
                </div>
              </div>
            </div>

            {/* Location selector (collapsible) */}
            {showLocationSelector && (
              <Card className="border border-black bg-slate-800 mb-8 max-w-4xl mx-auto">
                <CardHeader className="bg-slate-700 border-b border-black">
                  <CardTitle className="text-white text-center uppercase tracking-wide">
                    Location-Specific Content Examples
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-slate-300 mb-4 text-center">
                    Select a region to see how scenarios adapt to local driving
                    conditions
                  </p>

                  <div className="grid md:grid-cols-4 gap-3 mb-6">
                    {SOUTH_AFRICAN_LOCATIONS.slice(0, 8).map((location) => (
                      <button
                        key={`${location.city}-${location.region}`}
                        onClick={() => setSelectedLocation(location)}
                        className={`p-3 border border-black text-left transition-colors text-sm ${
                          selectedLocation?.city === location.city
                            ? "bg-white text-white"
                            : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                        }`}
                      >
                        <div className="font-medium uppercase tracking-wide">
                          {location.city}
                        </div>
                        <div className="text-xs opacity-75">
                          {location.region}
                        </div>
                      </button>
                    ))}
                  </div>

                  {selectedLocation && (
                    <div className="bg-slate-700 border border-black p-4 text-center">
                      <h4 className="text-white font-bold uppercase tracking-wide mb-3">
                        Content for {selectedLocation.city}
                      </h4>
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center justify-center space-x-2">
                          <Target className="h-4 w-4 text-slate-400" />
                          <span className="text-slate-300">
                            {getLocationScenarios(selectedLocation)} targeted
                            scenarios
                          </span>
                        </div>
                        <div className="flex items-center justify-center space-x-2">
                          <Shield className="h-4 w-4 text-slate-400" />
                          <span className="text-slate-300">
                            Local safety considerations
                          </span>
                        </div>
                        <div className="flex items-center justify-center space-x-2">
                          <Gauge className="h-4 w-4 text-slate-400" />
                          <span className="text-slate-300">
                            Regional traffic patterns
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {SUBSCRIPTION_PLANS.map((plan) => (
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
                      <Badge className="bg-white text-white border border-black px-4 py-1 font-bold uppercase tracking-wide">
                        Most Popular
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

                    {/* Simple value indication */}
                    {plan.price_cents > 0 && (
                      <div className="mt-3 p-2 bg-slate-800 border border-black">
                        <div className="text-xs text-slate-400 uppercase tracking-wide">
                          {plan.max_scenarios_per_day === -1
                            ? "Unlimited scenarios"
                            : `${plan.max_scenarios_per_day} scenarios/day`}
                        </div>
                        <div className="text-xs text-white">
                          {plan.max_scenarios_per_day === -1
                            ? "Best value for serious learners"
                            : `About R${(plan.price_cents / 100 / (plan.max_scenarios_per_day * 30)).toFixed(2)} per scenario`}
                        </div>
                      </div>
                    )}
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
                          {hoveredFeature === feature &&
                            FEATURE_EXPLANATIONS[feature] && (
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
                          ? "bg-white text-white hover:bg-slate-100"
                          : "border border-black text-slate-300 hover:bg-slate-700 hover:text-white"
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
              ))}
            </div>

            {/* Simple comparison toggle */}
            <div className="text-center">
              <Button
                onClick={() => setShowComparison(!showComparison)}
                variant="ghost"
                className="text-slate-400 hover:text-white font-medium uppercase tracking-wide"
              >
                {showComparison ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-2" />
                    Hide Feature Comparison
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-2" />
                    Compare All Features
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Detailed Comparison Table (collapsible) */}
          {showComparison && (
            <Card className="border border-black bg-slate-800 mb-12 max-w-6xl mx-auto overflow-hidden">
              <CardHeader className="bg-slate-700 border-b border-black">
                <CardTitle className="text-white uppercase tracking-wide text-center">
                  Complete Feature Comparison
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
                          <th
                            key={plan.id}
                            className="text-center p-4 bg-slate-700 text-white font-medium uppercase tracking-wide"
                          >
                            {plan.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from(
                        new Set(
                          SUBSCRIPTION_PLANS.flatMap((plan) => plan.features),
                        ),
                      ).map((feature, index) => (
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
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Simplified Regional Packs */}
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">
                Premium Regional Collections
              </h2>
              <p className="text-slate-300 mb-4">
                Specialized scenario packs for specific South African regions.
              </p>
              <div className="text-sm text-slate-400 uppercase tracking-wide">
                All packs included free with SuperK53 Premium
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {SCENARIO_PACKS.slice(0, 4).map((pack, index) => (
                <Card
                  key={index}
                  className="border border-black bg-slate-800 hover:bg-slate-750 transition-colors"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-white font-bold uppercase tracking-wide mb-1">
                          {pack.name}
                        </h3>
                        <p className="text-slate-300 text-sm mb-2">
                          {pack.description}
                        </p>
                        <div className="text-xs text-slate-400 uppercase tracking-wide">
                          {pack.scenario_count} scenarios •{" "}
                          {pack.location_region}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-bold text-lg">
                          {formatPrice(pack.price_cents)}
                        </div>
                        <div className="text-xs text-slate-400">
                          or included in Premium
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleBuyPack(pack.name, pack.price_cents)}
                      className="w-full border border-black text-slate-300 hover:bg-slate-700 hover:text-white font-medium uppercase tracking-wide text-sm"
                      variant="outline"
                      size="sm"
                    >
                      Buy Individual Pack
                    </Button>
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
                  className="bg-slate-600 text-white hover:bg-slate-500 font-semibold px-8 py-3 transition-all duration-300"
                >
                  <Link to="/practice">Start Practicing Now</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* 2-Step Modal */}
          {selectedPlan && selectedPlan !== "free" && (
            <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
              <div className="bg-slate-900 w-full max-w-lg max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-slate-700 flex-shrink-0">
                  <h2 className="text-xl font-bold text-white uppercase tracking-wide">
                    {modalStep === "confirm"
                      ? "Confirm Subscription"
                      : "Complete Payment"}
                  </h2>
                  <button
                    onClick={() => {
                      setSelectedPlan(null);
                      setModalStep("confirm");
                    }}
                    className="text-slate-400 hover:text-white text-2xl"
                  >
                    ✕
                  </button>
                </div>

                {/* Step 1: Confirmation */}
                {modalStep === "confirm" && (
                  <div className="p-6 flex-1 overflow-y-auto">
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-white mb-2 uppercase tracking-wide">
                        {
                          SUBSCRIPTION_PLANS.find((p) => p.id === selectedPlan)
                            ?.name
                        }
                      </h3>
                      <div className="text-4xl font-bold text-white mb-2">
                        {formatPrice(
                          SUBSCRIPTION_PLANS.find((p) => p.id === selectedPlan)
                            ?.price_cents || 0,
                        )}
                        <span className="text-lg font-normal text-slate-400">
                          /month
                        </span>
                      </div>
                      <div className="text-slate-400 text-sm mb-6">
                        Cancel anytime • No setup fees
                      </div>
                    </div>

                    {/* Plan features */}
                    <div className="bg-slate-800 border border-slate-700 p-4 mb-6">
                      <h4 className="text-white font-bold uppercase tracking-wide mb-3 text-sm">
                        What's Included:
                      </h4>
                      <ul className="space-y-2">
                        {SUBSCRIPTION_PLANS.find((p) => p.id === selectedPlan)
                          ?.features.slice(0, 4)
                          .map((feature, index) => (
                            <li
                              key={index}
                              className="flex items-center space-x-2 text-sm"
                            >
                              <Check className="h-3 w-3 text-white flex-shrink-0" />
                              <span className="text-slate-300">{feature}</span>
                            </li>
                          ))}
                      </ul>
                    </div>

                    {/* Continue button */}
                    <Button
                      onClick={() => setModalStep("payment")}
                      className="w-full bg-slate-600 text-white hover:bg-slate-500 font-bold uppercase tracking-wide py-3"
                    >
                      Continue to Payment
                    </Button>

                    <div className="text-center mt-4">
                      <p className="text-slate-500 text-xs">
                        Secure payment processing by PayPal
                      </p>
                    </div>
                  </div>
                )}

                {/* Step 2: Payment */}
                {modalStep === "payment" && (
                  <div className="flex-1 overflow-y-auto">
                    <div className="p-6">
                      {/* Back button */}
                      <button
                        onClick={() => setModalStep("confirm")}
                        className="flex items-center text-slate-400 hover:text-white text-sm mb-4"
                      >
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Back to plan details
                      </button>

                      {/* Quick plan summary */}
                      <div className="bg-slate-800 border border-slate-700 p-3 mb-6 text-center">
                        <div className="text-white font-bold">
                          {
                            SUBSCRIPTION_PLANS.find(
                              (p) => p.id === selectedPlan,
                            )?.name
                          }
                        </div>
                        <div className="text-slate-300 text-sm">
                          {formatPrice(
                            SUBSCRIPTION_PLANS.find(
                              (p) => p.id === selectedPlan,
                            )?.price_cents || 0,
                          )}
                          /month
                        </div>
                      </div>

                      {/* Payment form container with proper height */}
                      <div className="min-h-[300px]">
                        <PayPalCheckout
                          planId={selectedPlan}
                          planName={
                            SUBSCRIPTION_PLANS.find(
                              (p) => p.id === selectedPlan,
                            )?.name || ""
                          }
                          amount={
                            SUBSCRIPTION_PLANS.find(
                              (p) => p.id === selectedPlan,
                            )?.price_cents || 0
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
