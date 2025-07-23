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

function PricingComponent() {
  const { user } = useAuth();
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);
  const [usageInfo, setUsageInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);

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
  }, [user]);

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
      `Purchasing individual scenario packs will be available soon. For now, subscribe to SuperK53 Pro to get all packs included!`,
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
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <div className="bg-white border-b-2 border-black shadow-sm mb-8">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <Button
                asChild
                variant="ghost"
                className="text-slate-700 hover:text-slate-900 font-semibold uppercase tracking-wide"
              >
                <Link to="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Portal
                </Link>
              </Button>

              <div className="text-center">
                <h1 className="text-2xl font-bold text-slate-900 uppercase tracking-wide">
                  SuperK53 Pricing
                </h1>
                <p className="text-slate-600 uppercase text-sm tracking-wide">
                  Choose Your Learning Plan
                </p>
              </div>

              <div className="flex items-center space-x-2">
                {user && currentSubscription && (
                  <Badge className="bg-slate-800 text-white">
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
            <Card className="border-2 border-green-300 bg-green-50 mb-8 max-w-2xl mx-auto">
              <CardContent className="p-6 text-center">
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <h3 className="font-bold text-green-800 mb-2">
                  Payment Successful!
                </h3>
                <p className="text-green-700">{paymentSuccess}</p>
              </CardContent>
            </Card>
          )}

          {paymentError && (
            <Card className="border-2 border-red-300 bg-red-50 mb-8 max-w-2xl mx-auto">
              <CardContent className="p-6 text-center">
                <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-3" />
                <h3 className="font-bold text-red-800 mb-2">Payment Failed</h3>
                <p className="text-red-700">{paymentError}</p>
              </CardContent>
            </Card>
          )}
          {/* Current Usage (for free users) */}
          {user && !usageInfo?.isSubscribed && (
            <Card className="border-2 border-orange-300 bg-orange-50 mb-8 max-w-2xl mx-auto">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center space-x-2 mb-3">
                  <Zap className="h-5 w-5 text-orange-600" />
                  <h3 className="font-bold text-orange-800">Today's Usage</h3>
                </div>
                <p className="text-orange-700 mb-2">
                  You have{" "}
                  <span className="font-bold">
                    {usageInfo?.remaining || 0} scenarios
                  </span>{" "}
                  remaining today
                </p>
                <p className="text-sm text-orange-600">
                  Upgrade to SuperK53 for unlimited practice!
                </p>
              </CardContent>
            </Card>
          )}

          {/* Subscription Plans */}
          <div className="max-w-6xl mx-auto mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Subscription Plans
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Choose the perfect plan for your K53 preparation. All plans
                include location-aware scenarios tailored for South African
                driving conditions.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {SUBSCRIPTION_PLANS.map((plan) => (
                <Card
                  key={plan.id}
                  className={`border-2 relative ${plan.popular ? "border-orange-500 bg-orange-50" : "border-black bg-white"}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-orange-500 text-white px-4 py-1">
                        <Star className="h-3 w-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  <CardHeader
                    className={`text-center ${plan.popular ? "bg-orange-100" : "bg-slate-50"} p-6`}
                  >
                    <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-slate-800 text-white">
                      {plan.id === "free" && <Zap className="h-8 w-8" />}
                      {plan.id === "basic" && <Users className="h-8 w-8" />}
                      {plan.id === "pro" && <Crown className="h-8 w-8" />}
                    </div>
                    <CardTitle className="text-xl font-bold text-slate-900 mb-2">
                      {plan.name}
                    </CardTitle>
                    <p className="text-slate-600 text-sm mb-4">
                      {plan.description}
                    </p>
                    <div className="text-4xl font-bold text-slate-900">
                      {formatPrice(plan.price_cents)}
                      {plan.price_cents > 0 && (
                        <span className="text-lg font-normal text-slate-600">
                          /month
                        </span>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="p-6">
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-3">
                          <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <span className="text-slate-700 text-sm">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      onClick={() => handleSubscribe(plan.id)}
                      disabled={
                        currentSubscription?.plan_type === plan.id ||
                        plan.id === "free"
                      }
                      className={`w-full ${
                        plan.popular
                          ? "bg-orange-600 hover:bg-orange-700 text-white"
                          : "border-2 border-black text-slate-800 hover:bg-slate-800 hover:text-white"
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
          </div>

          {/* Scenario Packs */}
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Location-Based Scenario Packs
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Master driving in specific South African regions with our
                curated scenario packs. Perfect for learners who want extra
                practice in their local area.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {SCENARIO_PACKS.map((pack, index) => (
                <Card
                  key={index}
                  className="border-2 border-black bg-white hover:shadow-lg transition-shadow"
                >
                  <CardHeader className="bg-slate-100 p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-12 h-12 bg-slate-800 flex items-center justify-center">
                        <MapPin className="h-6 w-6 text-white" />
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {pack.scenario_count} scenarios
                      </Badge>
                    </div>
                    <CardTitle className="text-lg font-bold text-slate-900 mb-2">
                      {pack.name}
                    </CardTitle>
                    <p className="text-slate-600 text-sm mb-3">
                      {pack.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-slate-900">
                        {formatPrice(pack.price_cents)}
                      </span>
                      <div className="text-xs text-slate-500 text-right">
                        <div>{pack.location_region}</div>
                        {pack.location_city && <div>{pack.location_city}</div>}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6">
                    <Button
                      onClick={() => handleBuyPack(pack.name, pack.price_cents)}
                      className="w-full border-2 border-black text-slate-800 hover:bg-slate-800 hover:text-white"
                      variant="outline"
                    >
                      Buy Pack
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
                <h3 className="text-2xl font-bold mb-4">
                  Ready to Master K53?
                </h3>
                <p className="text-slate-200 mb-6">
                  Join thousands of South African learners who have passed their
                  K53 test with SuperK53
                </p>
                <Button
                  asChild
                  className="bg-white text-slate-800 hover:bg-slate-100 font-semibold px-8 py-3"
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
