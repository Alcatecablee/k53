import { useState, useEffect } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, CreditCard, User, AlertCircle } from "lucide-react";
import { env } from "@/lib/env";
import { useAuth } from "@/contexts/AuthContext";
import { logError } from "@/services/notificationService";


interface PayPalCheckoutProps {
  planId: string;
  planName: string;
  amount: number; // in cents
  currency?: string;
  onSuccess: (details: any) => void;
  onError: (error: any) => void;
  onCancel?: () => void;
}

export function PayPalCheckout({
  planId,
  planName,
  amount,
  currency = "ZAR",
  onSuccess,
  onError,
  onCancel,
}: PayPalCheckoutProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPayPal, setShowPayPal] = useState(false);
  const [paypalError, setPaypalError] = useState<string | null>(null);

  // Convert cents to currency amount
  const currencyAmount = (amount / 100).toFixed(2);

  // Handle PayPal initialization errors
  useEffect(() => {
    const handlePayPalError = (event: ErrorEvent) => {
      // Suppress normal PayPal initialization warnings
      if (event.error && event.error.message && event.error.message.includes('atob')) {
        setPaypalError("Payment system configuration error. Please refresh the page.");
        logError("PayPal atob error", event.error, "PayPalCheckout");
      }
    };

    // Suppress console warnings for PayPal global_session_not_found (normal initialization)
    const originalWarn = console.warn;
    console.warn = (...args) => {
      if (args[0] && typeof args[0] === 'string' && args[0].includes('global_session_not_found')) {
        return; // Suppress this specific warning
      }
      originalWarn.apply(console, args);
    };

    window.addEventListener('error', handlePayPalError);
    return () => {
      window.removeEventListener('error', handlePayPalError);
      console.warn = originalWarn; // Restore original console.warn
    };
  }, []);

  const initialOptions = {
    clientId: env.paypal.clientId!,
    currency: currency,
    intent: "capture",
    components: "buttons",
    "enable-funding": "card",
    "disable-funding": "paylater,credit,venmo",
    locale: "en_ZA", // South African locale
    environment: env.paypal.environment || "sandbox",
    "data-sdk-integration-source": "button-factory",
  };

  const createOrder = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${env.apiUrl}/paypal/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planId,
          amount: currencyAmount,
          currency,
          userId: user?.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error || "Failed to create order";
        logError("PayPal order creation failed", new Error(errorMessage), "createOrder");
        onError(new Error(errorMessage));
        return null;
      }



      return data.orderID;
    } catch (error) {
      logError("Error creating PayPal order", error, "createOrder");
      onError(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const onApprove = async (data: any) => {
    try {
      setLoading(true);
      const response = await fetch(`${env.apiUrl}/paypal/capture-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderID: data.orderID,
          planId,
          userId: user?.id,
        }),
      });

      const details = await response.json();

      if (!response.ok) {
        const errorMessage = details.error || "Failed to capture payment";
        logError("PayPal payment capture failed", new Error(errorMessage), "onApprove");
        onError(new Error(errorMessage));
        return;
      }



      onSuccess(details);
    } catch (error) {
      logError("Error capturing PayPal payment", error, "onApprove");
      onError(error);
    } finally {
      setLoading(false);
    }
  };

  if (!env.paypal.isConfigured || !env.paypal.clientId) {
    return (
      <Card className="border-2 border-slate-600 bg-slate-800">
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-8 w-8 text-white mx-auto mb-3" />
          <h3 className="font-bold text-white mb-2">
            Payment System Unavailable
          </h3>
          <p className="text-slate-300 text-sm mb-3">
            PayPal configuration is missing. Please check your .env file for PayPal credentials.
          </p>
          <p className="text-xs text-slate-400">
            Required: VITE_PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, VITE_PAYPAL_ENVIRONMENT
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Payment Options Header */}
      <Card className="border-2 border-black bg-slate-800">
        <CardHeader className="bg-slate-700 pb-4">
          <CardTitle className="text-lg font-bold text-white flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Choose Payment Method</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Payment Summary */}
            <div className="bg-slate-700 p-4 border border-slate-600">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-white">{planName}</span>
                <span className="text-xl font-bold text-white">
                  R{currencyAmount}
                </span>
              </div>
              <p className="text-sm text-slate-300">Monthly subscription</p>
            </div>

            {/* Recommended Payment Method */}
            <div className="space-y-2">
              <Button
                onClick={() => setShowPayPal(true)}
                className="w-full bg-white text-slate-900 hover:bg-slate-100 py-3 text-lg font-semibold"
                disabled={loading || showPayPal}
              >
                <CreditCard className="h-5 w-5 mr-2" />
                Pay with Card (Debit/Credit)
              </Button>

              <p className="text-xs text-slate-300 text-center">
                Secure payment processed by PayPal. No PayPal account required.
              </p>
            </div>

            {/* Alternative: PayPal Account */}
            {!showPayPal && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-sm text-slate-300">Or use:</span>
                </div>

                <Button
                  onClick={() => setShowPayPal(true)}
                  variant="outline"
                  className="w-full border-2 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white py-3"
                  disabled={loading}
                >
                  <User className="h-5 w-5 mr-2" />
                  PayPal Account
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* PayPal Buttons */}
      {showPayPal && (
        <Card className="border-2 border-black bg-slate-800">
          <CardContent className="p-6">
            <div className="text-center mb-4">
              <h3 className="font-semibold text-white mb-2">
                Complete Your Payment
              </h3>
              <p className="text-sm text-slate-300">
                Choose your preferred payment method below
              </p>

            </div>

            {paypalError ? (
              <div className="text-center p-4">
                <AlertCircle className="h-8 w-8 text-red-400 mx-auto mb-2" />
                <p className="text-red-400 text-sm">{paypalError}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => {
                    setPaypalError(null);
                    setShowPayPal(false);
                  }}
                >
                  Try Again
                </Button>
              </div>
            ) : (
              <PayPalScriptProvider options={initialOptions}>
                <PayPalButtons
                  style={{
                    shape: "rect",
                    layout: "vertical",
                    color: "black",
                    label: "pay",
                    height: 55,
                  }}
                  createOrder={createOrder}
                  onApprove={onApprove}
                  onError={(err) => {
                    logError("PayPal payment error", err, "PayPalCheckout");
                    setPaypalError("Payment system error. Please try again.");
                    onError(err);
                  }}
                  onCancel={() => {
                    // PayPal payment cancelled
                    onCancel?.();
                  }}
                  disabled={loading}
                  forceReRender={[currencyAmount, planId]} // Force re-render when props change
                />
              </PayPalScriptProvider>
            )}

            <div className="mt-4 text-center">
              <Button
                variant="ghost"
                onClick={() => setShowPayPal(false)}
                className="text-slate-300 hover:text-white"
                disabled={loading}
              >
                ← Back to payment options
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {loading && (
        <Card className="border-2 border-slate-600 bg-slate-800">
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-3"></div>
            <p className="text-white">Processing your payment...</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
