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
                <h3 className="font-bold text-white mb-2 uppercase tracking-wide">Payment processing failed</h3>
                <p className="text-slate-300">{paymentError}</p>
              </CardContent>
            </Card>
          )}
          {/* Current Usage (for free users) */}
          {user && !usageInfo?.isSubscribed && (
            <Card className="border border-black bg-slate-800 mb-8 max-w-2xl mx-auto">
              <CardContent className="p-6 text-center">
                <div className="bg-slate-700 border border-black p-3 mb-4">
                  <h3 className="font-bold text-white uppercase tracking-wide">Daily allocation status</h3>
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
                Premium access tiers
              </h2>
              <p className="text-slate-300 max-w-2xl mx-auto">
                Authorized subscription plans for enhanced K53 learner's license preparation. All tiers include location-specific scenarios certified for South African driving assessment standards.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {SUBSCRIPTION_PLANS.map((plan) => (
                <Card
                  key={plan.id}
                  className={`border relative ${plan.popular ? "border-white bg-slate-700" : "border-black bg-slate-800"}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-white text-slate-900 border border-black px-4 py-1 font-bold uppercase tracking-wide">
                        Recommended tier
                      </Badge>
                    </div>
                  )}

                  <CardHeader
                    className={`text-center ${plan.popular ? "bg-slate-600" : "bg-slate-700"} border-b border-black p-6`}
                  >
                    <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-slate-800 border border-black text-white">
                      {plan.id === "free" && <Zap className="h-8 w-8" />}
                      {(plan.id === "light" || plan.id === "basic") && <Users className="h-8 w-8" />}
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
                  </CardHeader>

                  <CardContent className="p-6">
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-3">
                          <Check className="h-4 w-4 text-white flex-shrink-0" />
                          <span className="text-slate-300 text-sm">
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
                      className={`w-full font-medium uppercase tracking-wide ${
                        plan.popular
                          ? "bg-white text-slate-900 hover:bg-slate-100"
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
          </div>

          {/* Scenario Packs */}
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4 uppercase tracking-wide">
                Regional scenario collections
              </h2>
              <p className="text-slate-300 max-w-2xl mx-auto">
                Specialized driving assessment scenarios for specific South African regional conditions. Individually certified preparation modules for enhanced local area competency.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {SCENARIO_PACKS.map((pack, index) => (
                <Card
                  key={index}
                  className="border border-black bg-slate-800 hover:bg-slate-750 transition-colors"
                >
                  <CardHeader className="bg-slate-700 border-b border-black p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-12 h-12 bg-slate-800 border border-black flex items-center justify-center">
                        <MapPin className="h-6 w-6 text-white" />
                      </div>
                      <Badge className="bg-slate-600 text-white border border-black text-xs uppercase tracking-wide">
                        {pack.scenario_count} scenarios
                      </Badge>
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
                      <div className="text-xs text-slate-400 text-right uppercase tracking-wide">
                        <div>{pack.location_region}</div>
                        {pack.location_city && <div>{pack.location_city}</div>}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6">
                    <Button
                      onClick={() => handleBuyPack(pack.name, pack.price_cents)}
                      className="w-full border border-black text-slate-300 hover:bg-slate-700 hover:text-white font-medium uppercase tracking-wide"
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
